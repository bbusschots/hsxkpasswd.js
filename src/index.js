import Generator from './Generator.js';
import Config from './Config.js';
import Dictionary from './Dictionary.js';
import RandomNumberSource from './RandomNumberSource.js';

/**
 * Generate passwords synchronously.
 *
 * For now, all passwords are generated using the default config with the default dictionary and default random number source.
 *
 * @todo Support custom config, dictionary, and random number source
 * @param {number} [n=1] - the number of passwords to generate.
 * @return {string[]}
 * @throws {TypeError} A Type Error is thrown on invalid args.
 */
function passwordsSync(n=1){
    return (new Generator()).passwordsSync(n);
}

/**
 * Generate a single password synchronously.
 *
 * For now, the password is generated using the default config with the default dictionary and default random number source.
 *
 * @todo Support custom config, dictionary, and random number source
 * @return {string[]}
 */
function passwordSync(){
    return passwordsSync(1)[0];
}


export default {
    // export the classes
    Config,
    Dictionary,
    Generator,
    RandomNumberSource,
    
    // export the quick-access functions
    passwordSync,
    passwordsSync
};