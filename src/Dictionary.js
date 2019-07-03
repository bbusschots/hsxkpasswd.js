import diacritics from 'diacritics';
import is from 'is_js';
import XRegExp from 'xregexp';
import DEFAULT_WORD_LIST from './wordLists/EN_default.js';

/**
 * A dictionary to select words from when generating passwords.
 */
class Dictionary{
    /**
     * @type {number}
     */
    static get MIN_WORD_LENGTH(){
        return 4;
    }
    
    /**
     * The base word sanitization function.
     *
     * This function performs the following actions:
     * 1. remove all non-word characters except the simple dash (accented characters are retained)
     *
     * Regardless of how many additional sanitizers a dictionary has, this function is always called as the final sanitizer by the instance sanitizer function.
     *
     * @param {string} inputString - The string to be sanitized
     * @return {string} The sanitized string.
     * @note Using XRegExp for now until ES2018's Unicode property macting in REs is supported in FireFox & Edge.
     */
    static baseSanitizer(inputString){
        let output = String(inputString); // force to string
        
        // remove all non-word characters
        output = XRegExp.replace(output, XRegExp('[^-\\p{Letter}]', 'g'), '');
        
        // return the sanetized string
        return output;
    }
    
    /**
     * Build a Dictionary object from the default word list.
     *
     * @return {Dictionary}
     */
    static defaultDictionary(){
        return new Dictionary(DEFAULT_WORD_LIST);
    }
    
    /**
     * Strip diacritics from a string. I.e. 'cliché' becomes 'cliche'.
     *
     * @param {string} inputString
     * @return {string}
     */
    static stripDiacritics(inputString){
        return diacritics.remove(inputString);
    }
    
    /**
     * @param {(String[]|function|Promise)} [wordSource] - The source for the words.
     *
     * The source can be one of:
     * 1. An array of strings
     * 2. A callback that returns an array of strings
     * 3. A Promose for an array of strings.
     *
     * If the source is a promise the words are loaded asynchronously, otherwise they are loaded synchronously.
     * 
     * @param {Object} [options={}] - An optional options object.
     * @param {function} [options.sanitizer] - An additional sanitizer to be run before base sanitizer. Will be called with a string as an argument, and must return a string.
     * @param {function[]} [options.sanitizers] - An array of additional sanitizers to be run befor ethe base sanitizer. Will be called with a string as an argument, and must return a string.
     * @throws {TypeError} Throws a type error on invalid args
     */
    constructor(wordSource, options={}){
        this._words = [];
        this._sanitizers = [];
        this._wordsPromise = null;
        this._loadInProgress = false;
        this._lastLoadStats = {
            numLoaded: 0,
            numRejected: 0,
            rejectedWords: []
        };
        
        // process the options
        if(is.not.object(options)) throw new TypeError('if passed, options must be an object');
        if(is.not.undefined(options.sanitizer)){
            if(is.function(options.sanitizer)){
                this._sanitizers.push(options.sanitizer);
            }else{
                throw new TypeError('if passed, options.sanitizer must be a callback');
            }
        }
        if(is.not.undefined(options.sanitizers)){
            if(is.array(options.sanitizers) && is.all.function(options.sanitizers)){
                this._sanitizers.push(...options.sanitizers);
            }else{
                throw new TypeError('if passed, options.sanitizers must be an array of callbacks');
            }
        }
        
        // load any provided words
        if(is.not.undefined(wordSource)){
            if(is.array(wordSource) || is.function(wordSource)){
                this.loadWordsSync(wordSource);
            }else if(is.object(wordSource) && is.function(wordSource.then)){
                this.loadWordsAsync(wordSource);
            }
        }
    }
    
    /**
     * @type {String[]}
     */
    get allWords(){
        return [...this._words];
    }
    
    /**
     * @type {Object}
     */
    get lastLoadStats(){
        return _.cloneDeep(this._lastLoadStats);
    }
    
    /**
     * @type {boolean}
     */
    get ready(){
        return this._loadInProgress === false && this._words.length >= 0;
    }
    
    /**
     * @type {function[]}
     */
    get sanitizers(){
        return [...this._sanitizers];
    }
    
