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

var socketLib = JavaImporter();
socketLib.importPackage(Packages.java.net);
socketLib.importPackage(Packages.java.nio);
socketLib.importPackage(Packages.java.nio.channels);
socketLib.importPackage(Packages.java.nio.charset);


var Basesocket = {

       get localPort(){
            return this.socket.getLocalPort()
       },
       
       get localAddress(){
            var address = this.socket.getLocalSocketAddress()
            
            return (address) ? address.getHostName() : undefined
       },
       
       get timeout(){
            return this.socket.getSoTimeout()
       },

       set timeout(val){
            return this.socket.setSoTimeout(val)
       },
       
       /**
         java Socket object.
       */
       get socket() {
            return this.ch.socket()
       },
       
       /**
         java Socket Channel.
       */       
       set channel(val) {
            this.ch = val
       },       

       bind: function(address, port){
            address = address || this.bindHost || '127.0.0.1'
            port = port || this.bindPort || 0
            this.socket.bind(new socketLib.InetSocketAddress(address, port))
            
            this.dispatchEvent('bind', this)
            
            //print('bind to: ' + address + ', port' + port) 
       },
       
       close: function(){
            this.closed = true;
            
            this.ch.close()
            this.selector.close()
            this.selector.wakeup()
            
            print('socket closed....')
       },
              
       /**
           add socket server event listener.
           *param:
           -type: (values: 'accept', 'connect')
           accept fn argument:(socketserver, socket)
           connect fn argument:(socketserver, socket)
       */
       addEventListener: function(type, fn, scope){
           if(! this.events[type]) {
               this.events[type] = []
           } 
           if (scope) {
                this.events[type].push(function(){
                    fn.apply(scope, arguments)
                })
           }else {
                this.events[type].push(fn)
           }
       },
       
       
       /**
            a short name of addEventListener
       */          
       on: function(){
           this.addEventListener.apply(this, arguments)
       },
       
       removeEventListener: function(type, fn){
            if(this.events[type]){
                this.events[type].filter(function(e){
                    return e != fn
                })
            }
       },
       
       /**
            a short name of removeEventListener
       */       
       un: function(){
           this.removeEventListener.apply(this, arguments)
       },
       
       getListenerbyType: function(type) {
           return this.events[type]
       },       
}

/**
*
* @class SocketServer 
*/

var SocketServer = extend(function(host, port){       
        this.bindHost = host;
        this.bindPort = port;
        
        //this.port = port
        this.ch = socketLib.ServerSocketChannel.open();

        this.ch.configureBlocking(false);
　　      //InetSocketAddress address = new InetSocketAddress(InetAddress.getLocalHost(),9000);
　　      //ssc.socket().bind(address);
        this.events = {}
        
    },Basesocket)


SocketServer = SocketServer.extend({
	
	   accept: function(){
	        var socket = new Socket()
            socket.channel = this.ch.accept()
	   
	        return socket;
	   },
	   
	   listen: function(address, port){
	       this.bind(address, port)
	       
            var selector = this.selector = socketLib.Selector.open();
            this.ch.register(selector, socketLib.SelectionKey.OP_ACCEPT);
		    
		    //print('select...') 
		    for(var keysAdded = selector.select(); keysAdded > 0;
		        keysAdded = selector.select()
		      ) {
		        // Someone is ready for I/O, get the ready keys
		        var readyKeys = selector.selectedKeys();
		        var i = readyKeys.iterator();
		        // Walk through the ready keys collection and process date requests.
		        while (i.hasNext()) {
			        var sk = i.next();
			        i.remove();
			        // The key indexes into the selector so you
			        // can retrieve the socket that's ready for I/O
			        if (sk.isAcceptable()) {
				        nextReady = sk.channel();
				        // Accept the date request and send back the date string
				        sc = nextReady.accept()
				        var socket = new Socket()
				        socket.channel = sc
				        
				        //print('accept...')
	                    this.dispatchEvent('accept', socket)
	                    if(socket.getListenerbyType('read')) {
	                        sc.configureBlocking(false);
	                        sc.register(selector, 
	                                    socketLib.SelectionKey.OP_READ,
	                                    socket)
	                        
	                    }                  
			        }else if(sk.isReadable()) {
                        var socket = sk.attachment()
                        socket.readBuffer()
                        if(socket.ch.isOpen()){
                            //print('read...on server side:' + socket.socket.isClosed())
                            socket.dispatchEvent('read')
                        }else {
                            //print('closed...')
                            socket.dispatchEvent('closed')
                            sk.cancel()
                        }
			        }
		        } // while (i.hasNext())
		   }
	   },
	   
       dispatchEvent: function(type, arg){
           each(this.events[type], function(e){
                e(arg)
           });
       }
	}) //end SocketServer.extend
	

