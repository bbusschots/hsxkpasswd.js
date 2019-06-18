/**
 * An HSXKPasswd password generator.
 */
class Generator{
    /**
     * @param {Config} config - An HSXKPasswd password generation config.
     * @param {Dictionary} dictionary - The dictionary to use when generating passwords.
     */
    constructor(config, dictionary){
        this._config = config;
        this._dictionary = dictionary;
    }
    
    get config(){ return this._config; }
    
    set config(c){
        this._config = c;
    }
    
    /**
     * Generate passwords.
     *
     * @param {number} [n=1] - the number of passwords to generate.
     * @return {string[]}
     */
    async generatePasswords(n=1){
        const ans = [];
        for(let i = 0; i < n; i++){
            ans.push('PASSWORD');
        }
        return ans;
    }
}

export default Generator;