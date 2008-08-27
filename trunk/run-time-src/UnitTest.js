
var exports = ['run_suite', 'TestRunner', 'TestResult', 'TestCase', 'TestSuite']

var file_lib = __import__('File', null, {})
/**

*/
function run_suite(path, context){

    print('suite root:' + (new file_lib.File(path)).abs_path())
    
	var runner = new TestRunner(context)
	
	var  suite = new TestSuite('Simple suite', path)
	suite.add_case('test_*.js')
	
	var result = runner.run(suite, new TextTestResult())
	
	result.summary()
}

/**
    @class TestSuite
    
    this class used to load testcase from JS files. managed the loading rules
    of testcase. 
*/
var TestSuite = extend(function(name, root){
        this.name = name;
        this.testCases = [];
        this.pattern = [];
        root_path = this.root_path = new file_lib.File(root);
        if(!root_path.isDir()){throw "'" + root + "' is not a directory!";}
        
        this.loaded = false     
     }, {
        /**
            load cases JS condig from suite directory.
        */
        load_cases: function(){
            if(!this.loaded){
                pattern = this.pattern;
                testCases = this.testCases;
	            this.root_path.walker(function(name, path) {
	                for(var i = 0; i < pattern.length; i++){
	                   if(pattern[i].test(name)){
	                       testCases.push(path);
	                   }
	                }
	            })
	            this.testCases.sort();
	            this.loaded = true;
            }           
            //list = map('this.root_path + $', this.testCase, this)
            //return map($loadcoding, list)
            /**
              create a iterator for loading testcase coding, it's passed to 
              'each' function to iterate.
            */
            //print('loaded test Cases:' + this.testCases)
            return {i: 0, 
                    list: this.testCases, 
                    root: this.root_path,
                    next: function(e, i) {
                        if (i >= this.list.length) {
                            throw "StopIterator"
                        }
                        //var tc_file = new file_lib.File(this.list[this.i], this.root);
                        var tc_file = this.root.abs_path() + this.list[this.i]
                        this.i += 1;
                        return {file: tc_file,
                                source: $loadcoding(tc_file)
                               }
                    }};
        },
        
        /**
           add testcase pattern or testcase file.
        */        
        add_case: function(tc){
            if(tc.constructor === RegExp) {
                this.pattern.push(tc)
            }else if(tc.indexOf('*') == -1){
	            file = new this.files.File(tc, this.root_path);
	            if(!file.is_file()){throw "'" + file + "' is not a file!";}
	            
	            this.testCases.push(tc)
            }else {
                p = tc.replace(/\./, "\\.")
                p = p.replace(/\*/, ".*")
                this.pattern.push(new RegExp(p, 'i'));
            }
        },        
    });

/**
    @class TestRunner.
    the class is get testcase from suite, and initial a TestCase object as
    executing testcase context.
*/
var TestRunner = extend(function(tc){
        this.TestCaseContext = tc || TestCase
    }, {
    /**
        run a testsuite.
        @param suite
    */
    run: function(suite, result){
        runner = this;
        result = result || this.result || new TextTestResult()
        each(suite.load_cases(), function(item, k){
            runner._run_test_file(item.file, item.source, result)
        });
        return result
    },
    
    _run_test_file: function(file_name, coding, result) {
        var tc = new this.TestCaseContext(result);
        //tc.setUp()
        
        with(tc){
            info('Start test file:' + file_name)
            try{
				eval(coding); 
            }catch(e){
                info('Loading test file error:' + e)
            }
        }
        //tc.tearDown()
    }
    });

