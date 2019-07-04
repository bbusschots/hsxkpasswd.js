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
        a.expect(5);
        
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
        
        // test character substitutions
        a.deepEqual(
            testDict.filteredWords({ word_length_min: 6, word_length_max: 11, character_substitutions: { i: '1', s: '$' } }),
            [
                "Saturday",
                "bogger$",
                "cl1che",
                "v1ca-ver$a"
            ],
            'returns expected words with accents explicitly allowed'
        );
    });
        
    QUnit.test('filtered word list caching', function(a){
        a.expect(8);
        
        // create a test dictionary with just a few words of different lengths
        const testDict = new HSXKPasswd.Dictionary([
            "poop",
            "gives",
            "cliché",
            "boggers",
            "Saturday",
            "vica-versa"
        ]);
        a.ok(is.object(testDict.filteredWordsCacheStats), '.filteredWordsCacheStats property exists');
        a.deepEqual(
            testDict.filteredWordsCacheStats,
            {
                hits: 0,
                misses: 0,
                numListsCached: 0
            },
            'cache initialised empty'
        );
            
        // test constraints
        const testConstraints = {
            word_length_min: 5,
            word_length_max: 8
        };
            
        // expected word list
        const expectedWL =  [
            "Saturday",
            "boggers",
            "cliche",
            "gives"
        ];
            
        // make sure first call is not returned from cache and cached
        let wl = testDict.filteredWords(testConstraints);
        a.deepEqual(wl, expectedWL, 'first call returned expected list');
        a.strictEqual(testDict.filteredWordsCacheStats.misses, 1, 'first call resulted in cache miss');
        a.strictEqual(testDict.filteredWordsCacheStats.numListsCached, 1, 'first call resulted in list being cached');
            
        // make sure second call is returned from cache and not re-cached
        wl = testDict.filteredWords(testConstraints);
        a.deepEqual(wl, expectedWL, 'second call returned expected list');
        a.strictEqual(testDict.filteredWordsCacheStats.hits, 1, 'second call resulted in cache hit');
        a.strictEqual(testDict.filteredWordsCacheStats.numListsCached, 1, 'second call was not cached again');
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