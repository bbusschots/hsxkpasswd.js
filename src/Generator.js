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
        if(!(config instanceof Config || Config.definesPaddingDigits(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for the keys padding_digits_before & padding_digits_after');
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
     * Synchronously add the appropriate padding characters to the start and/or end of a string. 
     *
     * @param {string} str - The string to add the padding symbols to.
     * @param {(Object|Config)} config - A config object to control the generation of the separator character. Can be an instance of Config, or any object that defines a valid combination of the keys `padding_type`, `padding_character`, `padding_alphabet`, `symbol_alphabet`, `padding_characters_before`, `padding_characters_after` & `pad_to_length`.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @param {string} separatorCharacter - The separator character in use, if any.
     * @return {string}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static addPaddingCharactersSync(str, config, rns, separatorCharacter){
        if(is.not.string(str)){
            throw new TypeError('str must be a string');
        }
        if(!(config instanceof Config || Config.definesPaddingCharacters(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for config keys defining character padding');
        }
        if(!(rns instanceof RandomNumberSource && rns.sync)){
            throw new TypeError('rns must be a RandomNumberSource object supporting synchronous random number generation');
        }
        if(is.not.string(separatorCharacter) || separatorCharacter.length > 1){
            throw new TypeError('separatorCharacter required and must be a single character string or an empty string');
        }
        
        // short-curcuit padding_type NONE
        if(config.padding_type === 'NONE') return str;
        
        // figure out what character to pad with
        let padChar = '';
        switch(config.padding_character){
            case 'RANDOM':
                if(Config.isAlphabet(config.padding_alphabet)){
                    padChar = rns.randomItemSync(config.padding_alphabet);
                }else if(Config.isAlphabet(config.symbol_alphabet)){
                    padChar = rns.randomItemSync(config.symbol_alphabet);
                }else{
                    throw new TypeError('no alphabet found'); // should not be possible
                }
                break;
            case 'SEPARATOR':
                padChar = separatorCharacter;
                break;
            default:
                padChar = config.padding_character;
        }
        
        // figure out what type of padding to apply
        let ans = str;
        switch(config.padding_type){
            case 'NONE':
                return str;
            case 'FIXED':
                for(let i = 0; i < config.padding_characters_before; i++){
                    ans = padChar + ans;
                }
                for(let i = 0; i < config.padding_characters_after; i++){
                    ans += padChar;
                }
                break;
            case 'ADAPTIVE':
                if(str.length === config.pad_to_length){
                    return str;
                }else if(str.length > config.pad_to_length){
                    ans = ans.slice(0, config.pad_to_length);
                }else{
                    while(ans.length < config.pad_to_length){
                        ans += padChar;
                    }
                }
                break;
            default:
                throw new TypeError('invalid padding type'); // should not be possible
        }
        
        // return the padded string
        return ans;
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
        if(!(config instanceof Config || Config.definesCaseTransformation(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid values for config key case_transform');
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
                throw new TypeError(`invalid case_transform '${config.case_transform}'`); // should not be possible!
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
     * @return {string}
     * @throws {TypeError} A Type Error is thrown if invalid args are passed.
     * @throws {Error} An Error is thrown if the passed dictionary is not ready.
     */
    static generatePasswordsSync(config, dict, rns, n=1){
        // validate args
        if(!(config instanceof Config)){
            throw new TypeError('config must be a Config object');
        }
        if(!(dict instanceof Dictionary)){
            throw new TypeError('dict must be a Dictionary object');
        }
        dict.assertReady();
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('rns must be a RandomNumberSource object');
        }
        if(is.not.integer(n) || is.not.positive(n)){
            throw new TypeError('n must be a positibe integer');
        }
        
        // get the word list for the given config
        // returned words have accents removed if needed and any defined character replacements applied
        const words = dict.filteredWords(config);
        
        // build the passwords
        const ans = [];
        do{
            // start with a list of random words
            const parts = [];
            for(const randNum of rns.randomNumbersSync(config.num_words)){
                parts.push(words[RandomNumberSource.randomIndexFromRandomNumber(randNum, words.length)]);
            }
            
            // apply any needed case transforms
            this.applyCaseTransformationsSync(parts, config, rns);
        
            // pre-fix any needed digits
            this.addPaddingDigitsSync(parts, config, rns);
        
            // join the parts into a single string with the appropriate separator
            const sep = this.generateSeparatorSync(config, rns);
            let pass = parts.join(sep);
        
            // add the requested padding symbols, if any
            pass = this.addPaddingCharactersSync(pass, config, rns, sep);
            
            ans.push(pass);
        }while(ans.length < n);
        
        // return the generated passwords
        return ans;
    }
    
    /**
     * Synchronously determine or randomly select a separator based on a given configuration file. 
     *
     * @param {(Object|Config)} config - A config object to control the generation of the separator character. Can be an instance of Config, or any object that defines a valid combinatino of the keys `separator_character`, `separator_alphabet` & `symbol_alphabet`.
     * @param {RandomNumberSource} rns - A RandomNumberSource object with a syncronous random number generator.
     * @return {string} A separator character or the empty string.
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static generateSeparatorSync(config, rns){
        if(!(config instanceof Config || Config.definesSeparator(config))){
            throw new TypeError('config must be an HSXKPasswd Config object or a plain object with valid combination of values for the keys separator_character, separator_alphabet & symbol_alphabet');
        }
        if(!(rns instanceof RandomNumberSource)){
            throw new TypeError('config must be a RandomNumberSource object');
        }
        
        // figure out what separator type the config specifies
        if(config.separator_character === 'NONE'){
            return '';
        }else if(config.separator_character.length === 1){
            return config.separator_character;
        }else if(config.separator_character === 'RANDOM'){
            // figure out which alphabet to use
            let alphabet = [];
            if(Config.isAlphabet(config.separator_alphabet)){
                alphabet = config.separator_alphabet;
            }else if(Config.isAlphabet(config.symbol_alphabet)){
                alphabet = config.symbol_alphabet;
            }else{
                throw new TypeError('config.separator_character=RANDOM but neither config.separator_alphabet nor config.symbol_alphabet are defined'); // should not be possible
            }
            
            // if there's only one character in the alphabet, return it
            if(alphabet.length === 1) return alphabet[0];
            
            // return a random character from the alphabet
            return alphabet[rns.randomIndexSync(alphabet.length)];
        }else{
            throw new TypeError('invalid config.separator_character'); // should not be possible
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