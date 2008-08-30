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
 
test("Lang dir" function(){
	
});
	

test({
    name: "Lang dir",
    msg: '',
    setUp: function(){
        this.msg = "enter setUp";
        info('enter setUp');
    },
    
    test_basic_requirements: function(){
        info('running test_basic_requirements');
        assertEqual(this.msg, "enter setUp")
        this.msg = 'test_basic_requirements'
    },
    
    test_setUp_called_for_every_functional: function(){
        info('test_setUp_called_for_every_functional');
        assertEqual(this.msg, "enter setUp")
        this.msg = 'test_setUp_called_for_every_functional'
    },   
    
    tearDown: function(){
        this.msg = "enter tearDown";
        info('enter tearDown');
    },
    
});
