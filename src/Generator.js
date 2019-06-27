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
        if(!(rns instanceof RandomNumberSoure)){
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
            this.applyCaseTransformationsSync(parts, config);
        
            // pre-fix any needed digits
            // TO DO - LEFT OFF HERE!!!
        
            // join the parts into a single string with the appropriate separator
            // TO DO
        
            // add the requested padding, if any
            // TO DO
        }while(ans.length < n);
        
        // return the generated passwords
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
        if(!(config instanceof Config || (is.object(config) && is.string(config.case_transform)))){
            throw new TypeError('config must be an HSXKPasswd Config object');
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