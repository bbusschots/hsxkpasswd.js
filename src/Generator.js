// import _ from 'lodash';
import is from 'is_js';
import Config from './Config.js';
import Dictionary from './Dictionary.js';

/**
 * An HSXKPasswd password generator.
 */
class Generator{
    /**
     * Generate a password.
     *
     * @param {Config} config
     * @param {Dictionary} dict
     * @param {RandomNumberSource} rns
     */
    generatePassword(config, dict, rns){
        // validate args
        if(!(config instanceof Config)){
            throw new Error('config must be a Config object');
        }
        if(!(dict instanceof Dictionary)){
            throw new Error('config must be a Config object');
        }
        // TO DO - validate rns
        // LEFT OFF HERE!!!
    }
    
    /**
     * @param {Config} config - An HSXKPasswd password generation config.
     * @param {Dictionary} dictionary - The dictionary to use when generating passwords.
     */
    constructor(config, dictionary){
        this._config = config;
        this._dictionary = dictionary;
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