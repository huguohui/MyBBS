
/**
 * X-Tempalte parser for javascript.
 */

 ~function(window, $) {


var version = '0.1',
	LF = '\n',
	CRLF = '\r\n',
	BUILDIN_KEYWORDS = [
		'for', 'if', 'else', 'while', 'do', 'set'
	];


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
	rgxForStatement = new RegExp(rgxVarName + ',(?:' + rgxVarName + ')?\s*in\s*' + '('rgxVarName',
	statementBeginOpenSymbol = '<@',
	statementBeginCloseSymbol = '>',
	statementEndOpenSymbol = '</@',
	statementEndCloseSymbol = '>'







var XTempalte = function(xtplContent, data, container) {

	var tpl = '<div>\
				<@for a,x : [1,2]#1>\
					<p>$a</p>\
				</@for>\
				';

	var templateInLines = [],
		currentLine = 0,
		parsedLine = 0,
		executedLine = 0,
		currentColumn = 0,
		currentStatement = '',
		isInStatementBlock = false,
		isStatementBeginOpenSymbolFound = false,
		isStatementBeginCloseSymbolFound = false,
		isStatementEndOpenSymbolFound = false,
		isStatementEndCloseSymbolFound = false,
		isStatementBeginParsed = false,
		isStatementEndParsed = false,
		foundStatementBegin = 0,
		foundStatementEnd = 0,
		foundStatement = [],
		foundStatementNum = 0,
		compiledOutputs = [],
		matchStatement = [],
		assignVariables = {},



	XTempalte.prototype = {


		splitTemplate : function() {
			var lineBreak = LF;
			if (tpl.indexOf(CRLF) != -1) {
				lineBreak = CRLF;
			} 
			templateInLines = tpl.split(lineBreak);
		},


		readLine : function() {
			return currentLine != templateInLines ? templateInLines[currentLine++] : null;
		},


		findStatementBegin : function(line) {
			var beginIndex = 0, endIndex = 0;
			if (!isStatementBeginOpenSymbolFound) {
				if ((beginIndex = line.indexOf(statementBeginOpenSymbol)) != -1) {
					isStatementBeginOpenSymbolFound = true;
					currentColumn = beginIndex;
					foundStatementBegin++;
					foundStatementNum++;
					parsedLine = currentLine;
				}
			}

			if (!isStatementBeginCloseSymbolFound) {
				if (endIndex = line.indexOf(statementBeginCloseSymbol)) {
					currentColumn = endIndex;
					parsedLine = currentLine;
					foundStatement[foundStatementNum] += line.substring(beginIndex, endIndex);
					isInStatementBlock = true;
				}
			}

			if (isStatementBeginOpenSymbolFound || isStatementEndCloseSymbolFound) {
				
			}
		},


		findStatementEnd : function(line) {
			var beginIndex = 0, endIndex = 0;
			if (isInStatementBlock) {
				if (!isStatementEndOpenSymbolFound) {
					if ((beginIndex = line.indexOf(statementEndOpenSymbol)) != -1) {
						foundStatementEnd++;
						foundStatementNum++;
						parsedLine = currentLine;
					}
				}

				if (!isStatementEndCloseSymbolFound) {
					if ((endIndex = line.indexOf(statementBeginCloseSymbol)) != -1) {
						parsedLine = currentLine;

					}
				}
			}

		},


		findStatement : function(line) {
			findStatementBegin();
			findStatementEnd();
		},


		parseStatement : function(statement) {
			if (statement) {
				var keyword = this.parseBuildinKeyword(statement);
				if (!keyword) {
					throw new Error('Invalid syntax in statement: ' + statement);
				}
				switch(keyword) {
					case 'for':
						this.parseForStatement(statement);
						break;
					case 'if':
						this.parseIfStatetment(statement);
						break;
				}
			}
		},


		parseBuildinKeyword : function(statement) {
			var index = 0;
			for (var idx in BUILDIN_KEYWORDS) {
				if ((index = statement.indexOf(BUILDIN_KEYWORDS[idx])) != -1) {
					currentColumn += index;
					return BUILDIN_KEYWORDS[idx];
				}
			}
		},


		parseForStatement : function(statement) {

		},


		parseIfStatetment : function(statement) {

		},


		parseSyntax : function() {
			var line = "";
			while((line = this.readLine()) != null) {
				this.findStatement(line);

			}
		},



	};





};
















 }(window, jQuery);