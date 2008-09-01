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

//init lang object.
var lang_lib = __import__('Lang', null, {})
var lang = new lang_lib.Lang()

// Lang.dir functional
test({
    test_dir_null_object: function(){
        var error = 'null or undefined object should return empty arrary';
        assertEqual(lang.dir(null), [], error)
        assertEqual(lang.dir(undefined), [], error)
    },
    
    test_dir_empty_object: function(){
        var object = {}
        assertEqual(lang.dir(object), [])
    },

    test_dir_object_object: function(){
        var object = {attr1:'test 1', attr2:'test 2'}
        assertEqual(lang.dir(object).sort(), ['attr1', 'attr2'])
    },
    
    test_dir_functional_object: function(){
        var obj1 = function(){}
        //Is it really expected in application?
        assertEqual(lang.dir(obj1), ['prototype'])
    },    
});
	
// Lang.each functional
test({
    test_each_null_object: function(){
        var error = 'null or undefined object should no item, when each called';
        
        var items = []
        var result = lang.each(null, function(e,i){items.push(e)})
        assertEqual(items, [], error)
        //may be false is more useful ?
        assertEqual(result, false)
        
        items = []
        result = lang.each(undefined, function(e,i){items.push(e)})
        assertEqual(items, [], error)
        assertEqual(result, false)        
    },
    
    test_each_empty_array: function(){
        var object = {}
        var items = []
        var result = lang.each(object, function(e,i){items.push(e)})
        assertEqual(items, [])
        //may be false is more useful ?
        assertEqual(result, true)
    },

    test_each_array_object: function(){
        var object = {}
        var re = [], index = []
        var result = lang.each(['test1', 'test2'],
			                  function(e,i){
			                    re.push(e);
			                    index.push(i)
			                  })
        assertEqual(re, ['test1', 'test2'])
        assertEqual(index, [0, 1])
        assertEqual(result, true)        
    },

    test_each_array_break: function(){
        var object = {}
        var re = [], index = []
        var result = lang.each(['test1', 'test2', 'test3'],
			                  function(e,i){
			                    re.push(e);
			                    index.push(i);
			                    
			                    return i < 1;
			                  })
        assertEqual(re, ['test1', 'test2'])
        assertEqual(index, [0, 1])
        assertEqual(result, false)
    },
    
    test_each_array_with_context: function(){
        var context = {}
        var result = lang.each(['test1', 'test2'],
                              function(e,i){
                                   this[e] = 'flag';
                              }, context)
        assertEqual(context.test1, 'flag')
        assertEqual(context.test2, 'flag')
    },    
    
    test_each_iterator_object: function(){
        var object = {
            item: '.',
            next: function(i){
                if (i > 2) {
                    throw 'StopIterator'
                }
                this.item += '.';
                return this.item;
            }
        };
        
        var re = []
        var result = lang.each(object,
                              function(e,i){
                                 re.push(e)
                              })
        assertEqual(re, ['..', '...', '....'])
    },
    
    test_each_object: function(){
        var object = {attr1:'1', attr2:'2'}
        var re = {}
        var result = lang.each(object,
                              function(e,i){
                                 re[i] = e
                              })
        assertEqual(lang.dir(re).sort(), ['attr1', 'attr2'])
        assertEqual(re.attr1, '1')
        assertEqual(re.attr2, '2')
    },    
});	

// Lang.grep functional
test({
    test_grep_null_object: function(){
        var error = 'should return empty list, if grep object is null or undefined';
        
        var result = lang.grep('true', null)
        assertEqual(result, [], error)

        var result = lang.grep('true', undefined)
        assertEqual(result, [], error)
    },
    
    test_grep_empty_array: function(){
        
        var result = lang.grep('true', [])
        assertEqual(result, [])
    },

    test_grep_array_object: function(){
        var result = lang.grep(function(e){return e % 2 == 0}, [1,2,3,4,5,6]);
        assertEqual(result, [2, 4, 6])
    },

    test_grep_array_with_string: function(){
        var result = lang.grep('$%2 == 0', [1,2,3,4,5,6]);
        assertEqual(result, [2, 4, 6])
    },

    test_grep_object_attr: function(){
        var result = lang.grep(function(e){return e % 2 == 0},
                               {attr1:1, 
                                attr2:2,
                                attr3:3,
                                attr4:4,});
                                
        assertEqual(lang.dir(result).sort(), ['attr2', 'attr4'])
        assertEqual(result.attr2, 2)
        assertEqual(result.attr4, 4)
    },    
  
    test_grep_array_with_regexp: function(){
        var result = lang.grep(/test_\d+/, ['test_1', 'test_11', 'test_a']);
        assertEqual(result, ['test_1', 'test_11'])
    },
}); 

