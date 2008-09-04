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
 
 
 var socket = __import__('Socket', null, {})
 
 var client = new socket.Socket('127.0.0.1', 8000)
 
 
client.on('read', function(client){
    var echo = client.read();
    print('echo from server:' + echo)
    client.close()
    //client.write("Hello server, i'm a client!")
})
 
client.on('connect', function(client){
    print('connectted....')
    client.write("Hello server, i'm a client!")
})

client.on('closed', function(client){
    client.write("Bye!")    
})
 
client.connect()
 
 
 