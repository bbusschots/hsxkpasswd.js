// import _ from 'lodash';
import is from 'is_js';
import Config from './Config.js';
import Dictionary from './Dictionary.js';
import RandomNumberSource from './RandomNumberSource.js';

/**
 * An HSXKPasswd password generator.
 */
class Generator{
    /**
     * Synchronously add the appropriate number of padding digits to the start and end of an array of words. Changes are applied in-place. The array is returned purely for convenience. 
     *
     * @param {String[]} words - The array contianing the words. Items will be added into this array in-place.
     * @param {(Object|Config)} config - A config object to control the number of digits inserted (if any). Can be an instance of Config, or any object that defines the keys `padding_digits_before` & `padding_digits_after` with valid values.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {String[]} The same array passed as the first argument.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static addPaddingDigitsSync(words, config, rns){
        if(!(is.array(words) && is.all.string(words))){
            throw new TypeError('words must be an array of strings');
        }
        if(!(config instanceof Config || is.object(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid value for the keys padding_digits_before & padding_digits_after');
        }
        if(!(is.integer(config.padding_digits_before) && is.not.negative(config.padding_digits_before))){
            throw new TypeError('config.padding_digits_before must be an integer greater than or equal to zero.');
        }
        if(!(is.integer(config.padding_digits_after) && is.not.negative(config.padding_digits_after))){
            throw new TypeError('config.padding_digits_after must be an integer greater than or equal to zero.');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        
        // insert the required prefixed digits
        if(config.padding_digits_before > 0){
            words.unshift(rns.randomDigitsSync(config.padding_digits_before).join(''));
        }
        
        // insert the required postfixed digits
        if(config.padding_digits_after > 0){
            words.push(rns.randomDigitsSync(config.padding_digits_after).join(''));
        }
        
        // return a reference to the passed array
        return words;
    }
    
    /**
     * Synchronously Apply the appropraite case transformations to an array of words. Changes are applied in-place. The array is returned purely for convenience. 
     *
     * @param {String[]} words - The array contianing the words to be transformed. The contents of this array will be altered in-place.
     * @param {(Object|Config)} config - A config object to control the transformations applied (if any). Can be an instance of Config, or any object that defines the key `case_transform` with a valid value.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {String[]} The same array passed as the first argument.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static applyCaseTransformationsSync(words, config, rns){
        if(!(is.array(words) && is.all.string(words))){
            throw new TypeError('words must be an array of strings');
        }
        if(!((config instanceof Config || (is.object(config)) && is.string(config.case_transform)))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with a valid value for the key case_transform');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        
        // short-circuit the no transorfmation
        if(config.case_transform === 'NONE') return words;
        
        // figure out what transformations to apply, if any.
        switch(config.case_transform){
            case 'ALTERNATE':
                // randomly choose to capitalise odd or even
                const toLower = (s)=>{ return s.toLowerCase(); };
                const toUpper = (s)=>{ return s.toUpperCase(); };
                let transEven = toLower;
                let transOdd = toUpper;
                if(rns.randomBooleanSync()){
                    transEven = toUpper;
                    transOdd = toLower;
                }
                for(let i = 0; i < words.length; i++){
                    if(i % 2 === 0){
                        words[i] = transEven(words[i]);
                    }else{
                        words[i] = transOdd(words[i]);
                    }
                }
                break;
            case 'CAPITALISE':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toLowerCase();
                    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
                break;
            case 'INVERT':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toUpperCase();
                    words[i] = words[i].charAt(0).toLowerCase() + words[i].slice(1);
                }
                break;
            case 'LOWER':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toLowerCase();
                }
                break;
            case 'RANDOM':
                for(let i = 0; i < words.length; i++){
                    words[i] = rns.randomBooleanSync() ? words[i].toLowerCase() : words[i].toUpperCase();
                }
                break;
            case 'UPPER':
                for(let i = 0; i < words.length; i++){
                    words[i] = words[i].toUpperCase();
                }
                break;
            default:
                throw new TypeError(`invalid case_transform '${config.case_transform}'`);
        }
        
        // return a reference to the passed array
        return words;
    }
    
    /**
     * Synchronously Generate a password.
     *
     * @param {Config} config
     * @param {Dictionary} dict
     * @param {RandomNumberSource} rns
     * @param {number} [n=1]
     */
    static generatePasswordsSync(config, dict, rns, n=1){
        // validate args
        if(!(config instanceof Config)){
            throw new TypeError('config must be a Config object');
        }
        if(!(dict instanceof Dictionary)){
            throw new TypeError('config must be a Dictionary object');
        }
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('config must be a RandomNumberSource object');
        }
        if(is.not.integer(n) || is.not.positive(n)){
            throw new TypeError('n must be a positibe integer');
        }
        