// Lang.map functional
test({
    test_map_null_object: function(){
        var error = 'should return undefined, if map object is null or undefined';
        
        var result = lang.map('true', null)
        assertEqual(result, undefined, error)

        var result = lang.map('true', undefined)
        assertEqual(result, undefined, error)
    },
    
    test_map_empty_array: function(){
        
        var result = lang.map('$ * 2', [])
        assertEqual(result, [])
    },

    test_map_array_object: function(){
        var result = lang.map(function(e){return e * 2}, [1,2,3,4,5,6]);
        assertEqual(result, [2, 4, 6, 8, 10, 12])
    },

    test_map_array_object_with_string: function(){
        var result = lang.map('$ * 2', [1,2,3,4,5,6]);
        assertEqual(result, [2, 4, 6, 8, 10, 12])
    },

    test_map_object_attr: function(){
        var result = lang.map(function(e){return e * 2},
                               {attr1:1, 
                                attr2:2,
                               });
                                
        assertEqual(lang.dir(result).sort(), ['attr1', 'attr2'])
        assertEqual(result.attr1, 2)
        assertEqual(result.attr2, 4)
    },    
  
    test_map_object_attr_with_string: function(){
        var result = lang.map('$ * 2',
                               {attr1:1, 
                                attr2:2,
                               });
                                
        assertEqual(lang.dir(result).sort(), ['attr1', 'attr2'])
        assertEqual(result.attr1, 2)
        assertEqual(result.attr2, 4)
    },  
}); 

// Lang.max/min/cmp functional
test({
    
    test_max_list: function(){
        assertEqual(lang.max(1), 1)
        assertEqual(lang.max(3, 1, 5), 5)
        assertEqual(lang.max('ab', 'ac', 'cc'), 'cc')        
    },
    
    test_min_list: function(){
        assertEqual(lang.min(1), 1)
        assertEqual(lang.min(3, 1, 5), 1)
        assertEqual(lang.min('ab', 'ac', 'cc'), 'ab')        
    },    
 
    test_cmp_number: function(){
        assertEqual(lang.cmp(1, 2), -1)
        assertEqual(lang.cmp(2, 1), 1)
        assertEqual(lang.cmp(1, 1), 0)   
        
        assertEqual(lang.cmp(1, undefined), 1)   
    },
 
    test_cmp_string: function(){
        assertEqual(lang.cmp('ab', 'bb'), -1)
        assertEqual(lang.cmp('bb', 'ab'), 1)
        assertEqual(lang.cmp('aa', 'aa'), 0)   
        
        assertEqual(lang.cmp('aa', undefined), 1)   
        
    },  
 
    test_cmp_array: function(){
        assertEqual(lang.cmp([], []), 0)
        assertEqual(lang.cmp([1], []), 1)
        assertEqual(lang.cmp([1, 2 ,3], [1, 2, 3]), 0)
        assertEqual(lang.cmp([1, 3 ,3], [1, 2, 3]), 1)
        
        assertEqual(lang.cmp([1, [1, 2, 3] ,3], [1, [1, 2, 3], 3]), 0)
        assertEqual(lang.cmp([1, [1, 3, 3] ,3], [1, [1, 2, 3], 3]), 1)
        
        assertEqual(lang.cmp([1, 2 ,3], [1, 2, 3, 0]), -1)
        
    },               
}); 

// Lang.extend functional
test({
    
    test_extend_function: function(){
        var base = function(){
            this.attr1 = 'test';
            this.base_fn = function(){}
         };
        
        var subClass = lang.extend(base, {
            sub_fn: function(){
                return 'sub_fn'
            },
            sub_attr: 'test_attr',
        });
        
        var subObj = new subClass();
        var baseObj = new base();
        
        assertEqual(baseObj.attr1, 'test')
        assertEqual(baseObj.base_fn.constructor, Function)
              
        assertEqual(subObj.attr1, 'test')
        assertEqual(subObj.base_fn.constructor, Function)
        
        assertEqual(subObj.sub_fn(), 'sub_fn')
        assertEqual(subObj.sub_attr, 'test_attr')
    },
    
    test_extend_overriding_function: function(){
        var base = lang.extend(function(){
         }, {
            attr1: 'base_attr',
            base_fn: function(){return 'base_fn';}
         });
        
        var subClass = lang.extend(base, {
            base_fn: function(){
                return 'sub_fn'
            },
            attr1: 'sub_attr',
        });
        
        var subObj = new subClass();
        var baseObj = new base();
        
        assertEqual(baseObj.attr1, 'base_attr')
        assertEqual(baseObj.base_fn(), 'base_fn')
              
        assertEqual(subObj.attr1, 'sub_attr')
        assertEqual(subObj.base_fn(), 'sub_fn')
    },             
}); 