#!/cygdrive/c/USERS/_my_work/workspace/js-shell/build/bin/js -debug

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

var file_lib = __import__('File', null, {})
var ut = __import__('UnitTest', null, {})
print('Suite Root:' + (new file_lib.File('.')).abs_path())

print('arguments:' + arguments)

//print('suite root:' + (new file_lib.File(path)).abs_path())
    
var runner = new ut.TestRunner()

var  suite = new ut.TestSuite('Simple suite', '.')

if(arguments.length > 0){
    for(var i = 0; i < arguments.length; i++){
        suite.add_case(arguments[i])
    }
}else {
    suite.add_case('test_*.js$')
}

var result = runner.run(suite)

result.summary()

//ut.run_suite('.')
