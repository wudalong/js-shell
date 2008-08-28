
test("hello unit test", function() {
    info('hello unit test')
    for(var i = 0; i < 9999; i++){
        i += 0
    }
});

test("assert true", function() {
    assert(true)
});

test("assert false", function() {
    assert(false, "failed by expect")
});

test("assertEqual", function() {
    assertEqual(10+ 20, 30)
});

test("assertEqual fail no message", function() {
    assertEqual(10+ 20, 31)
});

test("assertEqual fail with message", function() {
    assertEqual(10+ 20, 31, "10+20 != 31")
});

test("fail", function() {
    fail("This fail assert")
});

test("assertRaises expect raised", function() {
    assertRaises('Stop', function(m){throw m}, 'Stop')
});

test("assertRaises no raised", function() {
    assertRaises('Stop', function(m){}, 'Stop')
});

test("assertRaises mismatch raised", function() {
    assertRaises('Stop', function(m){throw m}, 'Start')
});

test({
    name: "Basic Requirements",
    msg: '',
    setUp: function(){
        this.msg = "enter setUp";
        info('enter setUp');
    },
    
    test_basic_requirements: function(){
        info('running test_basic_requirements');
        assertEqual(this.msg, "enter setUp")
        this.msg = 'test_basic_requirements'
    },
    
    test_setUp_called_for_every_functional: function(){
        info('test_setUp_called_for_every_functional');
        assertEqual(this.msg, "enter setUp")
        this.msg = 'test_setUp_called_for_every_functional'
    },   
    
    tearDown: function(){
        this.msg = "enter tearDown";
        info('enter tearDown');
    },
    
});
