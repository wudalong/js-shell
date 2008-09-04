/* 
 * Copyright (C) 2008 DeonWu@gmail.com
 *
 * This file is part of Js-Shell. Js-Shell is a set of library for running
 * javascript in Rhino.
 *
 * Js-Shell is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Js-Shell is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with Js-Shell.  If not, see <http://www.gnu.org/licenses/>.
 *
 * $ Name LastChangeRevision LastChangeDate LastChangeBy $
 * $Id$
 */



var global = this;
var	exports = ['Lang'];

/**
  defined same global function
  
  @class Lang
*/
var Lang = function(scope){
}

Lang.fn = Lang.prototype = {

    exports: ['extend', 'each',
              'grep', 'map', 'dir', '__import__',
              'cmp', 'min', 'max',
             ],

    __importToScopt__: function(scope){
	    var lang = this;
	    this.each(this.exports, function(e){
	        //may be it's very slow?
	        scope.__defineGetter__(e, function(){return eval('lang.' + e)});
	        scope.__defineSetter__(e, function(){throw e + 
	                               " is defined as readonly object before!";});
	        //lang.__import_readonly__(scope, e, eval('lang.' + e))
	    });
    },

    /**
     * Copies all the properties of config to obj.


     
       Copy from(Ext-js)
     * @param {Object} obj The receiver of the properties
     * @param {Object} config The source of the properties
     * @param {Object} defaults A different object that will also be applied for default values
     * @return {Object} returns obj
     * @member Ext apply
     */
    apply: function(o, c, defaults){
        if(defaults){
            // no "this" reference for friendly out of scope calls
            Ext.apply(o, defaults);
        }
        if(o && c && typeof c == 'object'){
            for(var p in c){
                var g = c.__lookupGetter__(p), s = c.__lookupSetter__(p);
                if ( g || s ) {
                    if ( g )
                        o.__defineGetter__(p, g);
                    if ( s )
                        o.__defineSetter__(p, s);
                 } else
                    o[p] = c[p];
            }
        }
        return o;
    },

        /**
         * Extends one class with another class and optionally overrides members with the passed literal. This class
         * also adds the function "override()" to the class that can be used to override
         * members on an instance.
         * * <p>
         * This function also supports a 2-argument call in which the subclass's constructor is
         * not passed as an argument. In this form, the parameters are as follows:</p><p>
         * <div class="mdetail-params"><ul>
         * <li><code>superclass</code>
         * <div class="sub-desc">The class being extended</div></li>
         * <li><code>overrides</code>
         * <div class="sub-desc">A literal with members which are copied into the subclass's
         * prototype, and are therefore shared among all instances of the new class.<p>
         * This may contain a special member named <tt><b>constructor</b></tt>. This is used
         * to define the constructor of the new class, and is returned. If this property is
         * <i>not</i> specified, a constructor is generated and returned which just calls the
         * superclass's constructor passing on its parameters.</p></div></li>
         * </ul></div></p><p>
         
         Copy from(Ext-js)
         Example:
         For example, to create a subclass of the Ext GridPanel:
         <pre><code>
    MyGridPanel = Ext.extend(Ext.grid.GridPanel, {
        constructor: function(config) {
            // Your preprocessing here
            MyGridPanel.superclass.constructor.apply(this, arguments);
            // Your postprocessing here
        },

        yourMethod: function() {
            // etc.
        }
    });
</code></pre>
         * </p>
         * @param {Function} subclass The class inheriting the functionality
         * @param {Function} superclass The class being extended
         * @param {Object} overrides (optional) A literal with members which are copied into the subclass's
         * prototype, and are therefore shared between all instances of the new class.
         * @return {Function} The subclass constructor.
         */
    extend: function(){
        // inline overrides
        var io = function(o){
            for(var m in o){
                var g = o.__lookupGetter__(m), s = o.__lookupSetter__(m);
                if ( g || s ) {
                    if ( g )
                        this.__defineGetter__(m, g);
                    if ( s )
                        this.__defineSetter__(m, s);
                 } else
                    this[m] = o[m];
             }
        };
        var oc = Object.prototype.constructor;

        return function(sb, sp, overrides){
            if(typeof sp == 'object'){
                overrides = sp;
                sp = sb;
                sb = overrides.constructor != oc ? overrides.constructor : 
                        function(){sp.apply(this, arguments);};
            }
            var F = function(){}, sbp, spp = sp.prototype;
            F.prototype = spp;
            sbp = sb.prototype = new F();
            sbp.constructor=sb;
            sb.superclass=spp;
            if(spp.constructor == oc){
                spp.constructor=sp;
            }
            sb.override = function(o){
                Lang.fn.override(sb, o);
            };
            sbp.override = io;
            Lang.fn.override(sb, overrides);
            sb.extend = function(o){return Lang.fn.extend(sb, o);};
            return sb;
        };
    }(),
    
    override: function(origclass, overrides){
        if(overrides){
            var p = origclass.prototype;
            for(var i in overrides){
                var g = overrides.__lookupGetter__(i),
                    s = overrides.__lookupSetter__(i);
		        if ( g || s ) {
		            if ( g )
		                p.__defineGetter__(i, g);
		            if ( s )
		                p.__defineSetter__(i, s);
		         } else
                    p[i] = overrides[i];
            }
        }
    },
    
    /**
        To compare the two obj, return 1, 0 -1.
        if the two object is Array, compared the each items.
    
    @return Number
           
    */    
    cmp: function(obj1, obj2) {
        if(obj1 && obj1.constructor == Array &&
           obj2 && obj2.constructor == Array 
        ){
            var len = min(obj1.length, obj2.length)
            for(var i = 0; i < min(obj1.length, obj2.length); i++){
                var re = Lang.fn.cmp(obj1[i], obj2[i])
                if (re != 0) return re
            }
            return Lang.fn.cmp(obj1.length, obj2.length)
        }else {
            if(obj1 == obj2)return 0;
            return (obj1 < obj2) ? -1 : 1;
        }
    },
    
    /**
     return minimal object.
    @return obj
    */        
    min: function(obj1, obj2) {
        var m = obj1;
        for(var i = 1; i < arguments.length; i++) {
            if(arguments[i] < m){ m = arguments[i]}
        }
        return m;
    },
    
    /**
    return maximum object.
    @return obj
    */        
    max: function(obj1, obj2) {
        var m = obj1;
        for(var i = 1; i < arguments.length; i++) {
            if(arguments[i] > m){ m = arguments[i]}
        }
        return m;
    },
     
    /**
        To traversal the items of object by applying 'call_back' function. stoped
        if the 'call_back' return false. if the object have next(), it's called for iterating the 
     object, until the 'StopIterator' is throwed.
    
    @return Boolean
           
      Example:
    <pre><code>
        var person = {name:'deownu', age:'99'};
        
        each(dir(person), fn(e){
            print(e + ":" + person[e]); //print the attr and value.
        });
    </code></pre>
      Example:
      
    <pre><code>
        var iterator = {i:100
                        next:function(){
                            if(i >= 110) throw "StopIterator"
                            return this.i++;
                        }}
        
        each(iterator, fn(e, i){
            print(e, i); 
        });
    </code></pre>       
             */
    each: function(obj, call_back, scope) {
        if(!obj || typeof obj != 'object') return false;
        
        if(obj.constructor === Array) {
            return Lang.fn.eachArray(obj, call_back, scope)
        }else if(typeof(obj.next) == 'function'){
            return Lang.fn.eachIterator(obj, call_back, scope)
        }else {
            for(var k in obj) {
                if (call_back.call(scope || obj, obj[k], k) === false){
                    return false
                }
            }
            return true
        }
        
    },
    
    eachIterator: function(obj, call_back, scope) {
        try {
            for(var i = 0; true; i++){
                item = obj.next(i)
                if(call_back.call(scope || obj, item, i) === false){
                    return false
                }
            }
        }catch(e){
            if (e.toString() != "StopIterator"){
                throw e
            }
        }
        return true
    },
    
    eachArray: function(obj, call_back, scope) {
        for(var i=0; i<obj.length; i++){
            if (call_back.call(scope || obj, obj[i], i) === false)
               return false;
        }
        return true;
    },
    
    /**
        Return a sub list of the argument list, filted the item by firstly
        argument. if the item will returned if executing the filter with item 
        return true.
        the 'grep' function called 'each' function to traversal list, so any type
        of object supported by 'each' can passed as 'grep' function.
        
        @return Array
        
        Example:
        filter a array list.        
        <pre><code>
            list = [1,2,3,4]
            new_list = grep(function(e,i){return e > 2}, list);
            print(new_list) //result is [3, 4]
            
            //other simple way, pass a string as filter function. this '$' is 
            items of list.
            new_list = grep("$+100", list);
            
        </code></pre>
        Example:
        filter a object.        
        <pre><code>
            obj = {t1:100, t2:200, t3:300}            

            new_obj = grep("$>100", obj);
            
            print(dir(new_obj)); //result is [t2, t3]
            
        </code></pre>        
        
    */     
    
    grep: function(filter, list, scope) {
        if(!list || typeof list != 'object') return [];
        
        if (typeof filter == 'string'){
            var fn = filter;
            filter = function($, k){return eval(fn)} 
        }else if(filter.constructor == RegExp) {
            var p = filter;
            filter = function($, k){return p.test($)}
        }
        
        if(list.constructor === Array) {
            result = []
            Lang.fn.each(list, function(item, k) {
                if (filter.call(scope || item, item, k)){
                    result.push(item)
                }
            })
        }else {
            result = new list.constructor()
            Lang.fn.each(list, function(item, k) {
                if (filter.call(scope || item, item, k)){
                    result[k] = item
                }
            })
        }
        
        return result;            
    },
    
    /**
        Return a list of the result of applying the function to the items of 
        a obj. used 'each' function to traversal the obj.
        
        @return Array
        
        Example:
        everty item of list added 100.
        <pre><code>
            list = [1,2,3,4]
            new_list = map(function(e,i){return e+100}, list);
            print(new_list) //result is [101, 102, 103, 104]
            
            //other simple way, apply a string as call function. this '$' is 
            items of list.
            new_list = map("$+100", list);
            
        </code></pre>
        
        
    */ 
    map: function(converter, obj, scope) {
        if(!obj || typeof obj != 'object') return;
        
        if (typeof converter == 'string'){
            var fn = converter;
            converter = function($, k){return eval(fn)} 
        }    
        
        var result = new obj.constructor()
        Lang.fn.each(obj, function(item, k) {
            result[k] = converter.call(scope || item, item, k)
        })
        
        return result;    
    },   
    
    /**
       Return a list of the object.
    @return Array
        
        Example:
    <pre><code>
        var person = {name:'deownu', age:'99'};
        attr = dir(person);
        print(attr); //result: name, age
    </code></pre>   
    
    */
    dir: function(obj) {
        var attrs = []
        for (var k in obj){
            attrs.push(k)
        }
        return attrs
    },
    
    /**
        import function from JS file in a special scope(namespace).
        
        *param: module -- a moduel name, should a JS file without the extension.
        <br/>
        *param: imports -- a list which function will be imported, default is 
        used exports list, defined by module self.<br/>
        *param: scope -- the scope of to import the functions, default is global
        JS object.
        @return NameSpace
        
        Example:
        <pre><code>
            var unitTest = __import__('UnitTest', ['TestRunner'], {})
            var runner = new unitTest.TestRunner            
            
            //import all function of UnitTest to current JS global environment.
            __import__('UnitTest')
            var runner = new TestRunner()
        </code></pre>
        
    */     
    __import__: function(module, imports, scope) {
       var coding = $loadcoding(module);
       
       coding += "\n;each(imports || exports, function(e){scope[e] = eval(e);});"
       try{
            /*
           lib = new Function('imports', 'scope', coding)
           lib.name = module
           lib(imports, scope || global)
           */
           var before_global = dir(global);
           
           (new Function('imports', 'scope', coding))(imports, scope || global);
           var after_global = dir(global)
           
           if(scope){
               //check new add global symbol by export.
               each(after_global, function(e){
                   if(grep(function(i){return i === e;}, before_global).length
                      ==0){
                       print("!!!Waring!!! '" + e + "' is exported to global" + 
                             " by " + module) 
                   }
               })
           }
           
           return scope;
       }catch(e) {
           print("import '" + module  + "' error:")
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