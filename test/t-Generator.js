QUnit.module('HSXKPasswd.Generator Class', function(){
    QUnit.test('add padding characters synchronously', function(a){
        a.expect(7);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator.addPaddingCharactersSync), 'function exists');
        
        // dummy input
        const testInput = 'ALTERNATING-case-WORDS-90';
        const testSep = '-';
        
        // a basic random number source
        const testRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the function returns the expected type
        const testOut = HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'NONE' }, testRNS, testSep);
        a.ok(is.string(testOut), 'returns a string');
        
        // test each padding type
        a.strictEqual(
            HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'NONE' }, testRNS, ''),
            testInput,
            'padding_type NONE returns input un-altered'
        );
        a.strictEqual(
            HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'FIXED', padding_character: '+', padding_characters_before: 1, padding_characters_after: 3 }, testRNS, testSep),
            `+${testInput}+++`,
            'padding_type FIXED returns exected value'
        );
        a.strictEqual(
            HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'ADAPTIVE', padding_character: '+', pad_to_length: 30 }, testRNS, testSep),
            'ALTERNATING-case-WORDS-90+++++',
            'padding_type FIXED returns exected value'
        );
        
        // test each special separator type
        a.strictEqual(
            HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'FIXED', padding_character: 'SEPARATOR', padding_characters_before: 1, padding_characters_after: 1 }, testRNS, testSep),
            `${testSep}${testInput}${testSep}`,
            'padding_character SEPARATOR returns exected value'
        );
        const rand = HSXKPasswd.Generator.addPaddingCharactersSync(testInput, { padding_type: 'FIXED', padding_character: 'RANDOM', padding_characters_before: 1, padding_characters_after: 1, padding_alphabet: ['+', '-'] }, testRNS, testSep);
        a.ok(
            rand === `+${testInput}+` || rand === `-${testInput}-`,
            'padding_character RANDOM returns exected value'
        );
    });
    
    QUnit.test('add padding digits synchronously', function(a){
        a.expect(9);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator.addPaddingDigitsSync), 'function exists');
        
        // a function for generating dummy words
        const testWords = ()=>{ return ['boogers', 'Brussels', 'cliché']; };
        
        // a basic random number source
        const testRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the function returns the expected value
        const testIn = testWords();
        const testOut = HSXKPasswd.Generator.addPaddingDigitsSync(testIn, { padding_digits_before: 2, padding_digits_after: 2 }, testRNS);
        a.strictEqual(testIn, testOut, 'returns reference to original array');
        
        // test no padding at all
        a.deepEqual(
            HSXKPasswd.Generator.addPaddingDigitsSync(testWords(), { padding_digits_before: 0, padding_digits_after: 0 }, testRNS),
            testWords(),
            'no padding before or after returns the array un-changed'
        );
        
        // test with padding before and after
        const withPadding = HSXKPasswd.Generator.addPaddingDigitsSync(testWords(), { padding_digits_before: 1, padding_digits_after: 3 }, testRNS);
        a.equal(
            withPadding.length,
            testWords().length + 2,
            'before and after padding injected'
        );
        a.equal(
            withPadding.slice(1, -1).join(''),
            testWords().join(''),
            'words left un-changed between inserted padding digits'
        );
        const prefix = withPadding[0];
        a.ok(is.string(prefix), 'prefixed digits added as string');
        a.ok(
            String(prefix).match(/^\d$/),
            'appropriate number of digits added before'
        );
        const postfix = withPadding.slice(-1).pop();
        a.ok(is.string(postfix), 'postfixed digits added as string');
        a.ok(
            String(postfix).match(/^\d{3}$/),
            'appropriate number of digits added after'
        );
    });
    
    QUnit.test('apply case transformations synchronously', function(a){
        a.expect(10);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator.applyCaseTransformationsSync), 'function exists');
        
        // a function for generating dummy words
        const testWords = ()=>{ return ['boogers', 'Brussels', 'stuff', 'cliché']; };
        
        // a basic random number source
        const testRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the function returns the expected value
        const testIn = testWords();
        const testOut = HSXKPasswd.Generator.applyCaseTransformationsSync(testIn, { case_transform: 'NONE' }, testRNS);
        a.strictEqual(testIn, testOut, 'returns reference to original array');
        
        // Test each transformation option
        const alternate = ['one', 'two', 'three'];
        HSXKPasswd.Generator.applyCaseTransformationsSync(alternate, { case_transform: 'ALTERNATE' }, testRNS);
        altJ = alternate.join('');
        a.ok(
            altJ === 'oneTWOthree' || altJ === 'ONEtwoTHREE',
            'case_transform=ALTERNATE returns expected value'
        );
        const cap = testWords();
        HSXKPasswd.Generator.applyCaseTransformationsSync(cap, { case_transform: 'CAPITALISE' }, testRNS);
        a.deepEqual(
            cap,
            ['Boogers', 'Brussels', 'Stuff', 'Cliché'],
            'case_transform=CAPITALISE returns expected value'
        );
        const inv = testWords();
        HSXKPasswd.Generator.applyCaseTransformationsSync(inv, { case_transform: 'INVERT' }, testRNS);
        a.deepEqual(
            inv,
            ['bOOGERS', 'bRUSSELS', 'sTUFF', 'cLICHÉ'],
            'case_transform=INVERT returns expected value'
        );
        const lower = testWords();
        HSXKPasswd.Generator.applyCaseTransformationsSync(lower, { case_transform: 'LOWER' }, testRNS);
        a.deepEqual(
            lower,
            ['boogers', 'brussels', 'stuff', 'cliché'],
            'case_transform=LOWER returns expected value'
        );
        const none = testWords();
        HSXKPasswd.Generator.applyCaseTransformationsSync(none, { case_transform: 'NONE' }, testRNS);
        a.deepEqual(
            none,
            testWords(),
            'case_transform=NONE does not alter any words'
        );
        const rand = ['one', 'two'];
        HSXKPasswd.Generator.applyCaseTransformationsSync(rand, { case_transform: 'RANDOM' }, testRNS);
        randJ = rand.join('');
        a.ok(
            randJ === 'onetwo' || randJ === 'oneTWO' || randJ === 'ONEtwo' || randJ === 'ONETWO',
            'case_transform=RANDOM returns expected value'
        );
        const upper = testWords();
        HSXKPasswd.Generator.applyCaseTransformationsSync(upper, { case_transform: 'UPPER' }, testRNS);
        a.deepEqual(
            upper,
            ['BOOGERS', 'BRUSSELS', 'STUFF', 'CLICHÉ'],
            'case_transform=UPPER returns expected value'
        );
        
        // make sure invalid transformation options throw an error
        a.throws(
            ()=>{ HSXKPasswd.Generator.applyCaseTransformationsSync(['one', 'two'], { case_transform: 'INVALID' }, testRNS); },
            TypeError,
            'invalid case_transform throws Type Error'
        );
    });
    
    QUnit.test('generate separator character synchronously', function(a){
        a.expect(4);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator.generateSeparatorSync), 'function exists');
        
        // a basic random number source
        const testRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the function returns the expected value for each separator type
        a.strictEqual(HSXKPasswd.Generator.generateSeparatorSync({ separator_character: 'NONE' }, testRNS), '', 'separator_character=NONE returns empty string');
        a.strictEqual(HSXKPasswd.Generator.generateSeparatorSync({ separator_character: '-' }, testRNS), '-', 'specified separator_character returns expected value');
        const sep = HSXKPasswd.Generator.generateSeparatorSync({ separator_character: 'RANDOM', symbol_alphabet: ['-', '+'] }, testRNS);
        a.ok(is.string(sep) && sep.length === 1, 'separator_character=RANDOM returns expected value');
    });
    
    QUnit.test('generate password synchronously', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator.generatePasswordsSync), 'function exists');
        
        // a basic config
        const testConf = new HSXKPasswd.Config();
        //console.log(testConf);
        
        // a basic dictionary
        const testDict = HSXKPasswd.Dictionary.defaultDictionary();
        
        // a basic random number source
        const testRNS = new HSXKPasswd.RandomNumberSource();
        
        // try generate a password with all the defaults and make sure a string is returned
        const testDefault = HSXKPasswd.Generator.generatePasswordsSync(testConf, testDict, testRNS);
        a.ok(is.array(testDefault) && testDefault.length === 1 && is.string(testDefault[0]) && testDefault[0].length > 0, 'returns a string');
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultConfig = new HSXKPasswd.Generator();
        a.ok(true, 'did not throw error');
    });
});