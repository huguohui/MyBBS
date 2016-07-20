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
		return typeof args[1] == 'function' && args[0].hasOwnProperty(args[1]);
	}

	return typeof args[0] == 'function';
}


defineFunction.call(String.prototype, {
	go : function() {
		window.URL.go(this);
	},

	endWith : function(str) {
		if (!str) return false;

		if (this.lastIndexOf(str) == this.length - str.length)
			return true;
		else
			return false;
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
		
	}
});


defineFunction.call(Array.prototype, {
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


defineFunction.call(Object.prototype, {
	isArray : function(obj) {
		return typeof obj == 'object' ? obj.constructor == Array : this.constructor == Array;
	}
});


defineFunction({
	isObject : function(obj) {
		return typeof obj == 'object' && obj !== null;
	},
	
	formatString : function() {
		var arg = arguments,
			temp = arg[0];
		if (arg.length < 2 || typeof temp != 'string') return '';

		for (var i = 1; i < arg.length; i++) {
			console.log('$' + i + '=>' +  arg[i]);
			temp = temp.replace('$' + i, arg[i]);
		}
		
		return temp;
	}
});


define('URL', ['jquery'], function($) {
	function URL() {
		this.init();
	};

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
            if (this.hasOwnProperty(key)) {
                return this[key];
            }
            return null;
        },
        setParam : function(key, value) {
            if (!key) return;

            this[key] = value;
        },
		init : function() {				
			this.parseParam();
		},
		buildURL : function() {
			return this.url = formatString('$1//$2:$3$4$5$6', this.scheme, this.host, this.port || 80, this.path,
					this.query, this.hash);
		},
		parseParam : function() {
			var param = {},
				str = this.query;

			if (str && str.trim().length > 0 && (str.contains('&') || str.contains('='))) {
                var temp = str.contains('&') ? str.split('&') : [str];
				for (var i = 0; i < temp.length; i++) {
					arr = temp[i].split('=');
					param[arr[0]] = !!arr[1] ? decodeURIComponent(arr[1]) : '';
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

	var _URL = new URL();

	// Exports as a jquery extends.
	$ && $.extend({ URL : _URL });

	return _URL;
});