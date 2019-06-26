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
     * An alias for `randomIndexFromRandomNumber()`.
     */
    static randIndex(){ return this.randomIndexFromRandomNumber(...arguments); }
    
    /**
     * @param {function} [syncRNGCallback] - a callback to synchronously generate a specified number of random numbers. Defaults to `Math.random()`.
     * @param {function} [asyncRNGCallback] - a callback to asynchronously generate a specified number of random numbers. Defaults to a promise of `Math.random()`.
     */
    constructor(syncRNGCallback, asyncRNGCallback){
        if(is.function(syncRNGCallback)){
            this._syncRNG = syncRNGCallback;
        }else{
            this._syncRNG = defaultRNG;
        }
        if(is.function(asyncRNGCallback)){
            this.asyncRNG = asyncRNGCallback;
        }else{
            this.asyncRNG = ()=>{ Promise.resolve(this._syncRNG()); };
        }
    }
    
    /**
     * Synchronously generate random numbers.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @return {number[]} Returns and array of integers between min and max inclusive.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns a value other than an array of numbers between zero and one.
     */
    randomNumbersSync(n=1){
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
     * @return {number[]} Returns and array of integers between min and max inclusive.
     * @throws {TypeError} A Type Error is thrown when the random number generator callback returns a value other than an array of numbers between zero and one.
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