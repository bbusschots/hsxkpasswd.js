QUnit.module('HSXKPasswd.Config Class', function(){
    QUnit.test('static default settings datastructure accessor', function(a){
        a.expect(3);
        
        const ds = HSXKPasswd.Config.defaultSettings;
        
        // make sure an object is returned
        a.ok(is.object(ds), '.defaultSettings is an object');
        
        // make sure each object is a clone, and not just a reference to the same object
        const ds2 = HSXKPasswd.Config.defaultSettings;
        a.notStrictEqual(ds, ds2, 'a new clone is returned each time');
        ds2.boogers = 'snot';
        a.notDeepEqual(ds2, HSXKPasswd.Config.defaultSettings, 'editing a copy does not alter the master');
    });
    
    QUnit.test('static limits datastructure accessor', function(a){
        a.expect(3);
        
        const l = HSXKPasswd.Config.limits;
        
        // make sure an object is returned
        a.ok(is.object(l), '.limits is an object');
        
        // make sure each object is a clone, and not just a reference to the same object
        const l2 = HSXKPasswd.Config.limits;
        a.notStrictEqual(l, l2, 'a new clone is returned each time');
        l2.boogers = 'snot';
        a.notDeepEqual(l2, HSXKPasswd.Config.limits, 'editing a copy does not alter the master');
    });
    
    QUnit.test('static null settings datastructure accessor', function(a){
        a.expect(3);
        
        const ns = HSXKPasswd.Config.nullSettings;
        
        // make sure an object is returned
        a.ok(is.object(ns), '.nullSettings is an object');
        
        // make sure each object is a clone, and not just a reference to the same object
        const ns2 = HSXKPasswd.Config.nullSettings;
        a.notStrictEqual(ns, ns2, 'a new clone is returned each time');
        ns2.boogers = 'snot';
        a.notDeepEqual(ns2, HSXKPasswd.Config.nullSettings, 'editing a copy does not alter the master');
    });
    
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
    
    QUnit.test('complete config validation', function(a){
        a.expect(6);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.definesCompleteConfig), 'definesCompleteConfig() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertCompleteConfig), 'assertCompleteConfig() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesCompleteConfig(HSXKPasswd.Config.defaultSettings),
            true,
            'default settings object to definesCompleteConfig() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesCaseTransformation({ thingy: 'boogers' }),
            false,
            'an invalid value to definesCompleteConfig() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertCompleteConfig(HSXKPasswd.Config.defaultSettings),
            true,
            'default settings object to assertCompleteConfig() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertCompleteConfig({ thingy: 'boogers' }); },
            TypeError,
            'invalid value to assertCompleteConfig() throws TypeError'
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
    
    QUnit.test('word constraints validation', function(a){
        a.expect(6);
        
        // make sure the functions exist
        a.ok(is.function(HSXKPasswd.Config.definesWordConstraints), 'definesWordConstraints() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertWordConstraints), 'assertWordConstraints() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesWordConstraints({ word_length_min: 4, word_length_max: 4 }),
            true,
            'valid value to definesWordConstraints() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesPaddingDigits({ word_length_min: 8, word_length_max: 4 }),
            false,
            'an invalid value to definesWordConstraints() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertWordConstraints({ word_length_min: 4, word_length_max: 4 }),
            true,
            'valid value to assertWordConstraints() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertWordConstraints({ word_length_min: 8, word_length_max: 4 }); },
            TypeError,
            'invalid value to assertWordConstraints() throws TypeError'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('word number and constraints validation', function(a){
        a.expect(6);
        
        // make sure the functions exist
        a.ok(is.function(HSXKPasswd.Config.definesWords), 'definesWords() function exists');
        a.ok(is.function(HSXKPasswd.Config.assertWords), 'assertWords() function exists');
        
        // a valid value returns true
        a.strictEqual(
            HSXKPasswd.Config.definesWords({ num_words: 3, word_length_min: 4, word_length_max: 4 }),
            true,
            'valid value to definesWords() returns true'
        );
        
        // an invalid value returns false
        a.strictEqual(
            HSXKPasswd.Config.definesWords({ num_words: 'boogers', word_length_min: 4, word_length_max: 4 }),
            false,
            'an invalid value to definesWords() returns false'
        );
        
        // a valid value returns true and does not throw
        a.strictEqual(
            HSXKPasswd.Config.assertWords({ num_words: 3, word_length_min: 4, word_length_max: 4 }),
            true,
            'valid value to assertWords() returns true'
        );
        
        // an invalid value throws TypeError
        a.throws(
            ()=>{ HSXKPasswd.Config.assertWords({ num_words: 'boogers', word_length_min: 4, word_length_max: 4 }); },
            TypeError,
            'invalid value to assertWords() throws TypeError'
        );
        
        // TO DO - MANY more tests!
    });
    
    QUnit.test('filtering of settings into clean object', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.settingsFromObject), 'function settingsFromObject() exists');
        
        // the test settings
        const testObject = {
            allow_accents: 0,
            case_transform: 'ALTERNATE',
            num_words: 3,
            padding_digits_before: 0,
            padding_digits_after: 3,
            padding_type: 'NONE',
            separator_alphabet: [],
            separator_character: 'RANDOM',
            symbol_alphabet: ['-', '.'],
            word_length_min: 4,
            word_length_max: 8
        };
        const expectedOutput = _.cloneDeep(testObject);
        expectedOutput.allow_accents = false;
        testObject.boogers = 'snot';
        
        // make sure the filered object has the expected values
        a.deepEqual(HSXKPasswd.Config.settingsFromObject(testObject), expectedOutput, 'filtered object has expected values');
    });
    
    QUnit.test('filtering of word constraints into clean object', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.wordConstraintsFromObject), 'function wordConstraintsFromObject() exists');
        
        // the test settings
        const testObject = {
            allow_accents: 0,
            case_transform: 'ALTERNATE',
            num_words: 3,
            padding_digits_before: 0,
            padding_digits_after: 3,
            padding_type: 'NONE',
            separator_alphabet: [],
            separator_character: 'RANDOM',
            symbol_alphabet: ['-', '.'],
            word_length_min: 4,
            word_length_max: 8,
            boogers: 'snot'
        };
        const expectedOutput = {
            allow_accents: false,
            character_substitutions: {},
            word_length_min: 4,
            word_length_max: 8
        };
        
        // make sure the filered object has the expected values
        a.deepEqual(HSXKPasswd.Config.wordConstraintsFromObject(testObject), expectedOutput, 'filtered object has expected values');
    });
    
    QUnit.test('generation of word constraints digest', function(a){
        a.expect(4);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config.wordConstraintsDigest), 'function wordConstraintsDigest() exists');
        
        // the test settings
        const testObject = {
            allow_accents: 0,
            case_transform: 'ALTERNATE',
            num_words: 3,
            padding_digits_before: 0,
            padding_digits_after: 3,
            padding_type: 'NONE',
            separator_alphabet: [],
            separator_character: 'RANDOM',
            symbol_alphabet: ['-', '.'],
            word_length_min: 4,
            word_length_max: 8,
            boogers: 'snot'
        };
        const expectedOutput = 'f529d6468508f819ffa33ac084eeeaa3';
        
        // make sure the filered object has the expected value
        a.strictEqual(HSXKPasswd.Config.wordConstraintsDigest(testObject), expectedOutput, 'digest has expected value');
        
        // make sure a change to representation of allow_accents does not change the digest
        testObject.allow_accents = false;
        a.strictEqual(HSXKPasswd.Config.wordConstraintsDigest(testObject), expectedOutput, 'digest has same value for allow_accents=0 and allow_accents=false');
        
        // make sure a change in constraints results in a change in digest
        testObject.word_length_min = 6;
        a.notStrictEqual(HSXKPasswd.Config.wordConstraintsDigest(testObject), expectedOutput, 'digest changes value for different constraints');
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
    
    QUnit.test('constructor with settings object', function(a){
        a.expect(2);
        
        // the test settings
        const testSettings = {
            allow_accents: 0,
            case_transform: 'ALTERNATE',
            num_words: 3,
            padding_digits_before: 0,
            padding_digits_after: 3,
            padding_type: 'NONE',
            separator_alphabet: [],
            separator_character: 'RANDOM',
            symbol_alphabet: ['-', '.'],
            word_length_min: 4,
            word_length_max: 8
        };
        
        // call the constructor with the settings make sure it doesn't throw an error
        const testConfig = new HSXKPasswd.Config(testSettings);
        a.ok(true, 'did not throw error');
        
        // make sure the created object has the expected settings
        const expectedSettings = _.defaults(_.cloneDeep(testSettings), HSXKPasswd.Config.nullSettings);
        expectedSettings.allow_accents = false;
        a.deepEqual(testConfig.all, expectedSettings, 'generated config with expected settings');
    });
});