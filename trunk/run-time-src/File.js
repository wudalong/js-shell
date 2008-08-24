
/**
* @class File
  文件操作类, 封装了java.io.File. 方法的一些简单的操作。
*/
var File = function(path, mode) {
	this.o = new java.io.File(path);
	this.mode = mode || 'r';
	this.h = null;	
}

/**
* Ext core utilities and functions. Ext core utilities and functions.
* Ext core utilities and functions.
  @global
*/

File.prototype = {
	
	//is_file: this.o.isFile,
	//is_dir: this.o.isDirectory,
	
	/**
	*在文件中写入一行纪录.
	 
	Example:
	   <pre>
	    <code>
	        必须以写方式打开一个文件
            var f = new File('test.js', 'w')
            f.writeLine('Hello world') 
            f.close() 
	    </code>
	    </pre>
	 * @param {Object} 写入文件的内容，非String对象转换为String后写入.
	 */
	writeLine: function(s) {
		if (this.mode != 'w') throw "the file isn't in write mode"
		if (!this.h) this.open_file()
		
		this.h.println(s)
	},

    /**
    *从文件中读入一行文本.
     
    Example:
        <code>
            //必须以读方式打开一个文件, 默认为'r'模式
            var f = new File('test.js', 'r')
            var line = f.readLine()
            print(line) 
            f.close() 
        </code>
     * @param {Object} 写入文件的内容，非String对象转换为String后写入.
     */
    readLine: function() {
        if (this.mode != 'r') throw "the file isn't in read mode"
        if (!this.h) this.open_file()
        
        return this.h.readLine()
    },
	
	/*
	@private
	*/
	open_file: function() {
		if(this.mode == 'w'){
			this.h = new java.io.PrintWriter(this.o)
		}else if(this.mode == 'r'){
			this.h = new java.io.BufferedReader(new java.io.FileReader(this.o))
		}
	},
	
	/**
      关闭已打开的文件.
    */
    close: function(){
        if(this.h) {
            if(this.mode == 'w')this.h.flush()
            this.h.close
        }
    }
}
