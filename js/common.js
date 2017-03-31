/**
 * Javascript common library.
 * @since 2016/02/03
 * @version 0.1
 */



/**
 * Defines a function if not exists.
 */
function defineFunction() {
	var args = arguments;
	var obj = this;
	if (!args.length) return;

	if (!!args[0]) {
		if (typeof args[0] != 'object' &&
				(typeof args[0] != 'string' && !!args[1] && typeof args[1] != 'function')) {
			throw new Error('Given some illegal arguments for the function!');
		}
	}

	if (typeof args[0] == 'string')
		args[0] = (function(){var ret = {}; ret[args[0]] = args[1]; return ret;})();

	for (var idx in args[0]) {
		var func = args[0][idx];
		if (!isFunction(obj, func) && !!func)
			obj[func.name || idx] = func;
	}
}


/**
 * Check a function if defined.
 * @return {boolean} If exists true, else false.
 */
function isFunction() {
	var args = arguments;
	if (!args.length) return;

	if (typeof args[0] == 'object') {
		return typeof args[1] == 'function' && typeof args[0][args[1].name] == 'function';
	}

	return typeof args[0] == 'function';
}


/**
 * Check a variable if object.
 * @param  {Object}  obj The variable will be check.
 * @return {Boolean} If object return true, else false.
 */
function isObject(obj) {
	return !!obj && typeof obj == 'object';
}


/**
 * Check a variable if real object.
 * @param  {Object}  obj The variable will be check.
 * @return {Boolean} If real object return true, else false.
 */
function isRealObject(obj) {
	return isObject(obj) && Object.prototype.toString.call(obj) == '[object Object]';
}


/**
 * Formats string to specail format. 
 */
function formatStr() {
	var regex = /\$[a-zA-Z_]\w*/g,
		regexQuotes = /([$\/{}()?*.\[\]+^])/,
		args = arguments,
		matched = [],
		str = this,
		tempArr = [],
		isKvValue = false;

	while((tempArr = regex.exec(this)) != null) {
		matched.push(tempArr[0]);
	}
	
	if (typeof args[0] == 'object' && args[0].constructor == Object) {
		var i = 0;
		for (var key in args[0]) {
			matched[i] = '$' + key;
			args[i++ + 1] = args[0][key];
		}
		args.length = i;
		isKvValue = true;
	}

	for (var i = 0; i < Math.min(matched.length, args.length); i++) {
		str = str.replace(new RegExp(matched[i].replace(regexQuotes, '\\$1'), 'g'),
					args[isKvValue ? i + 1 : i]);
	}

	return str;
}


/**
 * Check property of the special object if more than one.
 * @param {Object} obj The object will to checking.
 */
function isEmptyObj(obj) {
	for (var key in obj) {
		return false;
	}

	return true;
}


/**
 * To extending a special object by given value.
 * @param {Object} obj The object will to extending.
 * @param {Object} val The given value.
 */
function extend(obj, val) {
	if (this == window || !isObject(this)) {
		if (!isObject(this) || !isRealObject(obj))
			return;
	}else if (!isObject(obj) || !isRealObject(val)) {
		return;
	}

	if (this != window) {
		val = obj;
		obj = this;
	}
	
	for (var key in val) {
		var exVal = val[key];

		if (!!exVal || isEmptyObj(exVal) || !isRealObject(exVal)) {
			obj[key] = exVal;
		}else{
			extend(obj[key] = typeof exVal == 'array' ? [] : {}, exVal);
		}
	}
}



extend(String.prototype, {
	go : function() {
		window.URL.go(this);
	},

	endWith : function(str) {
		if (!str) return false;

		return this.lastIndexOf(str) == this.length - str.length;
	},

	inArray : function(arr) {
		if (!arr || arr.constructor != Array || arr.length == 0)
			return false;

		for (var idx in arr) {
			if (arr[idx] == this) {
				return true;
			}
		}
		return false;
	},

	toNumber : function() {
		return parseInt(this);	
	},

	contains : function() {
        if (!arguments.length) return false;

        var strs = arguments;
        for (var i = 0; i < strs.length; i++) {
            if (this.indexOf(strs[i]) == -1) {
                return false;
            }
        }
		return true;
	},
	
	format : function() {
		return formatStr.apply(this, arguments);
	}
});


extend(Array.prototype, {
	each : function(callback) {
		if (typeof callback != 'function') return;

		for (var i = 0; i < this.length; i++) {
			if (callback(i, this[i]) === false)
				break;
		}
	},

	clone : function() {
		var temp = [];
		this.each(function(idx, v) {
			temp[idx] = v;
		});

		return temp;
	},

	isEmpty : function() {
		return this.length == 0;
	},

	clean : function() {
		this.splice(0, this.length);
	},

	copyOf : function(arr) {
		if (!isObject(arr) || !arr.isArray() || arr.isEmpty())
			return;

		var $this = this;
		arr.each(function(k, v) {
			$this[k] = v;
		});
	},

	remove : function(index) {
		if (index < 0 || index >= this.length)
			return;

		if (this[index]) {
			this.splice(index, 1);
		}
	},

	removeValue : function(val) {
		if (!val) return;

		var $this = this;
		this.each(function(i, v) {
			if (v === val)
				$this.remove(i);
		});
	},

	containsArray : function(arr) {
		if (!isObject(arr) || !arr.isArray() || arr.isEmpty() || arr.length > this.length)
			return false;

		var temp = arr.clone();
		arr.each(function(k, v) {
			if (temp.containsValue(v)) {
				temp.removeValue(v);
			}
		})

		return temp.length === 0;
	},

	containsValue : function(val) {
		if (!val) return false;
		var contains = false;

		this.each(function(k, v) {
			if (v == val) {
				contains = true;
				return false;
			}
		});

		return contains;
	}
});


extend(Object.prototype, {
	isArray : function(obj) {
		obj = obj || this;
		return isObject(obj) ? obj.constructor == Array : this.constructor == Array;
	}
});


~function(W, $) {
	function URL() {
		this.init();
	}

	URL.prototype = {
		url : window.location.href,
		scheme : window.location.protocol,
		host : window.location.host,
		port : window.location.port,
		path : window.location.pathname,
		query : window.location.search.substring(1),
		hash : window.location.hash,
		constructor : URL,
		go : function(_url) {
			if (_url && _url.trim().length > 0)
				window.location.href = _url;
		},
		reload : function() {
			window.location.reload();
		},
        getParam : function(key) {
            return this[key];
        },
        setParam : function(key, value) {
            if (!key) return;

            this[key] = value;
        },
		init : function() {				
			this.parseParam();
		},
		buildURL : function() {
			return this.url = formatStr('$1//$2:$3$4$5$6',
							this.scheme, this.host, this.port || 80, this.path,
									this.query, this.hash);
		},
		parseParam : function() {
			var param = {},
				str = arguments[0] || this.query;

			if (str && str.trim().length > 0 && (str.contains('&') || str.contains('='))) {
                var temp = str.contains('&') ? str.split('&') : [str];
				for (var i = 0; i < temp.length; i++) {
					arr = temp[i].split('=');
					param[arr[0]] = !!arr[1] ? decodeURIComponent(arr[1]) : null;
				}

				this.apply(param);
			}

			return param;
		},
		apply : function(arr) {
			for (var key in arr) {
				this[key] = arr[key];
			}
		}
	};

	W.URL = new URL();

	// Exports as a jquery extends.
	$ && $.extend({ URL : W.URL });
}(window, $);