#!/cygdrive/c/USERS/_my_work/workspace/js-shell/build/bin/js -debug

/**
 * 生成一个js文件的文档, 可以生成html,plain text, wiki格式 等. 现将一个文件转换为doc结构在
 * 输出不同的文档.
 */

var FileList = [];
var DirList = [];
var outputdir = null;
var debug = 0;
var cur_file_list = null;

JsDoc = {
    Class: function(){
        this.public_fn = [];
        this.public_field = [];
        this.comment = null
    },
    Method: function(){
        this.name = [];
        this.comments
    },
    Field: function(){},
    File: function(){
        this.global_function = [];
        this.classes = [];
        this.comment = null;
    },
    Dir: function(){}
}

/**
* 处理@tag value之类的标签.
*/
tag_handlers = {
    cls: function(doc, val, comment){
	    val = val[0]
	    if(debug) print("Found class:" + val);
	    doc.cur_class = new JsDoc.Class()
	    doc.classes[val] = doc.cur_class
	    doc.cur_class.comment = comment
    },
    
    endclass: function(doc, val, comment){
        doc.cur_class = null
    },
    
    file: function(doc, val, comment){  
        doc.comment = comment
    },    
    
    method: function(doc, val, comment){
        val = val[0]
        m = val.match(/^\s*function\s+((\w+)|(\w+)(\s+))\(([^)]*)\)/);
        if (m == null){
            print("Error method define:" + val);
            return
        }else {
            fn_name = m[2]
        }
        
        if (doc.cur_class) {
            doc.cur_class.public_fn[fn_name] = comment
        }else {
            doc.global_function[fn_name] = comment
        }
    },
    global: function(doc, val, comment){
        doc.comment = comment
    }
    
}

/**
 * Process JavaScript source file <code>f</code>, writing jsdoc to
 * file <code>out</code>.
 * @param f input file
 * @param fname name of the input file (without the path)
 * @param inputdir directory of the input file
 * @param out output file
 */
function processFile(f, fname, inputdir, out) {
	var s;
	var last_comment;
	doc = new JsDoc.File();
    doc.file = f;

    // process the input file
	while ((s = f.readLine()) != null) {
      var m = s.match(/\/\*\*(.*)/); //start comment
	  if (m != null) {
		  // Found a comment start.
	       var comment = "";
		   s = "*" + m[1];
		  do {    
			m = s.match(/(.*)\*\//);
			if (m != null) {
			  // Found end of comment.
			  comment += m[1];
			  break;
			}
			//fix bug: why don't know the 's' become a object type. 
			//it's failed call replace. to covert as js string type
			// by coin a empty string.
			s += ""
			// Strip leading whitespace and "*".			
			comment += s.replace(/^\s*\*/, "");
			comment += '\n';
			s = f.readLine();
		  } while (s != null);

    	  if (debug)
            print("Found comment " + comment);
          last_comment = processComment(comment);
          if (debug)
            print("handle tags:" + dir(last_comment.tags).join(','));
                      
          for(tag in last_comment.tags){
                h_name = (tag=='class') ? 'cls': tag;
                if(tag_handlers[h_name]){
                    last_comment = tag_handlers[h_name](doc, 
                        last_comment.tags[tag], last_comment); 
                }
          }
	  }else if(!last_comment) {
	       //continue to find a commnet 
	       continue;
	  }
	  // match the beginning of the function
	  // NB we also match functions without a comment!
	  // if we have two comments one after another only the last one will be taken
	  m = s.match(/^\s*function\s+((\w+)|(\w+)(\s+))\(([^)]*)\)/);
	  if (m != null)
	  {     
	        last_comment.method = {name:m[1], args: m[5]}
            doc.global_function[m[1]] = last_comment;
            last_comment = null
	  }
	  
      m = s.match(/^\s*(\w*)\s*:\s*function\s*\(([^)]*)\)/);
      if (m != null)
      {
            last_comment.method = {name:m[1], args: m[2]}
	        if (doc.cur_class) {
	            doc.cur_class.public_fn[m[1]] = last_comment
	        }else {
	            print("not found class for method:" + m[1])
	        }
            last_comment = null
      }
	  /*
	  //处理类方法,在之前至少因该有一个@class 标签. 
	  m = s.match(/^\s*(\w*)\.prototype\.(\w*)\s*=\s*function\s*\(([^)]*)\)/);
	  if (m != null)
	  {
	       doc.lastClass.public_fn[m[2]] = processPrototypeMethod(m[1], m[2],
	                m[3], comment);
			comment = "";
	  }
	  */
	}
	return doc
}

