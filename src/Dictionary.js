import is from 'is_js';
import XRegExp from 'xregexp';

/**
 * A dictionary to select words from when generating passwords.
 */
class Dictionary{
    /**
    * The base word sanitization function.
    *
    * This function performs the following actions:
    * 1. remove all non-word characters except the simple dash (accented characters are retained)
    *
    * For now, this is the only sanetization that will be performed on each word as its added to the word list, but in future its envisaged that additional sanetizers could be registered. Even then, this santeizer would always be applied first.
    *
    * @param {string} inputString - The string to be sanitized
    * @return {string} The sanitized string.
    * @note Using XRegExp for now until ES2018's Unicode property macting in REs is supported in FireFox & Edge.
    */
    static sanitize(inputString){
        let output = String(inputString); // force to string
        
        // remove all non-word characters
        output = XRegExp.replace(output, XRegExp('[^-\\p{Letter}]', 'g'), '');
        
        // return the sanetized string
        return output;
    }
    
    /**
     * @param {(String[]|function)} wordSource - the source for the words, either an array of strings, or, a callback that returns an array of strings or a promise to an array of strings.
     * @throws {TypeError} Throws a type error on invalid args
     */
    constructor(wordSource){
        this._ready = false;
        this._wordFetcher = null;
        this._words = [];
        
        // figure out where the words will come from
        if(is.array(wordSource)){
            // words coming from an array
            
            // make sure we got only strings
            if(!is.all.string(wordSource)){
                throw new TypeError("word array must only contain strings");
            }
            
            // filter and store the strings
            
        }
    }
}

export default Dictionary;