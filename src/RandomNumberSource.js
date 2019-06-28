import is from 'is_js';

/**
 * The abstract class random number soource must extend.
 */
class RandomNumberSource{
    /**
     * Default Random Number Generator. `Uses Math.random()`.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @return {number[]} An array of numbers between zero and one.
    * @throws {TypeError} A Type Error is thrown on invalid args.
    */
    static defaultRNG(n=1){
    // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('if passed, n must be an integer greater than or equal to 1');
    
        // generate the required random numbers
        const ans = [];
        for(let i = 0; i < n; i++){
            ans.push(Math.random());
        }
    
        // return the required random numbers
        return ans;
    }
    
    /**
     * Generate a random zero-based index from a random number between 0 and 1.
     *
     * @param {number} randomNumber - A random number between 0 and 1.
     * @param {number} [length=2] - the length of the item for which a random index should be generated. Must be greater than or equal to 1.
     * @return {number} - a random integer between zero and one less than the length (inclusive).
     * @throws {TypeError} - a Type Error is thrown on invalid args
     */
    static randomIndexFromRandomNumber(randomNumber, length=2){
        // validate args
        if(!(is.number(randomNumber) && randomNumber >= 0 && randomNumber < 1)){
            throw new TypeError('random number must be greater than or equal to zero and less than one');
        }
        if(is.not.integer(length) || length < 1) throw new TypeError('length must be an integer greater than or equal to one');
        
        // short-circuit single-element items
        if(length === 1) return 0;
        
        // do the math!
        return Math.round(randomNumber * (length - 1));
    }
    
    /**
     * Generate a random boolean from a random number between 0 and 1.
     *
     * @param {number} randomNumber - A random number between 0 and 1.
     * @return {boolean}
     * @throws {TypeError} - a Type Error is thrown on invalid args
     */
    static randomBooleanFromRandomNumber(randomNumber){
        // validate args
        if(!(is.number(randomNumber) && randomNumber >= 0 && randomNumber < 1)){
            throw new TypeError('random number must be greater than or equal to zero and less than one');
        }
        
        // do the math!
        return Math.round(randomNumber) === 0 ? false : true;
    }
    
    /**
     * @param {(function|null)} [syncRNGCallback] - a callback to synchronously generate a specified number of random numbers. Defaults to `Math.random()`. Pass `null` to disable synchronous random number generation.
     * @param {function} [asyncRNGCallback] - a callback to asynchronously generate a specified number of random numbers. Defaults to a promise for the valuies returned by the synchronous callback or `Math.random()`.
     * @throws {TypeErrpr} A Type Error is thrown when invalid args are passed.
     */
    constructor(syncRNGCallback, asyncRNGCallback){
        // store the synchronous random number generation callback, if any
        if(is.undefined(syncRNGCallback)){
            this._syncRNG = this.constructor.defaultRNG;
        }else if(is.null(syncRNGCallback)){
            this._syncRNG = null;
        }else if(is.function(syncRNGCallback)){
            this._syncRNG = syncRNGCallback;
        }else{
            throw new TypeError('synchronous random number generation callback must be a function or null');
        }
        
        // store or generate an asynchronous callback
        if(is.undefined(asyncRNGCallback)){
            if(this.sync){
                this.asyncRNG = (n)=>{ Promise.resolve(this._syncRNG(n)); };
            }else{
                this.asyncRNG = (n)=>{ Promise.resolve(this.constructor.defaultRNG(n)); };
            }
        }else if(is.function(asyncRNGCallback)){
            this.asyncRNG = asyncRNGCallback;
        }else{
            throw new TypeError('if passed, the asynchronous random number generation callback must be a function');
        }
    }
    
    /**
     * Whether or not this generator can generate passwords synchronously.
     *
     * @type {boolean}
     */
    get isSynchronous(){
        return is.function(this._syncRNG) ? true : false;
    }
    
    /**
     * Alias for `.isSynchronous`.
     */
    get sync(){ return this.isSynchronous; }
    
    /**
     * Synchronously generate random booleans.
     * @param {number} [n=1] - the number of random booleans to generate.
     * @return {boolean[]}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomBooleansSync(n=1){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // generate random numbers, convert them to Booleans, and return
        const rns = this.randomNumbersSync(n);
        return rns.map((rn)=>{ return this.constructor.randomBooleanFromRandomNumber(rn); });
    }
    
    /**
     * Synchronously generate a random boolean.
     *
     * @return {boolean}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomBooleanSync(){
        return this.randomBooleansSync(1)[0];
    }
    
    /**
     * Synchronously generate random digits.
     * @param {number} [n=1] - the number of random digits to generate.
     * @return {number[]}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomDigitsSync(n=1){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // return random indexes of length 10
        return this.randomIndexesSync(n, 10);
    }
    
    /**
     * Synchronously generate a random digit.
     *
     * @return {number}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomDigitSync(){
        return this.randomDigitsSync(1)[0];
    }
    
    /**
     * Synchronously generate random indexes.
     * @param {number} [n=1] - the number of random booleans to generate.
     * @param {number} [length=2] - the length of the item for which to generate random indexes.
     * @return {number[]} Returns and array of numbers greater than or equal to zero and less than the length.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomIndexesSync(n=1, length=2){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        if(is.not.integer(length) || length < 2) throw new TypeError('length must be an integer greater than or equal to two');
        
        // generate random numbers, convert them to indexes, and return
        const rns = this.randomNumbersSync(n);
        return rns.map((rn)=>{ return this.constructor.randomIndexFromRandomNumber(rn, length); });
    }
    
    /**
     * Synchronously generate a random index.
     *
     * @param {number} [length=2] - the length of the item for which to generate random indexes.
     * @return {boolean}
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns an invalid value.
     * @throws {Error} An Error is thrown if synchronous random number generation fails.
     */
    randomIndexSync(length){
        return this.randomIndexesSync(1, length)[0];
    }
    
    /**
     * Synchronously generate random numbers.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @return {number[]} Returns and array of numbers greater than or equal to zero and less than one.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns invaid data.
     * @throws {Error} An Error is thrown if the random number source does not support synchronous random number generation.
     */
    randomNumbersSync(n=1){
        // make sure can synchronously generate random numbers
        if(!this.sync) throw new Error('synchronous random number geneation not supported on this Random Number Source'); 
        
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        
        // generate the random numbers
        const ans = this._syncRNG(n);
        
        // validate the generated numbers
        if(is.not.array(ans)) throw new TypeError('synchronous random number generator callback did not return an array');
        if(ans.length !== n) throw new TypeError(`synchronous random number generator returned wrong number of numbers: needed ${n}, got ${ans.length}`);
        if(!is.all.number(ans)) throw new TypeError('synchronous random number generator returned and array that contained a value other than a number');
        for(const rn of ans){
            if(rn < 0 || rn >= 1) throw new TypeError('synchronous random number generator returned and array that contained a number that is not greater than or equal to zero and less than one');
        }
        
        // return the numbers
        return ans;
    }
    
    /**
     * Synchronously generate a random number.
     *
     * @return {number} Returns a number gerater than or equal to zero and less than one.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns invaid data.
     * @throws {Error} An Error is thrown if the random number source does not support synchronous random number generation.
     */
    randomNumberSync(){
        return this.randomNumbersSync(1)[0];
    }
    
    /**
     * Generate random numbers asynchronously.
     *
     * @param {number} [n=10] - the number of random numbers to generate.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns a value other than an array of numbers between zero and one.
     */
}

export default RandomNumberSource;