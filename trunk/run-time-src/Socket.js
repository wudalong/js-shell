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
 

var exports = ['SocketServer', 'Socket']

/**
*
* @class SocketServer 
*/
var SocketServer = extend(function(port){
	    this.port = port
	            
	}, {
	   
	   accept: function(){
	   },
	   
	   bind: function(address){
	   },
	   
	   close: function(){
	   },
	   
	   get localPort(){
	   },
	   
	   get localAddress(){
       },
       
       get timeout(){
       },

       set timeout(val){
       },       
	   
	   /**
	       add socket server event listener.
	       *param:
	       -type: (values: 'accept', 'connect')
	       accept fn argument:(socketserver, socket)
	       connect fn argument:(socketserver, socket)
	   */
	   addEventListener: function(type, fn){
	   },
	   
       
       /**
            a short name of addEventListener
       */   	   
	   on: function(){
	       this.addEventListener.apply(this, arguments)
	   }
	   
       removeEventListener: function(type, fn){
       },
       
       /**
            a short name of removeEventListener
       */       
       un: function(){
           this.removeEventListener.apply(this, arguments)
       }
	})

/**
*
* @class Socket 
*/
var Socket = extend(function(addr, port){
        this.port = port
        this.blocking = true
           
    }, {
       
       bind: function(address){
       },
       
       close: function(){
       },
       
       /**
        Connect to a remote socket at address.
       */
       connect: function(addr, port){
       },
       
       get localPort(){
       },
       
       get localAddress(){
       },
       
       get port(){
       
       },
       
       get address(){
       }, 
       
       get timeout(){
       },

       set timeout(val){
       },
       
       /**
         java Socket object.
       */
       get socket() {
       },
       
       /**
         java Socket object.
       */       
       set socket() {
       },
          
       /**
           add socket server event listener.
           *param:
           -type: (values: 'read', 'write')
           accept fn argument:(socket)
           connect fn argument:(socket)
       */
       addEventListener: function(type, fn){
       },
       
       /**
            a short name of addEventListener
       */
       on: function(){
           this.addEventListener.apply(this, arguments)
       }
       
       removeEventListener: function(type, fn){
       },
       
       /**
            a short name of removeEventListener
       */
       un: function(){
           this.removeEventListener.apply(this, arguments)
       },
       
       /**
            read specail length string. if the len is 0, read all data. 
       */
       read: function(len, block) {
            
       },
       
       /**
            read a line. 
       */
       readLine: function(len, block) {
            
       },

       /**
            write data to socket. 
       */
       write: function(data) {
       },

       /**
            write a line data to socket. 
       */
       writeLine: function(data){
       },
       
       /**
            Set blocking or non-blocking mode of the socket: if flag is 0, 
            the socket is set to non-blocking, else to blocking mode. 
            Initially all sockets are in blocking mode. set to non-blocking if
            a 'read' type listener registered.
       */
       setblocking: function(block) {
        
       }   
    })
