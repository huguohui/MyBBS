
/**
 * X-Tempalte parser for javascript.
 */

 ~function(window, $) {


var version = '0.1',



var dollarSign = '\\$',
	leftBrace = '{',
	rightBrace = '}',
	leftBracket = '[',
	rightBracket = ']',
	leftParenthese = '(',
	rightParenthese = ')',
	comma = ',',
	rgxVarName = '[a-zA-Z_]\w*',
	rgxVar = new RegExp('(?:[^\\]|^)' + dollarSign + '(' +rgxVarName + ')'),
	rgxInt = '-?\d+',
	rgxFloat = '-?\d+(?:\.\d+)?',
	rgxNumber = new RegExp('(?:' + rgxFloat + '|' + rgxInt + ')'),
	rgxString = /"([^\\"]|\\.)*"|'([^\\']|\\.)*'/,







var XTempalte = function(xtplContent, data, container) {

};


XTempalte.prototype = {


	parseSyntax : function() {

	},



};













 }(window, jQuery);