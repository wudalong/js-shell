
/**
  @global
*/

var exports = ['File']

/**
* @class File
  create file object.
  
  @param path
  @param mode value:r/w, default is 'r'
*/
var File = function(path, parent, mode) {

    if (typeof(parent) == 'object' && parent.constrctor === File){
        this.o = new java.io.File(parent.o, path)
    }else {
        mode = parent
    }
    
	this.o = new java.io.File(path);
	this.mode = mode || 'r';
	this.h = null;
	
}

File.prototype = {
	
	//is_file: this.o.isFile,
	//is_dir: this.o.isDirectory,
	
	/**
	*在文件中写入一行纪录.
	 
	Example:
	    The file must in write mode.
	   <pre>
	    <code>
            var f = new File('test.js', 'w')
            f.writeLine('Hello world') 
            f.close() 
	    </code>
	    </pre>
	 */
	writeLine: function(s) {
		if (this.mode != 'w') throw "the file isn't in write mode"
		if (!this.h) this.open_file()
		
		this.h.println(s)
	},

    /**
    *从文件中读入一行文本.
     
    Example:
        <pre><code>
            //必须以读方式打开一个文件, 默认为'r'模式
            var f = new File('test.js', 'r')
            var line = f.readLine()
            print(line)
            f.close() 
        </code><pre>
     * @return String
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
    },
    
    walker: function(fn){
        return this._walker_java_dir(this.o, fn)
    },
    
    isFile: function(){ return this.o.isFile(); },
    isDir: function(){ return this.o.isDirectory(); },
    
    abs_path: function(){
        return this.o.getAbsolutePath()
    },
    
    _walker_java_dir: function(dir, fn) {
        if(dir.isFile()){
            var abs_path = dir.getAbsolutePath()
            fn(dir.getName(), abs_path.replace(this.o.getAbsolutePath(), ''))
        }else {
            var jfile_list = dir.listFiles();
            for(var i = 0; i < jfile_list.length; i++){
                this._walker_java_dir(jfile_list[i], fn);
            }
        }
    } 
}
