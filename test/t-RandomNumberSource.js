QUnit.module('HSXKPasswd.RandomNumberSource Class', function(){
    QUnit.test('random number to random boolean conversion', function(a){
        a.expect(4);
        
        // make sure the function and its alias exist
        a.ok(is.function(HSXKPasswd.RandomNumberSource.randomBooleanFromRandomNumber), 'function exists');
        
        // test the conversion
        a.equal(
            HSXKPasswd.RandomNumberSource.randomBooleanFromRandomNumber(0.00001),
            false,
            'lower bound returns false'
        );
        a.equal(
            HSXKPasswd.RandomNumberSource.randomBooleanFromRandomNumber(0.99999),
            true,
            'upper bound returns true'
        );
        a.equal(
            HSXKPasswd.RandomNumberSource.randomBooleanFromRandomNumber(0.5),
            true,
            'intermediate value returns expected result'
        );
    });
    
    QUnit.test('random number to random index conversion', function(a){
        a.expect(4);
        
        // make sure the function and its alias exist
        a.ok(is.function(HSXKPasswd.RandomNumberSource.randomIndexFromRandomNumber), 'function exists');
        
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
    });
    
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.RandomNumberSource), 'class exists');
        
        // call the constructor with no arguments and make sure it doesn't throw an error
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        a.ok(true, 'did not throw error');
    });
    
    QUnit.test('sync random boolean generation with default RNG', function(a){
        a.expect(4);
        
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the functions exist
        a.ok(is.function(defaultRNS.randomBooleanSync), '.randomBooleanSync() exists');
        a.ok(is.function(defaultRNS.randomBooleansSync), '.randomBooleansSync() exists');
        
        // try generate a single random boolean
        a.ok(is.boolean(defaultRNS.randomBooleanSync()), '.randomBooleanSync() returns valid value');
        
        // try generate multiple random booleans
        const numBools = 5;
        const rbs = defaultRNS.randomBooleansSync(numBools);
        a.ok(is.array(rbs) && rbs.length === numBools && is.all.boolean(rbs), 'randomBooleansSync() returns array of booleans of the expected length');
    });
    
    QUnit.test('sync random digit generation with default RNG', function(a){
        a.expect(5);
        
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the functions exist
        a.ok(is.function(defaultRNS.randomDigitSync), '.randomDigitSync() exists');
        a.ok(is.function(defaultRNS.randomDigitsSync), '.randomDigitsSync() exists');
        
        // try generate a single random digit
        const rd = defaultRNS.randomDigitSync();
        a.ok(is.number(rd) && String(rd).match(/^\d$/), '.randomDigitSync() returns valid value');
        
        // try generate multiple random digits
        const numDigits = 5;
        const rds = defaultRNS.randomDigitsSync(numDigits);
        a.ok(is.array(rds) && rds.length === numDigits && is.all.number(rds), 'randomDigitsSync() returns array of numbers of the expected length');
        const allDigitsValid = true;
        for(const rd of rds){
            if(rd < 0 || rd > 9) allDigitsValid = false;
        }
        a.ok(allDigitsValid, 'all numbers returned by randomDigitsSync() are single-digit numbers');
    });
    
    QUnit.test('sync random index generation with default RNG', function(a){
        a.expect(5);
        
        const defaultRNS = new HSXKPasswd.RandomNumberSource();
        
        // make sure the functions exist
        a.ok(is.function(defaultRNS.randomIndexSync), '.randomIndexSync() exists');
        a.ok(is.function(defaultRNS.randomIndexesSync), '.randomIndexesSync() exists');
        
        // try generate a single random index
        const l = 5;
        const ri = defaultRNS.randomIndexSync(l);
        a.ok(is.integer(ri) && ri >= 0 && is.under(ri, l), '.randomIndexSync() returns valid value');
        
        // try generate multiple random indexes
        const numIndexes = 5;
        const ris = defaultRNS.randomIndexesSync(numIndexes, l);
        a.ok(is.array(ris) && ris.length === numIndexes && is.all.integer(ris), 'randomIndexesSync() returns array of integers of the expected length');
        const allIndexesValid = true;
        for(const ri of ris){
            if(ri < 0 || ri >= l) allIndexesValid = false;
        }
        a.ok(allIndexesValid, 'all indexes returned by randomIndexesSync() are valid');
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
        
        // try generate multiple random numbers
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