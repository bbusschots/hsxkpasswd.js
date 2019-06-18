QUnit.module('HSXKPasswd.Config Class', function(){
    QUnit.test('default constructor', function(a){
        a.expect(2);
        
        // make sure the function exists
        a.ok(is.function(HSXKPasswd.Config), 'class exists');
        
        // call the constructor with no arguments and make sure we get the expected results
        const defaultConfig = new HSXKPasswd.Config();
        a.ok(true, 'default constructor did not throw an error');
    });
});