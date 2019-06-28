QUnit.module('HSXKPasswd.Config Class', function(){
    QUnit.test('alphabet validator', function(a){
        a.expect(3);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.isAlphabet), 'function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.isAlphabet(['+']),
            true,
            'valid value returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.isAlphabet('boogers'),
            false,
            'an invalid value returns false'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(3);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultConfig = new HSXKPasswd.Config();
        a.ok(true, 'did not throw error');
        
        // make sure the created object has the expected settings
        const expectedSettings = {
            allow_accents: false,
            case_transform: 'CAPITALISE',
            character_substitutions: {},
            num_words: 3,
            pad_to_length: 12,
            padding_alphabet: [],
            padding_character: 'RANDOM',
            padding_characters_before: 2,
            padding_characters_after: 2,
            padding_digits_before: 2,
            padding_digits_after: 2,
            padding_type: 'FIXED',
            separator_alphabet: [],
            separator_character: 'RANDOM',
            symbol_alphabet: ['!', '@', '$', '%', '^', '&', '*', '-', '_', '+', '=', ':', '|', '~', '?', '/', '.', ';'],
            word_length_min: 4,
            word_length_max: 8
        };
        a.deepEqual(defaultConfig.all, expectedSettings, 'generated config with expected settings');
    });
});