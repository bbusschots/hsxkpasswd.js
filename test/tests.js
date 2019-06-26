QUnit.module('HSXKPasswd.Config Class', function(){
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

QUnit.module('HSXKPasswd.Dictionary Class', function(){
    QUnit.test('base sanetizer function', function(a){
        a.expect(2);
        
        a.ok(is.function(HSXKPasswd.Dictionary.baseSanitizer), 'function exists');
        
        // test the sanetisation
        a.equal(HSXKPasswd.Dictionary.baseSanitizer('aeiouáéíóúçö$£\n\t -_'), 'aeiouáéíóúçö-', 'expected characters removed and retained');
    });
    
    QUnit.test('default dictionary builder', function(a){
        a.expect(3);
        
        a.ok(is.function(HSXKPasswd.Dictionary.defaultDictionary), 'function exists');
        
        // make sure a dictionary actually gets built
        const defaultDict = HSXKPasswd.Dictionary.defaultDictionary();
        a.ok(defaultDict instanceof HSXKPasswd.Dictionary, 'generated object is a Dictionary');
        a.ok(defaultDict.allWords.length > 0, 'dictionary contains words');
    });
    
    QUnit.test('diacritic stripping function', function(a){
        a.expect(2);
        
        a.ok(is.function(HSXKPasswd.Dictionary.stripDiacritics), 'function exists');
        
        // test the stripping
        a.equal(HSXKPasswd.Dictionary.stripDiacritics('áéíóúçö'), 'aeiouco', 'expected characters replaced with un-accented versions');
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Dictionary), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultDict = new HSXKPasswd.Dictionary();
        a.ok(true, 'did not throw error');
    });
    
    QUnit.test('word list builder', function(a){
        a.expect(2);
        
        const testDict = new HSXKPasswd.Dictionary();
        a.ok(is.function(testDict.buildWordList), 'function exists');
        
        // test the list building
        a.deepEqual(
            testDict.buildWordList([
                4242,
                "4242",
                "l8rs",
                "l8rsp33ps",
                "sw",
                "lengthy",
                "with space",
                "with-dash",
                "cliché",
                "de-ja-vu1",
                "de-ja-vu2"
            ]),
            {
                words: [
                    "cliché",
                    "de-ja-vu",
                    "lengthy",
                    "lrspps",
                    "with-dash",
                    "withspace"
                ],
                rejectedWords: [
                    4242,
                    "4242",
                    "l8rs",
                    "sw"
                ]
            },
            'expected words accepted and rejected'
        );
    });
    
    QUnit.test('get filtered words', function(a){
        a.expect(4);
        
        // create a test dictionary with just a few words of different lengths
        const testDict = new HSXKPasswd.Dictionary([
            "poop",
            "gives",
            "cliché",
            "boggers",
            "Saturday",
            "vica-versa"
        ]);
        a.ok(is.function(testDict.filteredWords), 'function exists');
        
        // test getting words with minimal settings
        a.deepEqual(
            testDict.filteredWords({ word_length_min: 5, word_length_max: 8 }),
            [
                "Saturday",
                "boggers",
                "cliche",
                "gives"
            ],
            'returns expected words with minimal config'
        );
        
        // test words with accents explicitly removed
        a.deepEqual(
            testDict.filteredWords({ word_length_min: 5, word_length_max: 8, allow_accents: false }),
            [
                "Saturday",
                "boggers",
                "cliche",
                "gives"
            ],
            'returns expected words with accents explicitly removed'
        );
        
        // test words with accents explicitly allowed
        a.deepEqual(
            testDict.filteredWords({ word_length_min: 6, word_length_max: 11, allow_accents: true }),
            [
                "Saturday",
                "boggers",
                "cliché",
                "vica-versa"
            ],
            'returns expected words with accents explicitly allowed'
        );
    });
    
    QUnit.test('load words synchronously', function(a){
        a.expect(3);
        
        const testDict = new HSXKPasswd.Dictionary();
        a.ok(is.function(testDict.loadWordsSync), 'function exists');
        
        // test the loading
        const loadStats = testDict.loadWordsSync([
            4242,
            "4242",
            "l8rs",
            "l8rsp33ps",
            "sw",
            "lengthy",
            "with space",
            "with-dash",
            "cliché",
            "de-ja-vu1",
            "de-ja-vu2"
        ]);
        a.deepEqual(
            loadStats,
            {
                numLoaded: 6,
                numRejected: 4,
                rejectedWords: [
                    4242,
                    "4242",
                    "l8rs",
                    "sw"
                ]
            },
            'expected stats returned'
        );
        a.deepEqual(
            testDict.allWords,
            [
                "cliché",
                "de-ja-vu",
                "lengthy",
                "lrspps",
                "with-dash",
                "withspace"
            ],
            'expected words accepted and rejected'
        );
    });
});

QUnit.module('HSXKPasswd.RandomNumberSource Class', function(){
    QUnit.test('random number to random index conversion', function(a){
        a.expect(6);
        
        // make sure the function and its alias exist
        a.ok(is.function(HSXKPasswd.RandomNumberSource.randomIndexFromRandomNumber), 'randomIndexFromRandomNumber function exists');
        a.ok(is.function(HSXKPasswd.RandomNumberSource.randIndex), 'randIndex alias exists');
        
        // test the conversion
        a.equal(
            HSXKPasswd.RandomNumberSource.randomIndexFromRandomNumber(0.00001, 5),
            0,
            'lower bound returns 0'
        );
        a.equal(
            HSXKPasswd.RandomNumberSource.randomIndexFromRandomNumber(0.99999, 5),
            4,
            'upper bound returns one less than the length'
        );
        a.equal(
            HSXKPasswd.RandomNumberSource.randomIndexFromRandomNumber(0.5, 5),
            2,
            'intermediate value returns expected result'
        );
        
        
        // test the alias
        a.equal(
            HSXKPasswd.RandomNumberSource.randIndex(0.5, 5),
            2,
            'alias returns expected value'
        );
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.RandomNumberSource), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        a.ok(true, 'did not throw error');
    });
    
    QUnit.test('sync random number generation with default RNG', function(a){
        a.expect(5);
        
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the functions exist
        a.ok(is.function(defaultRNS.randomNumberSync), '.randomNumberSync() exists');
        a.ok(is.function(defaultRNS.randomNumbersSync), '.randomNumbersSync() exists');
        
        // try generate a single random number
        const rn = defaultRNS.randomNumberSync();
        a.ok(is.number(rn) && rn >= 0 && rn < 1, 'randomNumberSync() returns valid value');
        
        // try generate multipl random numbers
        const numNums = 5;
        const rns = defaultRNS.randomNumbersSync(numNums);
        a.ok(is.array(rns) && rns.length === numNums && is.all.number(rns), 'randomNumbersSync() returns array of numbers of the expected length');
        const allNumsValid = true;
        for(const rn of rns){
            if(rn < 0 || rn >= 1) allNumsValid = false;
        }
        a.ok(allNumsValid, 'all numbers returned by randomNumbersSync() are valid');
    });
});