    /**
     * Assert that the dictionary is ready.
     *
     * @return {boolean} Always returns `true`.
     * @throws {Error} Throws an Error if the dictionary is not ready.
     */
    assertReady(){
        if(!this.ready) throw new Error('dictionary not ready');
        return true;
    }
    
    /**
     * Build a word list from an array of strings.
     *
     * Each word in the array will be sanitized before being included in the list, and words that are too short will be omitted from the list. Anything in the array that is not a string will be ignored.
     *
     * @param {String[]} words
     * @return {Object} Returns an object indexed by `words` & `rejectedWords`.
     * @throws {TypeError} A type error is thrown if invalid arguments are passed.
     */
    buildWordList(words){
        // validate args
        if(is.not.array(words)){
            throw new TypeError('must pass an array of strings');
        }
        
        // process the words
        const ans = {
            words: [],
            rejectedWords: []
        };
        for(const word of words){
            if(is.not.string(word)){
                ans.rejectedWords.push(word);
                continue;
            }
            let sanitizedWord = '';
            try{
                sanitizedWord = this.sanitize(word);
            }catch(err){
                ans.rejectedWords.push(word);
                continue;
            }
            if(sanitizedWord.length < Dictionary.MIN_WORD_LENGTH){
                ans.rejectedWords.push(word);
                continue;
            }
            ans.words.push(sanitizedWord);
        }
        
        // sort and de-duplicate the words
        ans.words = _.uniq(ans.words);
        ans.words.sort();
        
        // return the result
        return ans;
    }
    
    /**
     * Get the words for a given set of constraints.
     *
     * @param {Object} constraints - An object specifting the constraints. Usually an HSXKPasswd Config object.
     * @param {number} constraints.word_length_min - the minimum length of words to include.
     * @param {number} constraints.word_length_max - the maximum length of words to include.
     * @param {boolean} [constraints.allow_accents=false] - whether or not accents should be stripped from accented characters. Defaults to false.
     * @param {object} [constraints.character_substitutions={}] - any character substitutions to apply before returning the words. Defaults to none.
     * @return {String[]}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     * @throws {Error} An Error is thrown if the Dictionary is not ready
     */
    filteredWords(constraints){
        // make sure the dictionary is ready
        if(!this.ready) throw new Error('Dictionary not ready');
        
        // validate constraints
        if(is.not.object(constraints)) throw new TypeError('constraints are required and must be passed as an object');
        if(!(is.integer(constraints.word_length_min) && constraints.word_length_min >= Dictionary.MIN_WORD_LENGTH)){
            throw new TypeError(`constraints.word_length_min must be an integer greater than or equal to ${Dictionary.MIN_WORD_LENGTH} and less than or equal to word_length_max`);
        }
        if(!(is.integer(constraints.word_length_max) && constraints.word_length_max >= Dictionary.MIN_WORD_LENGTH)){
            throw new TypeError(`constraints.word_length_max must be an integer greater than or equal to ${Dictionary.MIN_WORD_LENGTH} and greater than or equal to word_length_min`);
        }
        if(constraints.word_length_min > constraints.word_length_max){
            throw new TypeError('constraints.word_length_min must be less than or equal to constraints.word_length_max');
        }
        if(is.not.undefined(constraints.character_substitutions)){
            const subsErrMsg = 'if present, constraints.character_substitutions must be an object mapping single characters to strings';
            if(is.not.object(constraints.character_substitutions)) throw new TypeError(subsErrMsg);
            for(const c of Object.keys(constraints.character_substitutions)){
                if(!XRegExp.match(c, XRegExp('^\\p{Letter}$'))) throw new TypeError(subsErrMsg);
                if(is.not.string(constraints.character_substitutions[c])) throw new TypeError(subsErrMsg);
            }
        }
        const validatedConstraints = {
            word_length_min: constraints.word_length_min,
            word_length_max: constraints.word_length_max,
            allow_accents: is.undefined(constraints.allow_accents) ? false : constraints.allow_accents ? true : false,
            character_substitutions: constraints.character_substitutions ? constraints.character_substitutions : {}
        };
        
        // loop through all words, apply any specified substitutions, then test against criteria
        const fiteredWords = [];
        for(let word of this._words){
            // apply substitutions
            for(const c of Object.keys(validatedConstraints.character_substitutions)){
                word = word.replace(c, validatedConstraints.character_substitutions[c]);
            }
            
            // test against constraints
            if(word.length < validatedConstraints.word_length_min) continue;
            if(word.length > validatedConstraints.word_length_max) continue;
            if(validatedConstraints.allow_accents){
                fiteredWords.push(word);
            }else{
                // strip diacritics then store
                fiteredWords.push(Dictionary.stripDiacritics(word));
            }
        }
        
        // return the filtered words
        return fiteredWords;
    }
    
