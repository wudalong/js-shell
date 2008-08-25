
/**
  @global
*/

function $loadcoding(model) {
    return readFile(model, 'utf-8');
}

var global = this;

/**
  defined same global function.
  
  @class Lang
*/
Lang = function(scope){
    this.exports = ['extend', 'each',
                    'grep', 'map', 'dir', '__import__']
    lang = this; 
    this.each(this.exports, function(e){
        //may be it's very slow?
        scope.__defineGetter__(e, function(){return eval('lang.' + e)});
        scope.__defineSetter__(e, function(){throw e + 
                               " is defined as readonly object before!";});
        //lang.__import_readonly__(scope, e, eval('lang.' + e))
    });
}

Lang.fn = Lang.prototype = {
    extend: function(target, sp, defaults) {
        if(defaults) Lang.fn.extend(target, defaults)
        
        if(typeof(o) === "function") {
            target = target.prototype
        }else if (typeof target != "object"){
            target = {}
        }
        
        if (sp && typeof sp == 'object') {
              for(var attr in sp){
                  target[attr] = sp[attr]
              }
        }

        return target;
    },
    
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
    each: function(obj, call_back, scope) {
        if(!obj || typeof obj != 'object') return;
        
        if(obj.constructor === Array) {
            return Lang.fn.eachArray(obj, call_back, scope)
        }else {
            for(var k in obj) {
                if (call_back.call(scope || obj, obj[k], k) === false){
                    return false
                }
            }
            return true
        }
    },
    
    eachArray: function(obj, call_back, scope) {
        for(var i=0; i<obj.length; i++){
            if (call_back.call(scope || obj, obj[i], i) === false)
               return false;
        }
        return true;
    },
    
    grep: function(call_back, list, scope) {
        if(!list || typeof list != 'object') return [];
        
        if (typeof call_back == 'string'){
            var fn = call_back;
            call_back = function($, k){return eval(fn)} 
        }
        
        if(list.constructor === Array) {
            result = []
            Lang.fn.each(list, function(item, k) {
                if (call_back.call(scope || item, item, k)){
                    result.push(item)
                }
            })
        }else {
            result = new list.constructor()
            Lang.fn.each(list, function(item, k) {
                if (call_back.call(scope || item, item, k)){
                    result[k] = item
                }
            })
        }
        
        return result;            
    },
        
    map: function(call_back, obj, scope) {
        if(!obj || typeof obj != 'object') return;
        
        if (typeof call_back == 'string'){
            var fn = call_back;
            call_back = function($, k){return eval(fn)} 
        }        
        
        result = new obj.constructor()
        Lang.fn.each(obj, function(item, k) {
            result[k] = call_back.call(scope || item, item, k)
        })
        
        return result;    
    },   
    
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
    dir: function(obj) {
        var attrs = []
        for (var k in obj){
            attrs.push(k)
        }
        return attrs
    },
    
    __import__: function(mode, imports, scope) {
       coding = $loadcoding(mode);
       
       coding += "\n;each(imports || exports, function(e){scope[e] = eval(e);});"
       try{
           (new Function('imports', 'scope', coding))(imports, scope || global)
       }catch(e) {
           print(e.toString())
       }
    },
    
    __import_readonly__: function(scope, name, obj) {
       scope[name] = obj
       //print(name + ',' + obj);
       /*
       scope.__defineSetter__(name, function(val) {
           throw name + " is defined as readonly object before!";
       });*/
    }

}

new Lang(this)

//__import__('File')