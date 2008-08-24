
/**
* Ext core utilities and functions. Ext core utilities and functions.
* Ext core utilities and functions.
  @global
*/

Runtime = {}

function runtime(){
	return 'js-shell 0.1'
}

/**
类似Python中的dir方法
*/
function dir(a) {
    var attr = []
    var i = 0
    for (e in a){
        attr[i++] = e
    }
    return attr
}

/**
 * Applies event listeners to elements by selectors when the document is ready.
 * The event name is specified with an @ suffix.
  Example:
  The event name is specified with an @ suffix.
<pre><code>
Ext.addBehaviors({
   // add a listener for click on all anchors in element with id foo
   '#foo a@click' : function(e, t){
       // do something
   }
});
</code></pre>
         * @param {Object} obj The list of behaviors to apply
         */
function each(o1, fn2){
	for(var i=0; i<o1.length; i++){
		fn2(o1[i])
	}
}

/**
* @class Http
* Ext core utilities and functions. Ext core utilities and functions.
* Ext core utilities and functions.
*/
Runtime.Http = {
        /**
         * Applies event listeners to elements by selectors when the document is ready.
         * The event name is specified with an @ suffix.
         
		Example:
		    test test test test test test test 
			<code>
			     var list = new Runtime.Http();
			     list.test()
			</code>

         * @param {Object} obj The list of behaviors to apply
         * @set test2
         */
	test: function(){
	   print("running Runtime.Http.test")
	}
}

function dump(o) {
    print('{');
    each(o, function(e){
            print(e+':' + o[e])
        });
    print('}'); 
}

$import(['File']);