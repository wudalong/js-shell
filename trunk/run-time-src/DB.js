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

var logger = __import__('Logging', null, {})

logger.initConfig();
logger = logger.getLogger("db");

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
	    this.debug = false;
	}, {
	
	/**
	 get or set connection auto commit;
	 
	 @return boolean
	*/
    autoCommit: function(f) {
        if(typeof(f) == undefined) {
            return this.o.getAutoCommit();
        }else {
            return this.o.setAutoCommit(f);
        }
    },

    /**
        execute a query SQL, the named parameter is supported. 
        
    Example:
       <pre>
        <code>
	db.driver('org.sqlite.JDBC');
	var conn = db.connect("jdbc:sqlite:test.db");
	var rs = conn.select("select * from person where age > $age",
	                     {age:20}
	                     );
	var row = rs.row();
	print("row:" + dir(row)); //
	each(rs, function(r) {
	    print(r.name + "," + r.age);
	});
	rs.close();
	conn.close();
        </code>
        </pre>        
        
        @return ResultSet
    */
    select: function(sql, param){
        this.debug && logger.debug("select sql:" + sql);
        
        var w = formatSQL(sql, param);
        var pstm = this.o.prepareStatement(w.sql, 
                                           sqlLib.ResultSet.TYPE_FORWARD_ONLY,
                                           sqlLib.ResultSet.CONCUR_READ_ONLY
                                           );
        bindParameter(pstm, w.param);
        var result = pstm.executeQuery();
        
        return new ResultSet(pstm, result);
    },
    
   /**
        same with select function, it return an array of result, 
        but not a ResultSet object.            
        
        @return Array
    */    
    select_list: function(sql, param){
        var rs = this.select(sql, param);
        
        try{
            var result = rs.fetch_rows();
            rs.close();
        }catch(e) {
            rs.close();
            throw e;
        }
        
        
        return result;
    },    
	
    /**
     insert a list or row to database;
     
     * @param:table table name
     * @param:data a object or list
     * @param:fileds list of filed name. default is attribute list of inserting object.
     
    Example:
       <pre>
        <code>
    //insert one record
    conn.insert('user', {name:'testuser', age:20}, ['name', 'age']);
    
    //insert one record, all atrriubite of object is saved.
    conn.insert('user', {name:'testuser', age:20});
    
    //insert a list.
    conn.insert('user', [{name:'testuser', age:20}, 
                        {name:'testuser2', age:22}]);
        </code>
        </pre>       
     @return list
    */
    insert: function(table, data, fileds){
        if(!isArray(data)) {
            data = [data, ]
        }
        if(len(data) <= 0) return 0;
        
        //init insert fileds.
        if(!(isArray(fileds) && len(fileds) > 0)){
            var fileds = [];
            each(data[0], function(e, k){fileds.push(k);});
        }
        
        fileds_var = map("'$'+$", fileds);
        
		sql = "insert into " + table + "(" + fileds.join(',') + ")" +
		      "values(" + fileds_var.join(',') + ")";
		      
		this.debug && logger.debug("insert sql:" + sql);
 		
        var w = formatSQL(sql, data[0]);   
        this.debug && logger.debug("formated sql:" + w.sql);
                     
        var pstm = this.o.prepareStatement(w.sql);
        each(data, function(row, i) {
            try{
	            var w = formatSQL(sql, row);
	            bindParameter(pstm, w.param);
	            pstm.addBatch();
	        }catch(e){
	           throw "error row:" + i + ", msg:" + e;
	        }
        });
        
        var result = pstm.executeBatch();
        pstm.close();
        
        this.debug && logger.debug("return:" + result.join(","));
        return result;
    },	
    
    /**
        execute a update sql, the named parameter is supported. 
    */    
    execute: function(sql, param){
        this.debug && logger.debug("execute sql:" + sql);
    
        var w = formatSQL(sql, param);
        var pstm = this.o.prepareStatement(w.sql);
        bindParameter(pstm, w.param);
        var result = pstm.executeUpdate();
        
        this.debug && logger.debug("return:" + result);        
        return result;    
    },
    
    /**
        close
    */     
    close: function(){
        this.o.close();
    },
    
    /**
        commit
    */     
    commit: function(){
        this.o.commit();
    },
    
    /**
        rollback
    */     
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
                }else {
                   return this.o.getString(i);
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
    
    /**
        next
    */     
    next: function(){
        if(this.o.next() === false){
            throw "StopIterator";
        }
        return this.dataWrapper;
    }, 
    
    
    /**
        hasNext
    */     
    hasNext: function(){
        return this.o.next();
    },
    
    /**
        row, return a object of current row.
    */     
    row: function(){
        return this.dataWrapper;
    },
    
    /**
        fetch all rows data.
        
        @return array. 
    */
    fetch_rows: function() {
        var rows = [];
		each(this, function(row) {
		    var co_row = {}
		    each(row, function(value, field){
		      if(field === 'o') return;
		      co_row[field] = value;
		    });
		    
		    rows.push(co_row);
		});
		
		return rows;       
    },
    
    /**
        close
    */     
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
    formatSql = sql.replace(/\$([a-z,A-Z][\w_]+)/g,
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
        i++;
        t = typeof(p);
        if(t === 'string') {
            pstm.setString(i, p);
        }else if(t === 'number'){
            if(new java.lang.Integer(p) == p){
                pstm.setFloat(i, p);
            }else {
                pstm.setInt(i, p);
            }
        }else if(t === 'object'){
            if(t.constructor == Date){
                pstm.setDate(i, p);
            }else {
                pstm.setObject(i, p);
            }
        }else {
            throw "Not supported sql data type '" + t + "', data '" + p + "'"; 
        }
    });
}
