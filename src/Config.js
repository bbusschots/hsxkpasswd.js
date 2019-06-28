import _ from 'lodash-es';
import is from 'is_js';

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
 * An HSXKPAsswd Config.
 */
class Config{
    /**
     * Test if a given value is a valid alphabet. I.e. if a given value is an array consisting of one or more single-character strings.
     *
     * @param {*} val - The value to test
     * @return {boolean}
     */
    static isAlphabet(val){
        if(is.not.array(val)) return false;
        if(val.length < 1) return false;
        if(!is.all.string(val)) return false;
        const allValid = true;
        for(const i of val){
            if(i.length !== 1) allValid = false;
        }
        return allValid;
    }
    
    /**
     * @param {Object} [settings] - The config settings. If no object is passed the default settings are used.
     * @throws {TypeError} - A type error is thrown if invalid args are passed.
     * @todo Validate settings
     */
    constructor(settings){
        if(is.undefined(settings)){
            this._settings = _.cloneDeep(DEFAULT_SETTINGS);
        }else if(is.object(settings)){
            this._settings = _.cloneDeep(settings);
        }else{
            throw new TypeError('settings must be a plain object');
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
        return {};
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
        return this._settings.pad_to_length || 12;
    }
    get padToLength(){ return this.pad_to_length; }
    
    /**
     * @type {String[]}
     */
    get padding_alphabet(){
        if(is.array(this._settings.padding_alphabet)){
            return _.clone(this._settings.padding_alphabet);
        }
        return [];
    }
    get paddingAlphabet(){ return this.padding_alphabet; }
    
    /**
     * @type {String}
     */
    get padding_character(){
        return this._settings.padding_character || '';
    }
    get paddingCharacter(){ return this.padding_character; }
    
    /**
     * @type {number}
     */
    get padding_characters_before(){
        return this._settings.padding_characters_before || 0;
    }
    get paddingCharactersBefore(){ return this.padding_characters_before; }
    
    /**
     * @type {number}
     */
    get padding_characters_after(){
        return this._settings.padding_characters_after || 0;
    }
    get paddingCharactersAfter(){ return this.padding_characters_after; }
    
    /**
     * @type {number}
     */
    get padding_digits_before(){
        return this._settings.padding_digits_before || 0;
    }
    get paddingDigitsBefore(){ return this.padding_digits_before; };
    
    /**
     * @type {number}
     */
    get padding_digits_after(){
        return this._settings.padding_digits_after || 0;
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
        return [];
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
        return [];
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