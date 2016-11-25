var j = location.search;

// Require configure.　
require.config({
	baseUrl : 'js'
});


// Loads js modules.
require(['jquery'], function($) {
	
});

console.log(location);


// Defines a module by a object for some configuration.
define({
	color : 'black',
	size : 'unsize',
	j : j
});





