/** 
 * JSON parser for js.
 */

~function(window) {


	function JsonParser(json) {

	}


	JsonParser.prototype = {
		json : '',
		jsonBlockRegex : /\s*\{\s\S\*}\s*|\s*\[\s\S*\]\*/,
		jsonKeyRegex : /"(?:[^\"]+|\\\")*"/,
		jsonValueRegex : 

		parse : function() {
			if (!json)
				return;
			

			
		}
	};





}(window);