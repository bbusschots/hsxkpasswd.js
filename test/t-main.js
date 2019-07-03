QUnit.module('HSXKPasswd module', function(){
    QUnit.test('exports', function(a){
        a.expect(6);
        
        // make sure the expected classes are exported exist
        a.ok(is.function(HSXKPasswd.Config), 'Config class exported');
        a.ok(is.function(HSXKPasswd.Dictionary), 'Dictionary class exported');
        a.ok(is.function(HSXKPasswd.Generator), 'Generator class exported');
        a.ok(is.function(HSXKPasswd.RandomNumberSource), 'RandomNumberSource class exported');
        
        // make sure the expected module-level functions are exported
        a.ok(is.function(HSXKPasswd.passwordSync), 'passwordSync() function exported');
        a.ok(is.function(HSXKPasswd.passwordsSync), 'passwordsSync() function exported');
    });
    
    QUnit.test('quick-access synchronous password generation', function(a){
        a.expect(2);
        
        // test single password generation
        const pass = HSXKPasswd.passwordSync();
        a.ok(is.string(pass) && is.not.empty(pass), 'successfully generated single password');
        
        // test multiple password generation
        const numPass = 5;
        const multiPass = HSXKPasswd.passwordsSync(numPass);
        a.ok(
            is.array(multiPass) && multiPass.length === numPass && is.all.string(multiPass),
            'successfully generated multiple passwords'
        );
    });
});