        // get the word list for the given config
        const words = dict.filteredWords(config);
        
        // build the passwords
        const ans = [];
        do{
            // start with a list of random words
            const parts = [];
            for(const randNum of rns.randomNumbersSync(config.num_words)){
                parts.push(words[RandomNumberSource.randIndex(randNum, words.length)]);
            }
            
            // apply any needed case transforms
            this.applyCaseTransformationsSync(parts, config, rns);
        
            // pre-fix any needed digits
            this.addPaddingDigitsSync(parts, config, rns);
        
            // join the parts into a single string with the appropriate separator
            const sep = this.generateSeparatorSync(config, rns);
            const pass = parts.join(sep);
        
            // add the requested padding symbols, if any
            // TO DO - LEFT OFF HERE!!!
            
            ans.push(pass);
        }while(ans.length < n);
        
        // return the generated passwords
        return ans;
    }
    
    /**
     * Synchronously determine or randomly select a separator based on a given configuration file. 
     *
     * @param {(Object|Config)} config - A config object to control the number of digits inserted (if any). Can be an instance of Config, or any object that defines a valid combinatino of the keys `separator_character`, `separator_alphabet` & `symbol_alphabet`.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {string} A separator character or the empty string.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static generateSeparatorSync(config, rns){
        if(!(config instanceof Config || is.object(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid combination of values for the keys separator_character, separator_alphabet & symbol_alphabet');
        }
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('config must be a RandomNumberSource object');
        }
        if(is.not.string(config.separator_character)){
            throw new TypeError('config.separator_character must be a string');
        }
        if(is.not.undefined(config.separator_alphabet) && !Config.isAlphabet(config.separator_alphabet)){
            throw new TypeError('if present, config.separator_alphabet must be an array of single-character strings');
        }
        if(is.not.undefined(config.symbol_alphabet) && !Config.isAlphabet(config.symbol_alphabet)){
            throw new TypeError('if present, config.symbol_alphabet must be an array of single-character strings');
        }
        
        // figure out what separator type the config specifies
        if(config.separator_character === 'NONE'){
            return '';
        }else if(config.separator_character.length === 1){
            return config.separator_character;
        }else if(config.separator_character === 'RANDOM'){
            // figure out which alphabet to use
            let alphabet = [];
            if(config.separator_alphabet){
                alphabet = config.separator_alphabet;
            }else if(config.symbol_alphabet){
                alphabet = config.symbol_alphabet;
            }else{
                throw new TypeError('config.separator_character=RANDOM but neither config.separator_alphabet nor config.symbol_alphabet are defined');
            }
            
            // return a random character from the alphabet
            return alphabet[rns.randomIndexSync(alphabet.length)];
        }else{
            throw new TypeError('invalid config.separator_character');
        }
    }
    
    /**
     * @param {Config} config - An HSXKPasswd password generation config.
     * @param {Dictionary} dictionary - The dictionary to use when generating passwords.
     * @param {RandomNumberSource} randomNumberSource - The source for the random numbers used to generate the passwords.
     */
    constructor(config, dictionary, randomNumberSource){
        this._config = config;
        this._dictionary = dictionary;
        this._randomNumberSource = randomNumberSource;
    }
    
    /**
     * @type {Config}
     */
    get config(){ return this._config; }
    
    /**
     * Generate passwords synchronously.
     *
     * @param {number} [n=1] - the number of passwords to generate.
     * @return {string[]}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     * @throws {Error} An error is thrown if the generator's dictionary is not ready.
     */
    generatePasswordsSync(n=1){
        // make sure the dictionary is ready
        if(!this._dictionary.ready) throw new Error('dictionary not ready');
        
        // validate args
        if(!(is.integer(n) && n > 0)) throw new TypeError('if present, n must be an integer greater than zero');
        
        const ans = [];
        for(let i = 0; i < n; i++){
            ans.push('PASSWORD');
        }
        return ans;
    }
}

export default Generator;