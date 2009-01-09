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
var dbLib = __import__('DB', ['formatSQL','bindParameter'], {})

// Lang.dir functional
test({
    test_format_1_named_parameters: function(){
        var sql = dbLib.formatSQL("select * from t where name=$name",
                                   {name:'t1'})
        assertEqual(sql.sql, "select * from t where name=?")
        assertEqual(sql.param, ['t1'])
    },
    
    test_format_2_named_parameters: function(){
        var sql = dbLib.formatSQL("where name=$name and age=$age",
                                   {name:'t1', age:1})
        assertEqual(sql.sql, "where name=? and age=?")
        assertEqual(sql.param, ['t1', 1])
    },

    test_format_3_named_parameters: function(){
        var sql = dbLib.formatSQL("where name=$name and name2=$name and age=$age",
                                   {name:'t1', age:1})
        assertEqual(sql.sql, "where name=? and name2=? and age=?")
        assertEqual(sql.param, ['t1', 't1', 1])
    },
    
});
	
