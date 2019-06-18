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
        if(is_object(this._settings.character_substitutions)){
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