
/**
 * X-Tempalte parser for javascript.
 */

 ~function(window, $) {


var version = '0.1',
	LF = '\n',
	CRLF = '\r\n',
	BUILDIN_ORDERS = [
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


var each = function(arr, func) {
	if (arr && func) {
		var i = 0;
		for ( ; i < arr.length; i++) {
			func(i, arr[i]);
		}
	}
};


var eachProp = function(obj, func) {
	if (obj && func) {
		var key = '';
		for (key in obj) {
			if (obj.hasOwnProperty(key)) {
				func(key, obj[key]);
			}
		}
	}
};






var XTempalte = (function() {

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
		isFullStatementFound = false,
		isStatementBeginParsed = false,
		isStatementEndParsed = false,
		foundStatementBegin = 0,
		foundStatementEnd = 0,
		foundStatement = [],
		foundStatementNum = 0,
		foundOrderBeginInfos = {},
		foundOrderEndInfos = {},
		compiledOutputs = [],
		matchStatement = [],
		assignVariables = {},



	var XTempalte = function(xtplContent, data, container) {

	};


	XTempalte.prototype = {


		assignVariable : function(name, val) {
			if (name) {
				assignVariables[name] = val;
			}
		},


		hasAssignedVariable : function(name) {
			return assignVariables.hasOwnProperty(name);
		},


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


		findBuildinOrder : function(statement) {
			var index = 0;
			for (var idx in BUILDIN_ORDERSS) {
				if ((index = statement.indexOf(BUILDIN_ORDERS[idx])) != -1) {
					currentColumn += index;
					return BUILDIN_ORDERS[idx];
				}
			}
		},


		findStatementBegin : function(line) {
			var beginIndex = 0, endIndex = 0, order;
			if (!isStatementBeginOpenSymbolFound) {
				if ((beginIndex = line.indexOf(statementBeginOpenSymbol)) != -1) {
					isStatementBeginOpenSymbolFound = true;
					currentColumn = beginIndex;
					if ((order = findBuildinOrder(line.substring(beginIndex)))) {
						foundOrderBeginInfos[order] = {
							index : foundStatementBegin
						};
					}
				}
			}

			if (!isStatementBeginCloseSymbolFound) {
				if (endIndex = line.indexOf(statementBeginCloseSymbol)) {
					foundStatementBegin++;
					currentColumn = endIndex;
					parsedLine = currentLine;
					isInStatementBlock = true;
				}
			}
		},


		findStatementEnd : function(line) {
			var beginIndex = 0, endIndex = 0, order;
			if (isInStatementBlock) {
				if (!isStatementEndOpenSymbolFound) {
					if ((beginIndex = line.indexOf(statementEndOpenSymbol)) != -1) {
						parsedLine = currentLine;
						if ((order = findBuildinOrder(line.substring(beginIndex)))) {
							foundOrderBeginInfos[order] = {
								index : foundStatementEnd
							};
						}
					}
				}

				if (!isStatementEndCloseSymbolFound) {
					if ((endIndex = line.indexOf(statementBeginCloseSymbol)) != -1) {
						parsedLine = currentLine;
						isStatementEndCloseSymbolFound = true;
						foundStatementEnd++;
					}
				}
			}
		},


		findStatement : function(line) {
			this.findStatementBegin();
			this.findStatementEnd();
			this.countFoundStatement();

			if (isStatementBeginOpenSymbolFound || isInStatementBlock || !isStatementEndCloseSymbolFound) {
				foundStatement[currentLine] = line;
			}

			if (isStatementEndOpenSymbolFound && isStatementEndCloseSymbolFound) {
				if (foundStatementNum == foundStatementEnd) {
					isFullStatementFound = true;
				}
			}

			if (isFullStatementFound) {
				this.parseStatement();
			}
		},


		countFoundStatement : function() {
			eachProp(foundOrderBeginInfos, function(k, v) {
				var index = v.index, endInfo = foundOrderEndInfos[k];
				if (endInfo) {
					if (index == endInfo.index) {
						foundStatementNum++;
					}
				}
			});
		}


		parseStatement : function() {
			var _this = this;
			each(foundStatement, function(idx, line) {
				_this.parseLine(line);
			});
		},


		parseLine : function(statement) {
			if (statement) {
				var keyword = this.findBuildinOrder(statement);
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


		parseForStatement : function(statement) {
			
		},


		parseIfStatetment : function(statement) {

		},


		parseTemplate : function() {
			var line = "";
			while((line = this.readLine()) != null) {
				this.findStatement(line);

			}
		},



})();





};
















 }(window, jQuery);