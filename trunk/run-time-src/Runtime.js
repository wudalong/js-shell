
/**
  @global
*/

Runtime = {}

function runtime(){
	return 'js-shell 0.1'
}

/**
类似Python中的dir方法,返回对象的属性列表。
    Example:
<pre><code>
    var person = {name:'deownu', age:'99'};
    attr = dir(person);
    print(attr); //result: name, age
</code></pre>   

@return Array
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
 * 使用fn遍历数组
  Example:
<pre><code>
    var person = {name:'deownu', age:'99'};
    
    each(dir(person), fn(e){
        print(e + ":" + person[e]); //print the attr and value.
    });
</code></pre>    
         */
function each(o1, fn2){
	for(var i=0; i<o1.length; i++){
		fn2(o1[i])
	}
}

/**
 * 
  Example:
<pre><code>
    var person = {name:'deownu', age:'99'};
    
    each(dir(person), fn(e){
        print(e + ":" + person[e]); //print the attr and value.
    });
</code></pre>    
         */
function dump(o) {
    print('{');
    each(o, function(e){
            print(e+':' + o[e])
        });
    print('}'); 
}

$import(['File']);