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
     * Generate random numbers synchronously.
     *
     * @param {number} [n=1] - the number of random numbers to generate.
     * @param {number} [min=0] - the lower limit for the number range.
     * @param {number} [max=1] - the upper limit for the number range.
     * @return {number[]} Returns and array of integers between min and max inclusive.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns a value other than an array of numbers between zero and one.
     */
    randomNumbersSync(n=1, min=0, max=1){
        // validate args
        if(is.not.integer(n) || n < 1) throw new TypeError('n must be an integer greater than or equal to one');
        if(is.not.integer(min)) throw new TypeError('min must be an integer');
        if(is.not.integer(max)) throw new TypeError('max must be an integer');
        
        // generate the random numbers and validate them
        const ans = this._syncRNG(n);
        if(is.not.array(ans)) throw new TypeError('synchronous random number generator callback did not return an array');
        if(!(is.all.number(ans) && is.all.within(ans, 0, 1))) throw new TypeError('synchronous random number generator returned and array that contained invalid values');
        if(ans.length !== n) throw new TypeError(`synchronous random number generator returned wrong number of numbers: needed ${n}, got ${ans.length}`);
        
        // return the random numbers
        return ans;
    }
    
    /**
     * Generate random numbers asynchronously.
     *
     * @param {number} [n=10] - the number of random numbers to generate.
     * @throws {TypeError} A Type Error is thrown when invalid arguments are passed or the random number generator callback returns a value other than an array of numbers between zero and one.
     */
}

export default RandomNumberSource;