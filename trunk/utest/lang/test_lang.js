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

test({
    setUp: function(){
        
    },
    test_dir_null_object: function(){
        var error = 'null or undefined object should retrue empty arrary';
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
	

