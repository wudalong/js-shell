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

var exports = ['initConfig', 'getLogger', 'trace', 
               'debug', 'info', 'warn', 'error']

var javaLoggerAdapter = extend(function(){
        var javalogLib = this.logLib = JavaImporter();
        javalogLib.importPackage(Packages.java.util.logging);
        this.logManager = javalogLib.LogManager.getLogManager()
        this.rootLogger = this.logManager.getLogger('')
        
        this.Logger = extend(function(){
                this.level = javalogLib.Level
            },{
	        set logger(l) {
	            this.log = l
	        },            
	        trace: function(msg){
	            this.log.log(this.level.FINEST, msg)
	        }, 
	        debug: function(msg){
	            this.log.log(this.level.FINER, msg)
	        },
	        info: function(msg){
	            this.log.log(this.level.INFO, msg)
	        },
	        warn: function(msg){
	            this.log.log(this.level.WARNING, msg)
	        },
	        error: function(msg){
	            this.log.log(this.level.SEVERE, msg)
	        },         
        })
    }, {
        initConfig: function(cfg){
            
        },
        getLogger: function(name){
            var l = this.rootLogger.getLogger(name)
            
            print("getLogger:" + l)
            var log = new this.Logger()
            log.logger = l
            return log;
        },
    });

//var logManager = logLib.LogManager.getLogManager()
//var rootLogger = logManager.getLogger('');
var logManager = new javaLoggerAdapter()
var rootLogger;

/**
    init log configuration.
*/
function initConfig(cfg){
    logManager.initConfig(cfg)
    
    rootLogger = logManager.getLogger('')
}

/**
    get logger
*/
function getLogger(name){
    return logManager.getLogger(name)
}

/**
    output trace message on rootLoger
*/
function trace(msg){
    rootLogger.trace(msg)
}

/**
    output debug message on rootLoger
*/
function debug(msg){
    rootLogger.debug(msg)
}

/**
    output info message on rootLoger
*/
function info(msg){
    rootLogger.info(msg)
}

/**
    output warn message on rootLoger
*/
function warn(msg){
    rootLogger.warn(msg)
}

/**
    output error message on rootLoger
*/
function error(msg){
    rootLogger.error(msg)
}

