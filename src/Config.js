import _ from 'lodash-es';
import is from 'is_js';
import XRegExp from 'xregexp';
import md5 from 'md5';

/**
 * The default settings.
 *
 * @type {Object}
 */
const DEFAULT_SETTINGS = {
    allow_accents: false,
    case_transform: 'CAPITALISE',
    character_substitutions: {},
    num_words: 3,
    padding_character: 'RANDOM',
    padding_characters_before: 2,
    padding_characters_after: 2,
    padding_digits_before: 2,
    padding_digits_after: 2,
    padding_type: 'FIXED',
    separator_character: 'RANDOM',
    symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
    word_length_min: 4,
    word_length_max: 8
};

/**
 * The limits for various config settings.
 *
 * @type {Object}
 */
const LIMITS = {
    num_words: {
        min: 3
    },
    pad_to_length: {
        min: 12
    },
    word_length: {
        min: 4
    }
};

/**
 * The null values returned by the getters for optional config settings.
 *
 * @type {Object}
 */
const NULL_SETTINGS = {
    allow_accents: false,
    character_substitutions: {},
    pad_to_length: 12,
    padding_alphabet: [],
    padding_character: '',
    padding_characters_before: 0,
    padding_characters_after: 0,
    separator_alphabet: []
};

/**
 * An HSXKPAsswd Config.
 */
class Config{
    /**
     * The default settings.
     *
     * @type {Object}
     */
    static get defaultSettings(){
        return _.cloneDeep(DEFAULT_SETTINGS);
    }
    
    /**
     * The limits that apply to various configuration settings.
     *
     * @type {Object}
     */
    static get limits(){
        return _.cloneDeep(LIMITS);
    }
    
    /**
     * The null values returned bt the getters for optional settings.
     *
     * @type {Object}
     */
    static get nullSettings(){
        return _.cloneDeep(NULL_SETTINGS);
    }
    
    /**
     * Assert that a given value is a valid alphabet. I.e. if a given value is an array consisting of one or more single-character strings.
     *
     * A Type Error is thrown if the value is not valid.
     *
     * @param {*} val - The value to test
     * @return {boolean} Always returns `true`.
     * @throws {TypeError} A Type Error is thrown if the value is not a valid alphabet.
     */
    static assertAlphabet(val){
        if(is.not.array(val)) throw new TypeError('alphabet must be an array');
        if(val.length < 1) throw new TypeError('alphabet must contain at least one character');
        if(!is.all.string(val)) throw new TypeError('alphabet contains a value that is not a string');
        for(const i of val){
            if(i.length !== 1) throw new TypeError('alphabet contains a string that is not exactly one character long');
        }
        return true;
    }
    
