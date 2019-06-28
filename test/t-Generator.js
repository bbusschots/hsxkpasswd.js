QUnit.module('HSXKPasswd.Generator Class', function(){
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Generator), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultConfig = new HSXKPasswd.Generator();
        a.ok(true, 'did not throw error');
    });
    
    QUnit.test('apply case transformations synchronously', function(a){
        a.expect(9);
        
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
    });
});