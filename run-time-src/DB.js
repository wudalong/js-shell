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
 

var exports = ['connect', 'driver' ]

var sqlLib = JavaImporter();
sqlLib.importPackage(Packages.java.sql);

/**
    load the jdbc driver.
*/
function driver(d) {
    java.lang.Class.forName(d);
}

/**
    Attempts to establish a connection to the given database URL.
*/
function connect(url, user, password) {
    var conn = sqlLib.DriverManager.getConnection(url, user, password);
    
    return new Connection(conn);
}

/**
 @class Connection
 A connection (session) with a specific database. SQL statements are executed 
 and results are returned within the context of a connection.
  
  @param conn // jdbc connection.
*/

var Connection = extend(function(conn){
	    this.o = conn;
	}, {
    autoCommit: function(f) {
        if(typeof(f) == undefined) {
            return this.o.getAutoCommit();
        }else {
            return this.o.setAutoCommit(f);
        }
    },

    select: function(sql, param){
        var w = formatSQL(sql, param);
        var pstm = this.o.prepareStatement(w.sql, 
                                           sqlLib.ResultSet.TYPE_FORWARD_ONLY,
                                           sqlLib.ResultSet.CONCUR_READ_ONLY
                                           );
        bindParameter(pstm, w.param);
        var result = pstm.executeQuery();
        
        return new ResultSet(pstm, result);
    },
    
    execute: function(sql, param){
        var w = formatSQL(sql, param);
        var pstm = this.o.prepareStatement(w.sql);
        bindParameter(pstm, w.param);
        var result = pstm.executeUpdate();
        
        return result;    
    },
    
    close: function(){
        this.o.close();
    },
    
    commit: function(){
        this.o.commit();
    },
    
    rollback: function(){
        this.o.rollback();
    },
});

/**
 @class ResultSet
  
  @param prepareStatement, ResultSet // jdbc connection.
*/
function ResultSet(pstm, rs){
    this.pstm = pstm;
    this.o = rs;
    this.dataWrapper = this._initPrototype(rs.getMetaData());
    this.dataWrapper.o = rs;
}

var ResultSet = extend(ResultSet, {
    _initPrototype: function(meta) {
        var cls = {};
        var defineGetter = function(cls, name, t, i){
            cls.__defineGetter__(name, function(){
                var dt = sqlLib.Types
                if(t == dt.VARCHAR || t == dt.CLOB){
                   return this.o.getString(i);
                }else if(t == dt.DATE){
                   return this.o.getDate(i);
                }else if(t == dt.INTEGER || t == dt.FLOAT || t == dt.DOUBLE){
                   return this.o.getFloat(i);	                   
                }
            });
        };
        
        for(var i = meta.getColumnCount(); i > 0; i--){
            var name = meta.getColumnLabel(i);
            var col_type = meta.getColumnType(i);
            defineGetter(cls, name, col_type, i);
        }
        return cls;
    },
    
    next: function(){
        if(this.o.next() === false){
            throw "StopIterator";
        }
        return this.dataWrapper;
    }, 
    
    hasNext: function(){
        return this.o.next();
    },
    
    row: function(){
        return this.dataWrapper;
    },
    
    close: function() {
        this.o.close();
        this.pstm.close();
    } 
    
});

/*
    convert the named parameters to '?', and convert the param as a Arrary.
    'select * from test_db where name = $name and age = $age'
    to:
    'select * from test_db where name = ? and age = ?'
    
    @return sql, param[]
*/
function formatSQL(sql, param) {
    var param_list = [];
    formatSql = sql.replace(/\$([a-z,A-Z]\w+)/g,
				function (s, name) {
				    if(typeof param[name] == undefined){
				       throw "Not found parameter name '" + name + "'";
				    }
				    param_list.push(param[name]);
					return "?";
				});
      
    return {sql:formatSql, param: param_list};
    
}

/*
    bind parameters to prepared statement, update 
    
    @return sql, param[]
*/
function bindParameter(pstm, params) {
    each(params, function(p, i){
        t = typeof(p);
        if(t == 'string') {
            pstm.setString(i, p);
        }else if(t == 'number'){
            if(new java.lang.Integer(p) == p){
                pstm.setFloat(i, p);
            }else {
                pstm.setInt(i, p);
            }
        }else if(t == 'object'){
            if(t.constructor == Date){
                pstm.setDate(i, p);
            }else {
                pstm.setObject(i, p);
            }
        }else {
            throw "Not supported sql data type '" + t + "'"; 
        }
    });
}