/**
 * Process comment.
 * @param comment the text of the comment
 * @param firstLine shows if comment is at the beginning of the file
 * @param fname name of the file (without path)
 * @return a string for the HTML text of the documentation
 */
function processComment(comment,firstLine,fname) {
	var tags = {};
	// Use the "lambda" form of regular expression replace,
	// where the replacement object is a function rather
	// than a string. The function is called with the
	// matched text and any parenthetical matches as
	// arguments, and the result of the function used as the
	// replacement text.
	// Here we use the function to build up the "tags" object,
	// which has a property for each "@" tag that is the name
	// of the tag, and whose value is an array of the
	// text following that tag.
	comment = comment.replace(/@(\w+)\s+([^\n]*)/g,
	  function (s, name, text) {
		var a = tags[name] || [];
		a.push(text);
		tags[name] = a;
		return "";
	  });
	//comment.replace(/\r/,'');
	list = comment.split("Example:\n")
    comment = list[0]
    examples = list.slice(1)
	// additional tags can be added here (i.e., "if (tags["see"])...")
	return {text:comment, tags: tags, examples: examples};
}

/**
 * Create an html output file
 * @param outputdir directory to put the file
 * @param htmlfile name of the file
*/
function CreateOutputFile(outputdir,htmlfile)
{
  if (outputdir==null)
  {
    var outname = htmlfile;
  }
  else
  {
    var separator = Packages.java.io.File.separator;
    var outname = outputdir + separator + htmlfile.substring(htmlfile.
        lastIndexOf(separator), htmlfile.length);
  }
  print("output file: " + outname);
  return new File(outname, 'w');
}

/**
 * Process a javascript file. Puts the generated HTML file in the outdir
 * @param filename name of the javascript file
 * @inputdir input directory of the file (default null)
 */
function processJSFile(filename,inputdir)
{
  if (debug) print("filename = " + filename + " inputdir = " + inputdir);

  if (!filename.match(/\.js$/)) {
	print("Expected filename to end in '.js'; had instead " +
	  filename + ". I don't treat the file.");
  } else {
    if (inputdir==null)
	{
	  var inname = filename;
    }
	else
	{
      var separator = Packages.java.io.File.separator;
      var inname = inputdir + separator + filename;
      //var inname = inputdir + filename;
    }
    print("Processing file " + inname);

	var f = new File(inname, 'r');
    var htmlfile = filename.replace(/\.js$/, ".html");
	var out = CreateOutputFile(outputdir,htmlfile);
    doc = processFile(f, filename, inputdir);
    saveAsHtml(doc, out)
	f.close()
	out.close();
  }
}

function saveAsHtml(doc, out){
    out.writeLine('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"')
    out.writeLine('"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">')
    out.writeLine('<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml">' +
                  "<head><title>" + 
                  doc.file.o + 
                  "--doc</title>" +
                  "<link rel='stylesheet' href='screen.css' media='screen'>" +
                  "<meta http-equiv='Content-Type'" +
                  " content='text/html; charset=UTF-8' />" +
                  "</head><body><div>")
    //create left index.
    outputFileIndex(doc, out)
    
    out.writeLine("<div class='content'>");
    out.writeLine("<div class='ctext'>"+ ((doc.comment) ? doc.comment.text : "") 
                  +"</div>")
    out.writeLine("<div class='g_fun'><h3>Global function</h3>")
    //fn_names = dir(doc.global_function)
    outputFunctionsAsHtml(doc.global_function, out)
    out.writeLine("</div>") //end g_fun
    
    each(dir(doc.classes).sort(), function(name){
        with(doc.classes[name]){
	        out.writeLine("<div class='cls'><h3>Class " + name + "</h3>")
	        out.writeLine("<div class='ctext'>"+comment.text +"</div>")
		    out.writeLine("<div class='pub_fn'><h3>Public method</h3>")
		    outputFunctionsAsHtml(public_fn, out)
		    out.writeLine("</div>") //end g_fun
	        out.writeLine("</div>") //cls
        }   
    });
    
    out.writeLine("</div>")
    out.writeLine("</div></body></html>")
}