/**
 @class TestResult 
    This class is used to save information about which tests have succeeded
    and which have failed.
*/ 
var TestResult = extend(function(){
        this.logs = [];
        this.failed = 0;
        this.passed = 0;
        this.times = 0
    }, {
    /*
        save one test case stauts.
    */
    result: function(name, st, et, state, msg){
        this.logs.push({name:name,
                        state:state, 
                        msg:msg,
                        start:st,
                        end:et
                        });
        this.times += et - st
        if (state == 'PASS'){
            this.passed++;
            this.pass(name, state, et-st, msg)
        }else {
            this.failed++;
            this.fail(name, state, et-st, msg)
        }
    },
    
    /**
        call back when passed a test case, can output log information in it.
        default is a empty function in TestResult.
    */
    pass: function(name, state, times, msg){},
    
    /**
        call back when failed a test case, can output log information in it.
        default is a empty function in TestResult.
    */    
    fail: function(name, state, times, msg){},
    
    /**
        generate tests summary. current is empty function.
    */      
    summary: function(){},
    
    info: function(name, msg) {},
    
})

/**
 @class TestResult 
 TestTestResult output result of tests in the console. 
*/ 
var TextTestResult = extend(TestResult, {
	    pass: function(name, state, times, msg){
	        print(name + "..." + state + " in " + times + "ms")
	    },
	    fail: function(name, state, times, msg){
	        print(name + "..." + state + " in " + times + "ms" +
	              "\n\t" + msg)
	    },
	    
	    info: function(name, msg) {
	        print("[INFO]" + name + ":" + msg)
	    },
	    
        summary:function(){
	        print("-----------------------------------------------------------")
	        print("Ran " + (this.failed+this.passed) + " tests in " +
	              this.times + "ms")
	        if(this.failed === 0){
	            print("OK")
	        }else {
	            print("FAILED! Pass:" + this.passed + ", Failed:" + this.failed)
	        }
        }
        
    });
    
/*
@class TestCase
It's defined a testcase running context for every test suit file.
*/
var TestCase = extend(function(result) {
        this.result = result;
        this.curTestCase = this;
        this.running_name = ''
    }, {
		_test_status: function(name, st, et, state, msg){
		     this.result.result(name, st, et, state, msg)
		},
        info: function(msg){
             this.result.info(this.running_name, msg)
        },

	    assert: function(expr, msg) {
	       expr = (typeof expr == 'string') ? eval(expr) : expr 
	       if(! expr) {
                throw msg || "error"	           
	       }   
	    },
		
		assertEqual: function(expected, actual, msg) {
		     if(expected != actual) {
		          throw msg || "expected: " + expected + ", actual: " + actual
		     }
		},
		
		assertRaises: function(exception, callable, args, scope, msg){
		     var actual;
		     try{
		          args = (args.constructor == Array) ? args : [args]
		          callable.apply(scope || null, args)
		          actual = null
		     }catch(e){
		          actual = e.toString()
		     }
		     
		     if (actual === null){
		          throw msg || "not throw expected exception:" + exception
		     }else if(actual != exception) {
		          throw msg || "expected exception:" + exception + 
		                       ", catched:" + actual
		     }		     
		},
		   
	    fail: function(msg) {
	       throw msg
	    },
	    
	    /**
	       run a testCase; <br/>
	       *param: name -- testname used to print log.<br/>
	       *param: testCase -- special test case, a function or object. if it's 
	                       a object. every function of named starts with 
	                       'test_' will be run as test case.<br/>
	       *param: scope -- the testcase running context, default is current 
	                       testcase object.
	                    
	    */
	    test: function(name, testCase, scope){
	       this.running_name = name
	       var startTime = new Date().getTime(), endTime;
	       
           if(typeof name == 'object'){
                _test = this;
                testObj = name
                var setUp = testObj.setUp ||function(){}
                var tearDown = testObj.tearDown ||function(){}
                
                each(name, function(tc, name){
                    if (name.indexOf('test_') == 0){
	                    setUp.apply(scope || testObj)
	                    _test.test(name, tc, scope || testObj)
	                    tearDown.apply(scope || testObj)
                    }
                });
           }else {  //runn a test case.
		       try{
		           testCase.apply(scope || this.curTestCase)
		           
		           endTime = new Date().getTime()
		           this._test_status(name, startTime, endTime, 'PASS')
		       }catch(e){
		           endTime = new Date().getTime()
		           this._test_status(name, startTime, endTime, 'FAIL', e)
		       }
	       }
	    }
    });
