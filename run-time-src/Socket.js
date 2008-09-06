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


/**
    @class BaseSocket 
*/
var Basesocket = {

       get localPort(){
            return this.socket.getLocalPort() || this.bindPort;
       },
       
       get localAddress(){
            var address = this.socket.getLocalSocketAddress()
            
            return (address) ? address.getHostName() : this.bindHost;
       },
       
       get timeout(){
            return this.socket.getSoTimeout();
       },

       set timeout(val){
            return this.socket.setSoTimeout(val)
       },
       
       /**
         java Socket object.
       */
       get socket() {
            if(this.ch){
                return this.ch.socket()
            }
       },
       
       /**
         java Socket Channel.
       */       
       set channel(val) {
            this.ch = val
       },       

       /*
            internal use only, use 'listen' instead of for user.
            bind the socket on a address/port
       */
       bind: function(address, port){
            address = address || this.bindHost || '127.0.0.1'
            port = port || this.bindPort || 0
            this.socket.bind(new socketLib.InetSocketAddress(address, port))
            
            this.dispatchEvent('listen', this)
            
            //print('bind to: ' + address + ', port' + port) 
       },
       
       /**
            close current socket. return false if the socket closed before, otherwise
            return true;
            
            @return boolean
       */       
       close: function(){
            if(this.closed) return false;
                            
            this.closed = true;
            
            if(this.clients){ //current socket is a server.
                var server = this;        
	            each(this.clients, function(e){ //clear all client.
	                e.close();
	                server.dispatchEvent('clientClosed', e) 
	            });
            }
            
            if(this.ch && this.ch.isOpen()){
	            this.ch.close();
	            //this.ch = undefined;
            }
            
            if(this.selector && this.selector.isOpen()){
	            this.selector.close();
	            this.selector.wakeup();
	            this.selector = undefined;
            }
            //
            this.dispatchEvent('closed', this);
            //print('socket closed....')
            
            return true
       },
              
       /**
           add socket server event listener.
           *param:
           -type: (values: 'listen', 'accept', 'closed')
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
       
       /**
           remove event listener.
       */       
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
        this.clients = {}
        
    },Basesocket)


SocketServer = SocketServer.extend({
        
       /*
            internal use only.
       */	
	   accept: function(){
	        var socket = new Socket()
            socket.channel = this.ch.accept()
	   
	        return socket;
	   },
	   
	   /**
	       listen a port, add this function will blocked until the server stop.
	       fire a 'accept' event when a client is connected. and all of read 
	       event is registered on the server selector. that means is the server
	       only a single thread to serve for all client. 
	       
	       Example:
	       <pre><code>
	 var server = new socket.SocketServer()  //create a server
	   
	 server.on('accept', function(client){  //add event on new client connected.
	    client.on('read', function(s) {     //add event on client readable.
	        var input = s.read();      // read data from client
	        s.write(input)             //write to client
	    });
	 })	       
	server.listen('127.0.0.1', 8000) //listen 8000 port.       
	   </code></pre>
	   */
	   listen: function(address, port){
	       this.bind(address, port)
	       
            var selector = this.selector = socketLib.Selector.open();
            this.ch.register(selector, socketLib.SelectionKey.OP_ACCEPT);
		    
		    //print('select...') 
		    this.closed = false
		    while(!this.closed && selector.select() > 0){
		        // Someone is ready for I/O, get the ready keys
		        var readyKeys = selector.selectedKeys();
		        
		        // Walk through the ready keys collection and process date requests.
		        for(var i = readyKeys.iterator(); 
		            !this.closed && i.hasNext(); i.remove()){
			        var sk = i.next();
			        
			        // The key indexes into the selector so you
			        // can retrieve the socket that's ready for I/O
			        if (sk.isAcceptable()) {
				        nextReady = sk.channel();
				        // Accept the date request and send back the date string
				        sc = nextReady.accept()
				        var socket = new Socket()
				        socket.channel = sc
				        
				        this.clients[socket.localPort] = socket
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
                            socket.close();
                            this.dispatchEvent('clientClosed', socket)    
                            //print('closed...')
                            delete this.clients[socket.localPort]
                            sk.cancel()
                        }
                        
			        }
		        } // while (i.hasNext())
		   }
		   
		   this.close();   //shut down server socket.
		   
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
            
            return (address) ? address.getHostName() : undefined;
       }, 
       
       /**
        Connect to a remote socket at address. add this function will blocked 
        until the socket is closed, fire a 'read' event when data is received.
           
           Example:
           <pre><code>
     var client = new socket.Socket()  //create a client socket.
       
    client.on('read', function(s) {     //add event on data is received.
        var input = s.read();      // read data 
        s.write(input)             //write data to remote
    });
    client.connect('127.0.0.1', 8000) //connect to server on 8000 port.       
       </code></pre>        
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
                //print('register read ...')
                this.ch.register(selector, 
                            socketLib.SelectionKey.OP_READ,
                            this)
                
            }            
            
            this.ch.connect(connect_addr)
            //print('connect....:' + this.ch.finishConnect())
            if(this.ch.finishConnect()){
                this.dispatchEvent('connect')
            }
            
            //var keysAdded;
            this.closed = false;
            while(!this.closed && selector.select() > 0) {
                var readyKeys = selector.selectedKeys();
                
                for(var i = readyKeys.iterator(); 
                    !this.closed && i.hasNext(); i.remove()){
	                var sk = i.next();

	                if (sk.isConnectable()) {
	                    //print('connect...')
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
                            socket.close()
                            sk.cancel()
                        }
	                }
	            } //while (i.hasNext()) 
            }
            
            this.close()
            //print('.............')      
       },       
       
       /**
            read data from socket, when read event is fired. the function always
            return a string object. 
            
            @return string
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
            if(!this.closed){
                try{
		            buffer = this.charset.encode(data)
		            this.ch.write(buffer)
	            }catch(e){
	               throw "IO Error, the channel write error!"
	            }
            }else {
                throw "Write Error, the socket is closed!"
            }
       },
       
       readBuffer: function(){
            this.buffer.clear();     
            //this.buffer.flip(); 
            try{      
	            var len = this.ch.read(this.buffer);
	            //print('read buffer:' + len)
	            if (len < 0) {
	                this.ch.close()
	            }
                this.buffer.flip();
            }catch(e){
                this.ch.close()
            }
            //print('read len:' + len)
       },
       
       dispatchEvent: function(type){
           print('event:' + type)
           var socket = this;
           each(this.events[type], function(e){
                e(socket)
           });
       }
    })  //end Socket.extend
