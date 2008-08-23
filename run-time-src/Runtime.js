

function runtime(){
	return 'js-shell 0.1'
}

/**
 * prints the options for JSDoc
*/
function each(o, fn){
	for(var i=0; i<o.length; i++){
		fn(o[i])
	}
}