    /**
     * Assert that a given object defines a valid case transformation configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `case_transform` with one of the following valid values; `ALTERNATE`, `CAPITALISE`, `INVERT`, `LOWER`, `NONE`, `RANDOM`, or `UPPER`.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid case transformation configuration.
     */
    static assertCaseTransformation(conf){
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.case_transform)){
            throw new TypeError('case_transform must be a string');
        }
        if(!conf.case_transform.match(/^(ALTERNATE)|(CAPITALISE)|(INVERT)|(LOWER)|(NONE)|(RANDOM)|(UPPER)$/)){
            throw new TypeError('invalid case_transform');
        }
        return true;
    }
    
    /**
     * Assert that a given object defines a complete and valid config.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a complete configuration.
     */
    static assertCompleteConfig(conf){
        // make sure we have an object
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        
        // assert each aspect of the config
        this.assertCaseTransformation(conf);
        this.assertPaddingCharacters(conf);
        this.assertPaddingDigits(conf);
        this.assertSeparator(conf);
        this.assertWords(conf);
        
        // if we got here, all is well
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding character configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `padding_type`. The minimum valid configuation is `{ padding_type: 'NONE' }`.
     *
     * For all padding types other than `NONE` `padding_character` is also required.
     *
     * For `padding_type='FIXED'` both `padding_characters_before` & `padding_characters_after` are required.
     *
     * For `padding_type='ADAPTIVE'` `pad_to_length` is required.
     *
     * For `padding_character='RANDOM'` one of `padding_alphabet` or `symbol_alphabet` is required.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertPaddingCharacters(conf){
        // make sure we have an object that defines a padding type
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.padding_type)){
            throw new TypeError('padding_type must be a string');
        }
        
        // short-circuit no padding
        if(conf.padding_type === 'NONE') return true;
        
        // make sure we have the keys needed to determine the padding character to use
        if(is.not.string(conf.padding_character)) throw new TypeError('padding_character must be a string');
        if(conf.padding_character === 'RANDOM'){
            if(!(this.isAlphabet(conf.padding_alphabet) || this.isAlphabet(conf.symbol_alphabet))){
                throw new TypeError('padding_character is RANDOM but neither padding_alphabet nor symbol_alphabet are defined');
            }
        }else if(conf.padding_character === 'SEPARATOR'){
            // do nothing, at least for now
        }else{
            if(conf.padding_character.length !== 1) throw new TypeError('invalid padding_character');
        }
        
        // make sure we have the keys needed to determine what the amount of padding to apply
        if(conf.padding_type === 'FIXED'){
            if(is.not.integer(conf.padding_characters_before) || is.negative(conf.padding_characters_before)){
                throw new TypeError('padding_characters_before must be an integer greater than or equal to zero');
            }
            if(is.not.integer(conf.padding_characters_after) || is.negative(conf.padding_characters_after)){
                throw new TypeError('padding_characters_after must be an integer greater than or equal to zero');
            }
        }else if(conf.padding_type === 'ADAPTIVE'){
            if(is.not.integer(conf.pad_to_length) || is.under(conf.pad_to_length, LIMITS.pad_to_length.min)){
                throw new TypeError(`invalid pad_to_length, must be an integer greater than or equal to ${LIMITS.pad_to_length.min}`);
            }
        }else{
            throw new TypeError("invalid padding_type, must be one of 'NONE', 'FIXED', or 'ADAPTIVE'");
        }
        
        // if we got here all is well
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding digit configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the keys `padding_digits_before` & `padding_digits_after`.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertPaddingDigits(conf){
        // make sure we have an object
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        
        // make sure we have valid values for both required keys
        if(is.not.integer(conf.padding_digits_before) || is.negative(conf.padding_digits_before)){
            throw new TypeError('padding_digits_before must be an integer greater than or equal to zero');
        }
        if(is.not.integer(conf.padding_digits_after) || is.negative(conf.padding_digits_after)){
            throw new TypeError('padding_digits_after must be an integer greater than or equal to zero');
        }
        
        // if we got here all is well
        return true;
    }
    
    /**
     * Assert that a given object defines a valid padding configuration. Invalid values will result in a Type Error.
     *
     * The object must provide the key `separator_character`.
     *
     * For `separator_character='RANDOM'` one of `separator_alphabet` or `symbol_alphabet` is required.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define a valid padding configuration.
     */
    static assertSeparator(conf){
        // make sure we have an object that defines a padding type
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        if(is.not.string(conf.separator_character)){
            throw new TypeError('separator_character must be a string');
        }
        
        // deal with each possible separator character
        if(conf.separator_character === 'NONE'){
            return true;
        }else if(conf.separator_character === 'RANDOM'){
            if(this.isAlphabet(conf.separator_alphabet) || this.isAlphabet(conf.symbol_alphabet)){
                return true;
            }else{
                throw new TypeError('separator_character is RANDOM, but neither separator_alphabet nor symbol_alphabet are defined');
            }
        }else if(conf.separator_character.length === 1){
            return true;
        }
        
        // if we got here the separator character is not valid!
        throw new TypeError("invalid separator_character, must be a single character or one of 'NONE' or 'RANDOM'");
    }
    
    /**
     * Assert that a given object defines valid word constraints. Invalid values will result in a Type Error.
     *
     * The object must provide the keys `word_length_min` & `word_length_max`.
     *
     * The object can also optionally provide the following keys:
     * * `allow_accents - if present it must be a primitive value.
     * * `character_substitutions` - if present must be an object mapping single letters to non-empty strings.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define valid word constraints.
     */
    static assertWordConstraints(conf){
        // make sure we have an object
        if(is.not.object(conf)) throw new TypeError('config must be an object');
        
        // make sure we have valid length constraints
        if(is.not.integer(conf.word_length_min) || is.under(conf.word_length_min, LIMITS.word_length.min)){
            throw new TypeError(`word_length_min must be an integer greater than or equal to ${LIMITS.num_words.min}`);
        }
        if(is.not.integer(conf.word_length_max) || is.under(conf.word_length_max, LIMITS.word_length.min)){
            throw new TypeError(`word_length_max must be an integer greater than or equal to ${LIMITS.num_words.min}`);
        }
        if(conf.word_length_min > conf.word_length_max){
            throw new TypeError('word_length_min must be less than or equal to word_length_max');
        }
        
        // if present, make sure allow_accents is valid
        if(is.not.undefined(conf.allow_accents)){
            if(!(is.boolean(conf.allow_accents) || is.string(conf.allow_accents) || is.number(conf.allow_accents))){
                throw new TypeError('if present, allow_accents must be a primitive value, ideally a boolean');
            }
        }
        
        // if present, make sure character_substitutions is valid
        if(is.not.undefined(conf.character_substitutions)){
            if(is.not.object(conf.character_substitutions)){
                throw new TypeError('if present, character_substitutions must be an object');
            }
            for(const c of Object.keys(conf.character_substitutions)){
                if(is.not.string(c) || !XRegExp.match(c, XRegExp('^\\p{Letter}$'))) throw new TypeError('character_substitutions keys must be single-letter strings');
                const sub = conf.character_substitutions[c];
                if(is.not.string(sub) || is.empty(sub)) throw new TypeError('character_substitutions values must be non-empty strings');
            }
        }
        
        // if we got here, all is well
        return true;
    }
    
    /**
     * Assert that a given object defines the number of words to include in a password as well as valid word constraints. Invalid values will result in a Type Error.
     *
     * The object must provide the keys `num_words`, `word_length_min` & `word_length_max`.
     *
     * The object can also optionally provide the following keys:
     * * `allow_accents - if present it must be a primitive value.
     * * `character_substitutions` - if present must be an object mapping single letters to non-empty strings.
     *
     * @param {*} conf - The value to test.
     * @return {boolean} - Always returns `true`.
     * @throws {TypeError} A TypeError is thrown if the passed object does not define valid word constraints.
     */
    static assertWords(conf){
        // make sure we have all the word constraints
        this.assertWordConstraints(conf);
        
        // make sure we have a valid number of words
        if(is.not.integer(conf.num_words) || is.under(conf.num_words, LIMITS.num_words.min)){
            throw new TypeError(`num_words must be an integer greater than or equal to ${LIMITS.num_words.min}`);
        }
        
        // if we got here, all is well
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify case transformations.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesCaseTransformation(val){
        try{
            this.assertCaseTransformation(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines a compelte and valid config.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesCompleteConfig(val){
        try{
            this.assertCompleteConfig(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify password character padding.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesPaddingCharacters(val){
        try{
            this.assertPaddingCharacters(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify password digit padding.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesPaddingDigits(val){
        try{
            this.assertPaddingDigits(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify a separatpor.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesSeparator(val){
        try{
            this.assertSeparator(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify a word constraints.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesWordConstraints(val){
        try{
            this.assertWordConstraints(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is an object that defines the config keys needed to specify the number of words and word constraints.
     *
     * @param {*} val - The value to test.
     * @return {boolean}
     */
    static definesWords(val){
        try{
            this.assertWords(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Test if a given value is a valid alphabet. I.e. if a given value is an array consisting of one or more single-character strings.
     *
     * @param {*} val - The value to test
     * @return {boolean}
     */
    static isAlphabet(val){
        try{
            this.assertAlphabet(val);
        }catch(err){
            return false;
        }
        return true;
    }
    
    /**
     * Build a clean settings object from any object that contains all the keys for a valid configuration. Keys from the original object that do not map to HSXKPasswd settings will not be coppied.
     *
     * The returned object will be a deep clone of the original.
     *
     * @param {Object} obj - The object to extract the settings from.
     * @return {Object}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static settingsFromObject(obj){
        // validate args
        this.assertCompleteConfig(obj);
        
        // build a clean object to return, starting with the required keys
        const settingsObj = {
            case_transform: obj.case_transform,
            num_words: obj.num_words,
            padding_digits_before: obj.padding_digits_before,
            padding_digits_after: obj.padding_digits_after,
            padding_type: obj.padding_type,
            separator_character: obj.separator_character,
            word_length_min: obj.word_length_min,
            word_length_max: obj.word_length_max
        };
        
        // add any optional keys present in the original
        if(is.not.undefined(obj.allow_accents)) settingsObj.allow_accents = obj.allow_accents ? true : false;
        if(is.object(obj.character_substitutions)) settingsObj.character_substitutions = _.cloneDeep(obj.character_substitutions);
        if(is.not.undefined(obj.pad_to_length)) settingsObj.pad_to_length = obj.pad_to_length;
        if(is.array(obj.padding_alphabet)) settingsObj.padding_alphabet = _.cloneDeep(obj.padding_alphabet);
        if(is.not.undefined(obj.padding_character)) settingsObj.padding_character = obj.padding_character;
        if(is.not.undefined(obj.padding_characters_before)) settingsObj.padding_characters_before = obj.padding_characters_before;
        if(is.not.undefined(obj.padding_characters_after)) settingsObj.padding_characters_after = obj.padding_characters_after;
        if(is.array(obj.separator_alphabet)) settingsObj.separator_alphabet = _.cloneDeep(obj.separator_alphabet);
        if(is.array(obj.symbol_alphabet)) settingsObj.symbol_alphabet = _.cloneDeep(obj.symbol_alphabet);
        
        // return the new object
        return settingsObj;
    }
    
    /**
     * Generate a digest based on just the word constraints from a given object.
     *
     * @param {Object} obj - An object that defines valid word constraints.
     * @return {string}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static wordConstraintsDigest(obj){
        return md5(JSON.stringify(this.wordConstraintsFromObject(obj))); // throws on invalid args
    }
    
    /**
     * Build a clean word constraints object from any object that defines valid values for all the relevany keys. Keys from the original object other than `allow_accents`, `character_substitutions`, `word_length_min` & `word_length_max` will not be coppied.
     *
     * The returned object will be a deep clone of the original.
     *
     * @param {Object} obj - The object to extract the settings from.
     * @return {Object}
     * @throws {TypeError} A Type Error is thrown on invalid args.
     */
    static wordConstraintsFromObject(obj){
        // validate args
        this.assertWordConstraints(obj);
        
        // build a clean object to return, starting with the required keys
        const wordCons = {
            word_length_min: obj.word_length_min,
            word_length_max: obj.word_length_max
        };
        
        // deal with the optional keys
        wordCons.allow_accents = obj.allow_accents ? true : false;
        if(is.object(obj.character_substitutions)){
            wordCons.character_substitutions = _.cloneDeep(obj.character_substitutions);
        }else{
            wordCons.character_substitutions = this.nullSettings.character_substitutions;
        }
        
        // return the new object
        return wordCons;
    }
    
    /**
     * @param {Object} [settings] - The config settings. If no object is passed the default settings are used.
     * @throws {TypeError} - A type error is thrown if invalid args are passed.
     * @todo Validate settings
     */
    constructor(settings){
        if(is.undefined(settings)){
            this._settings = this.constructor.defaultSettings;
        }else if(this.constructor.definesCompleteConfig(settings)){
            this._settings = this.constructor.settingsFromObject(settings);
        }else{
            throw new TypeError('settings must be a plain object defining a complete and valid configuration');
        }
    }
    
    /**
     * @type {Object}
     */
    get all(){
        return {
            allow_accents: this.allow_accents,
            case_transform: this.case_transform,
            character_substitutions: this.character_substitutions,
            num_words: this.num_words,
            pad_to_length: this.pad_to_length,
            padding_alphabet: this.padding_alphabet,
            padding_character: this.padding_character,
            padding_characters_before: this.padding_characters_before,
            padding_characters_after: this.padding_characters_after,
            padding_digits_before: this.padding_digits_before,
            padding_digits_after: this.padding_digits_after,
            padding_type: this.padding_type,
            separator_alphabet: this.separator_alphabet,
            separator_character: this.separator_character,
            symbol_alphabet: this.symbol_alphabet,
            word_length_min: this.word_length_min,
            word_length_max: this.word_length_max
        };
    }
    
    /**
     * @type {boolean}
     */
    get allow_accents(){
        return this._settings.allow_accents ? true : false;
    }
    get allowAccents(){ return this.allow_accents; }
    
    /**
     * @type {string}
     */
    get case_transform(){
        return this._settings.case_transform;
    }
    get caseTransform(){ return this.case_transform; }
    
    /**
     * @type {Object}
     */
    get character_substitutions(){
        if(is.object(this._settings.character_substitutions)){
            return _.cloneDeep(this._settings.character_substitutions);
        }
        return this.constructor.nullSettings.character_substitutions;
    }
    get characterSubstitutions(){ return this.character_substitutions; }
    
    /**
     * @type {number}
     */
    get num_words(){
        return this._settings.num_words;
    }
    get numWords(){ return this._settings.num_words; }
    
    /**
     * @type {number}
     */
    get pad_to_length(){
        return this._settings.pad_to_length || this.constructor.nullSettings.pad_to_length;
    }
    get padToLength(){ return this.pad_to_length; }
    
    /**
     * @type {String[]}
     */
    get padding_alphabet(){
        if(is.array(this._settings.padding_alphabet)){
            return _.clone(this._settings.padding_alphabet);
        }
        return this.constructor.nullSettings.padding_alphabet;
    }
    get paddingAlphabet(){ return this.padding_alphabet; }
    
    /**
     * @type {String}
     */
    get padding_character(){
        return this._settings.padding_character || this.constructor.nullSettings.padding_character;
    }
    get paddingCharacter(){ return this.padding_character; }
    
    /**
     * @type {number}
     */
    get padding_characters_before(){
        return this._settings.padding_characters_before || this.constructor.nullSettings.padding_characters_before;
    }
    get paddingCharactersBefore(){ return this.padding_characters_before; }
    
    /**
     * @type {number}
     */
    get padding_characters_after(){
        return this._settings.padding_characters_after || this.constructor.nullSettings.padding_characters_before;
    }
    get paddingCharactersAfter(){ return this.padding_characters_after; }
    
    /**
     * @type {number}
     */
    get padding_digits_before(){
        return this._settings.padding_digits_before;
    }
    get paddingDigitsBefore(){ return this.padding_digits_before; };
    
    /**
     * @type {number}
     */
    get padding_digits_after(){
        return this._settings.padding_digits_after;
    }
    get paddingDigitsAfter(){ return this.padding_digits_after; }
    
    /**
     * @type {String}
     */
    get padding_type(){
        return this._settings.padding_type;
    }
    get paddingType(){ return this.padding_type; }
    
    /**
     * @type {String[]}
     */
    get separator_alphabet(){
        if(is.array(this._settings.separator_alphabet)){
            return _.clone(this._settings.separator_alphabet);
        }
        return this.constructor.nullSettings.separator_alphabet;
    }
    get separatorAlphabet(){ return this.separator_alphabet; }
    
    /**
     * @type {String}
     */
    get separator_character(){
        return this._settings.separator_character;
    }
    get separatorCharacter(){ return this.separator_character; }
    
    /**
     * @type {String[]}
     */
    get symbol_alphabet(){
        if(is.array(this._settings.symbol_alphabet)){
            return _.clone(this._settings.symbol_alphabet);
        }
        return this.constructor.nullSettings.symbol_alphabet;
    }
    
    /**
     * @type {number}
     */
    get word_length_min(){
        return this._settings.word_length_min;
    }
    get wordLengthMin(){ return this.word_length_min; }
    
    /**
     * @type {number}
     */
    get word_length_max(){
        return this._settings.word_length_max;
    }
    get wordLengthMax(){ return this.word_length_max; }
}

export default Config;