import is from 'is_js';
import XRegExp from 'xregexp';

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
    static baseSanitize(inputString){
        let output = String(inputString); // force to string
        
        // remove all non-word characters
        output = XRegExp.replace(output, XRegExp('[^-\\p{Letter}]', 'g'), '');
        
        // return the sanetized string
        return output;
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
        if(is.defined(options.sanitizer)){
            if(is.function(options.sanitizer)){
                this._sanitizers.push(options.sanitizer);
            }else{
                throw new TypeError('if passed, options.sanitizer must be a callback');
            }
        }
        if(is.defined(options.sanitizers)){
            if(is.array(options.sanitizers) && is.all.function(options.sanitizers)){
                this._sanitizers.push(...options.sanitizers);
            }else{
                throw new TypeError('if passed, options.sanitizers must be an array of callbacks');
            }
        }
        
        // load any provided words
        if(is.defined(wordSource)){
            if(is.array(wordSource) || is.function(wordSource)){
                this.loadWordsSync(wordSource);
            }else if(is.object(wordSource) && is.function(wordSource.then)){
                this.loadWordsAsync(wordSource);
            }
        }
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
     * @type {String[]}
     */
    get words(){
        return [...this._words];
    }
    
    /**
     * Build a word list from an array of strings.
     *
     * Each word in the array will be sanitized before being included in the list, and words that are too short will be omitted from the list.
     *
     * @param {String[]} words
     * @return {Object} Returns an object indexed by `words` & `rejectedWords`.
     * @throws {TypeError} A type error is thrown if invalid arguments are passed.
     */
    buildWordList(words){
        // validate args
        if(!(is.array(words) && is.all.string(words))){
            throw new TypeError('must pass an array of strings');
        }
        
        // process the words
        const ans = {
            words: [],
            rejectedWords: []
        };
        for(const word of words){
            let sanitizedWord = '';
            try{
                sanitizedWord = this.sanitize(word);
            }catch(err){
                ans.rejectedWords.push(word);
            }
            if(sanitizedWord.length < Dictionary.MIN_WORD_LENGTH){
                ans.rejectedWords.push(word);
            }
            ans.words.push(sanitizedWord);
        }
        
        // return the result
        return ans;
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
        if(is.no.defined(wordSource)) throw new TypeError('word source required, can be an array of strings or a callback that returns an array of strings');
        let words = [];
        if(is.array(wordSource)){
            if(!is.all.string(wordSource)){
                throw new TypeError('word source array can only contain strings');
            }
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
        return this.constructor.baseSanitzer(output);
    }
}

export default Dictionary;