function outputFileIndex(doc, out){
     out.writeLine("<div class='fn_index'>")
     if(cur_file_list){
	     out.writeLine("<h3>File list</h3>")
	     out.writeLine("<ul>")
	     each(cur_file_list.sort(), function(e){
	         if (e.match(/\.js$/)) {
	            e += '';
	            out.writeLine("<li><a href='"+ e.replace(/\.js$/, ".html") +
	                          "'>" + e + "</a>")
	         }
	     });
	     out.writeLine("</ul>")
     }
     
     out.writeLine("<h3>Global function</h3>")
     var fun_list = function(fn_list, out){
         out.writeLine("<ul>")
		 each(dir(fn_list).sort(), function(name){
		        with(fn_list[name]){
		            out.writeLine("<li><a href='#" + method.name +"'>" +
		                         method.name +
		                         "(" + method.args + ")</a></li>");
		        }
		    });
	     out.writeLine("</ul>")
     }
     
     fun_list(doc.global_function, out);
     out.writeLine("<h3>Class List</h3>")
     out.writeLine("<ul>")
     each(dir(doc.classes).sort(), function(name){
         with(doc.classes[name]){
	        out.writeLine("<li><a href='#cls_" + name +"'>" + name
	                      + "</a></li>");
	        fun_list(public_fn, out);
	     }
     });
     out.writeLine("</ul>")
     
     out.writeLine("</div>")
}

function outputFunctionsAsHtml(fn_list, out){
    
    each(dir(fn_list).sort(), function(name){
        with(fn_list[name]){
	        out.writeLine("<div class='fn'>")
	        out.writeLine("<div class='fn_sign'>")
	        out.writeLine("<span class='fn_name'>" + method.name +"</span>")
	        out.writeLine("(<span class='fn_arg'>" + method.args +"</span>)")
	        out.writeLine("&nbsp;return " + (tags['return'] || "none"))
	        out.writeLine("</div>") //end fn_sign
	        out.writeLine("<div class='ctext'>" + text +"</div>")
	        each(examples, function(e){
	            out.writeLine("<div class='example'><h4>Example:</h4>")
	            out.writeLine(e +"</div>")
	        });
	        out.writeLine("</div>")
        }
    });
}


/**
 * prints the options for JSDoc
*/
function PrintOptions()
{
  print("You can use the following options:\n");
  print("-d: specify an output directory for the generated html files\n");
  print("-i: processes all files in an input directory (you can specify several directories)\n");
  quit();
}


// Main Script
// first read the arguments
if (! arguments)
  PrintOptions();

for (var i=0; i < arguments.length; i++) {
  if (debug) print("argument: + \'" + arguments[i] + "\'");
  if (arguments[i].match(/^\-/)) {
   if (String(arguments[i])=="-d"){
    // output directory for the generated html files
    outputdir = String(arguments[i+1]);
	if (debug) print("outputdir: + \'" + outputdir + "\'");

    i++;
   }
   else if (String(arguments[i])=="-i"){
    // process all files in an input directory
    DirList.push(String(arguments[i+1]));
    if (debug) print("inputdir: + \'" + arguments[i+1] + "\'");
        i++;
   }
   else {
    print("Unknown option: " + arguments[i] + "\n");
	PrintOptions();
   }
  }
  else
  {
    // we have a single file
	if (debug) print("file: + \'" + arguments[i] + "\'");

	FileList.push(String(arguments[i]));
  }
}

// first handle the single files
for (var i in FileList)
  processJSFile(FileList[i],null);

// then handle the input directories
for (var j in DirList) {
  var inputdir = String(DirList[j]);
  print("Process input directory: " + inputdir);

  // for the directory name get rid of ../../ or ..\..\
  inputDirName = inputdir.replace(/\.\.\/|\.\.\\/g,"");

  // read the files in the directory
  var DirFile = new java.io.File(inputdir);
  var lst = DirFile.list();
  cur_file_list = lst
  var separator = Packages.java.io.File.separator;
  for (var i=0; i < lst.length; i++)
  {
    processJSFile(String(lst[i]),inputdir);
  }
}



