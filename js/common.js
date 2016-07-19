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
	}
});


defineFunction.call(Array.prototype, {
	each : function(callback) {
		if (typeof callback != 'function') return;

		for (var i in this) {
			callback(i, this[i]);
		}
	},

	clone : function() {
		var temp = [];
		for (var idx in this) {
			temp[idx] = this[idx];
		}
		return temp;
	},

	isEmpty : function() {
		return this.length == 0;
	},

	copy : function(arr) {
		if (!isObject(arr) || !arr.isArray() || arr.isEmpty())
			return;

		for (var key in arr) {
			this[key] = arr[key];
		}
	},

	remove : function(index) {
		if (!index || index >= this.length)
			return;

		if (this[index]) {
			this.splice(index, 1);
		}
	},

	inArray : function(arr) {
		if (!arr || arr.constructor != Array || arr.length == 0
				|| arr.length < this.length)
			return false;

		var temp = this.clone();
		for (var k in arr) {
			for (var kk in this) {
				if (arr[k] == this[kk]) {
					temp.remove(k);
				}
			}
		}

		return temp.length == 0;
	}
});


defineFunction.call(Object.prototype, {
	isArray : function(obj) {
		return typeof obj == 'object' ? obj.constructor == Array : this.constructor == Array;
	}
});


defineFunction('isObject', function(obj) {
	return typeof obj == 'object' && obj !== null;
});


define(['jquery'], function($) {
	function URL() {
		this.url = window.location.href;
		this.scheme = window.location.scheme;
		this.host = window.location.host;
		this.port = window.location.port;
		this.path = window.location.path;
		this.query = window.location.search.substring(1);
		this.init();
	};

	URL.prototype = {
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
			
		},
		parseParam : function() {
			var param = '',
				str = window.location.search.substring(1);

			if (str && str.trim().length > 0 && (str.contains('&') || str.contains('='))) {
                var temp = str.contains('&') ? str.split('&') : [str];
				var arr = [];
				for (var i = 0; i < temp.length; i++) {
					arr = temp[i].split('=');
					param[arr[0]] = !!arr[1] ? decodeURIComponent(arr[1]) : '';
				}

				!!param && this.apply(param);
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