    /**
     * Synchronously Load words into the dictionary, replacing any existing words.
     *
     * Each word will be sanitized, and words that don't meet the minimum length or throw an error during sanitation will be rejected.
     *
     * @param {(String[]|function|Promise)} wordSource - The source for the words. Can be:
     * 1. An array of strings
     * 2. A callback that returns an array of strings
     * @return {Object} Returns an object indexed by `numLoaded`, `numRejected` & `rejectedWords`.
     * @throws {TypeError} A Type Error is thrown if invalid args are passed.
     * @throws {Error} An error is thrown if there is already a load in progress.
     */
    loadWordsSync(wordSource){
        // get the words from the word source
        if(is.undefined(wordSource)) throw new TypeError('word source required, can be an array of strings or a callback that returns an array of strings');
        let words = [];
        if(is.array(wordSource)){
            words = wordSource;
        }else if(is.function(wordSource)){
            words = wordSource();
            if(!(is.array(words) && is.all.string(words))){
                throw new TypeError('callback did not return an array of strings');
            }
        }
        
        // build a word list from the words
        const wordList = this.buildWordList(words);
        
        // make sure there is not another load in progress
        if(this._loadInProgress) throw new Error('another load is already in progress');
        
        // store the words + stats
        const stats = {
            numLoaded: wordList.words.length,
            numRejected: wordList.rejectedWords.length,
            rejectedWords: wordList.rejectedWords
        };
        this._words = wordList.words;
        this._lastLoadStats = stats;
        this._wordsPromise = Promise.resolve(wordList.words);
        
        // return the stats
        return _.cloneDeep(stats);
    }
    
    /**
     * Asynchronously Load words into the dictionary, replacing any existing words.
     *
     * Each word will be sanitized, and words that don't meet the minimum length or throw an error during sanitation will be rejected.
     *
     * @param {(Promise} wordsPromise - A promise for an array of Strings.
     * @return {Object} Returns a promise for an object indexed by `numLoaded`, `numRejected` & `rejectedWords`.
     * @throws {TypeError} A Type Error is thrown if invalid args are passed.
     * @throws {Error} An error is thrown if there is already a load in progress.
     */
    async loadWordsAsync(wordsPromise){
        // if there's already another load in progress, throw an error
        if(this._loadInProgress){
            throw new Error('load already in progress');
        }
        
        // mark a load as being in progress and blank the words list
        this._loadInProgress = true;
        this._words = [];
        
        // build a promise for a word list generated from the word source
        const wordListPromise = wordsPromise.then(
            (words)=>{ // resolved handler
                return this.buildWordList(words);
            }
        );
        
        // build and store a promise for the words
        this._wordsPromise = wordListPromise.then(
            function(wordList){
                return wordList.words();
            }
        );
        
        // await the resolution of the word list promise
        const wordList = await wordListPromise;
        const stats = {
            numLoaded: wordList.words.length,
            numRejected: wordList.rejectedWords.length,
            rejectedWords: wordList.rejectedWords
        };
        
        // store the words + stats and mark the load as complete
        this._words = wordList.words;
        this._lastLoadStats = stats;
        this._loadInProgress = false;
        
        // return the stats
        return _.cloneDeep(stats);
    }
    
    /**
     * Sanitise a string. This function will be called on each word before it is added to the word list.
     *
     * This function executes all custom sanitizers on the passed string, and then the base sanitzer.
     *
     * @param {string} inputString
     * @return {string}
     */
    sanitize(inputString){
        let output = inputString;
        
        // apply each sanitizer in turn
        for(const sanitizer of this.sanitizers){
            output = sanitizer(String(output));
        }
        
        // apply the base sanitzer and return
        return Dictionary.baseSanitizer(output);
    }
}

export default Dictionary;