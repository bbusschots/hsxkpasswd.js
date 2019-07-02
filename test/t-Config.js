QUnit.module('HSXKPasswd.Config Class', function(){
    QUnit.test('alphabet validation', function(a){
        a.expect(6);
        
        // make sure the functions exist
        a.ok(is.function(HSXKPasswd.Config.isAlphabet), 'isAlphabet() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertAlphabet), 'assertAlphabet() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.isAlphabet(['+']),
            true,
            'valid value to isAlphabet() returns true'
        );
        a.strictEqual(
            HSXKPasswd.Config.assertAlphabet(['+']),
            true,
            'valid value to assertAlphabet() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.isAlphabet('boogers'),
            false,
            'an invalid value to isAlphabet() returns false'
        );
        
        // an invalid value returns throws a Type Error
        a.throws(
            ()=>{ HSXKPasswd.Config.assertAlphabet('boogers'); },
            TypeError,
            'an invalid value to assertAlphabet() throws a TypeError'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('case transformation validation', function(a){
        const validVals = ['ALTERNATE', 'CAPITALISE', 'INVERT', 'LOWER', 'NONE', 'RANDOM', 'UPPER'];
        a.expect((validVals.length * 2) + 4);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.definesCaseTransformation), 'definesCaseTransformation() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertCaseTransformation), 'assertCaseTransformation() function exists');
        
        // all valid values return true
        for(const val of validVals){
            a.strictEqual(
                HSXKPasswd.Config.definesCaseTransformation({ case_transform: val }),
                true,
                `case_transform='${val}' to definesCaseTransformation() returns true`
            );
        }
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesCaseTransformation({ case_transform: 'boogers' }),
            false,
            'an invalid value to definesCaseTransformation() returns false'
        );
        
        // all valid values return true and do not throw
        for(const val of validVals){
            a.strictEqual(
                HSXKPasswd.Config.assertCaseTransformation({ case_transform: val }),
                true,
                `case_transform='${val}' to assertCaseTransformation() returns true`
            );
        }
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertCaseTransformation({ case_transform: 'boogers' }); },
            TypeError,
            'invalid value to assertCaseTransformation() throws TypeError'
        );
    });
    
    QUnit.test('padding character validation', function(a){
        a.expect(6);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.definesPaddingCharacters), 'definesPaddingCharacters() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertPaddingCharacters), 'assertPaddingCharacters() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesPaddingCharacters({ padding_type: 'NONE' }),
            true,
            'valid value to definesPaddingCharacters() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesPaddingCharacters({ padding_type: 'boogers' }),
            false,
            'an invalid value to definesPaddingCharacters() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertPaddingCharacters({ padding_type: 'NONE' }),
            true,
            'valid value to assertPaddingCharacters() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertPaddingCharacters({ padding_type: 'boogers' }); },
            TypeError,
            'invalid value to assertPaddingCharacters() throws TypeError'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('padding digits validation', function(a){
        a.expect(6);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.definesPaddingDigits), 'definesPaddingDigits() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertPaddingDigits), 'assertPaddingDigits() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesPaddingDigits({ padding_digits_before: 0, padding_digits_after: 0 }),
            true,
            'valid value to definesPaddingDigits() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesPaddingDigits({ padding_digits_before: 'boogers' }),
            false,
            'an invalid value to definesPaddingDigits() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertPaddingDigits({ padding_digits_before: 0, padding_digits_after: 0 }),
            true,
            'valid value to assertPaddingDigits() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertPaddingDigits({ padding_digits_before: 'boogers' }); },
            TypeError,
            'invalid value to assertPaddingDigits() throws TypeError'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('separator validation', function(a){
        a.expect(6);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.definesSeparator), 'definesSeparator() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertSeparator), 'assertSeparator() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesSeparator({ separator_character: 'NONE' }),
            true,
            'valid value to definesSeparator() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesSeparator({ separator_character: 'boogers' }),
            false,
            'an invalid value to definesSeparator() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertSeparator({ separator_character: 'NONE' }),
            true,
            'valid value to assertSeparator() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertSeparator({ separator_character: 'boogers' }); },
            TypeError,
            'invalid value to assertSeparator() throws TypeError'
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