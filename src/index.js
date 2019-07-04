import is from 'is_js';
import Generator from './Generator.js';
import Config from './Config.js';
import Dictionary from './Dictionary.js';
import RandomNumberSource from './RandomNumberSource.js';

/**
 * Generate passwords synchronously.
 *
 * @param {number} [n=1] - The number of passwords to generate.
 * @param {Config} [config] - The configuration to use when generating the passwords. The default configuartion will be used if none is passed.
 * @param {Dictionary} [dictionary] - The dictionary to use. The default dictionary will be used if none passed.
 * @param {RandomNumberSource} [randomNumberSource] - The random number source to use when generating the password. The default random number source will be used is none is passed.
 * @return {string[]}
 * @throws {TypeError} A Type Error is thrown on invalid args.
 */
function passwordsSync(n=1, config, dictionary, randomNumberSource){
    return (new Generator(config, dictionary, randomNumberSource)).passwordsSync(n);
}

/**
 * Generate a single password synchronously.
 *
 * @param {Config} [conf] - The configuration to use when generating the passwords. The default configuartion will be used if none is passed.
 * @param {Dictionary} [dict] - The dictionary to use. The default dictionary will be used if none passed.
 * @param {RandomNumberSource} [rns] - The random number source to use when generating the password. The default random number source will be used is none is passed.
 * @return {string[]}
 */
function passwordSync(conf, dict, rns){
    return passwordsSync(1, conf, dict, rns)[0];
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