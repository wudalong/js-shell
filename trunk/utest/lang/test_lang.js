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
        var object = function(){}
        //Is it really expected in application?
        assertEqual(lang.dir(object), ['prototype'])
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