/**
*
* @class Socket 
*/
var Socket = extend(function(addr, port){
        this.bindHost = addr;
        this.bindPort = port;
                
        this.events = {}                
        this.buffer = socketLib.ByteBuffer.allocate(1024 * 4)
        this.charset = socketLib.Charset.defaultCharset()
        
    }, Basesocket)	

Socket = Socket.extend({
       get port(){
            return this.socket.getPort();
       },
       
       get address(){
            var address = this.socket.getInetAddress()
            
            return (address) ? address.getHostName() : undefined       
       }, 
       
       /**
        Connect to a remote socket at address.
       */
       connect: function(address, port){           
            address = address || this.bindHost || '127.0.0.1';
            port = port || this.bindPort;
            
            var connect_addr = new socketLib.InetSocketAddress(address, port)
            
            this.channel = socketLib.SocketChannel.open()
                    
            this.ch.configureBlocking(false);
            
            var selector = this.selector = socketLib.Selector.open();
            this.ch.register(selector, socketLib.SelectionKey.OP_CONNECT);
            if(this.getListenerbyType('read')) {
                //sc.configureBlocking(false);
                print('register read ...')
                this.ch.register(selector, 
                            socketLib.SelectionKey.OP_READ,
                            this)
                
            }            
            
            this.ch.connect(connect_addr)
            print('connect....:' + this.ch.finishConnect())
            if(this.ch.finishConnect()){
                this.dispatchEvent('connect')
            }
            
            this.closed = false;
            //var keysAdded;
            while(!this.closed && selector.select() > 0) {
                //if(!selector.isOpen()) break;
               // Someone is ready for I/O, get the ready keys
                var readyKeys = selector.selectedKeys();
                var i = readyKeys.iterator();
                // Walk through the ready keys collection and process date requests.
                while (!this.closed && i.hasNext()) {
	                var sk = i.next();
	                i.remove();
	                // The key indexes into the selector so you
	                // can retrieve the socket that's ready for I/O
	                if (sk.isConnectable()) {
	                    print('connect...')
                        if(this.ch.finishConnect()){                    
		                    this.dispatchEvent('connect')
		                }
	                }else if(sk.isReadable()) {
                        var socket = sk.attachment()
                        socket.readBuffer()
                        if(socket.ch.isOpen()){
                            //print('read...on client side:' + socket.socket.isClosed())
                            socket.dispatchEvent('read')
                        }else {
                            //print('closed...')
                            socket.dispatchEvent('closed')
                            sk.cancel()
                        }
	                }
	            } //while (i.hasNext()) 
            }
            
            if(this.ch.isOpen()){
                this.ch.close()
            }
            if(this.selector.isOpen()){
                this.selector.close()
            }
            print('.............')      
       },       
       
       /**
            read specail length string. if the len is 0, read all data. 
       */
       read: function() {
            var data = this.charset.decode(this.buffer).toString()
            //var len = this.buffer.array().length
            //print('read data:' + data)
            //print('read len:' + this.buffer.get())
            //
            return data
       },

       /**
            write data to socket. 
       */
       write: function(data) {
            //data += ''
            buffer = this.charset.encode(data)
            this.ch.write(buffer)
            
       },
       
       readBuffer: function(){
            this.buffer.clear();     
            //this.buffer.flip();       
            var len = this.ch.read(this.buffer);
            this.buffer.flip();
            if (len < 0) {
                this.ch.close()
            }
            //print('read len:' + len)
       },
       
       dispatchEvent: function(type){
           var socket = this;
           each(this.events[type], function(e){
                e(socket)
           });
       }       
    })  //end Socket.extend
