SimpleStorage
=============

A javascript module to make HTML5 Web Storage API (localStorage and sessionStorage) easier to use.

The module is provided in the [AMD](https://github.com/amdjs/amdjs-api/wiki/AMD) way and should work well with module kernels like [RequireJS](http://requirejs.org/) or [OzJS](http://ozjs.org/).

Insipred by [CacheProvider.js](https://gist.github.com/aroder/871234).

## Usage


	new SimpleStorage(useWebStorageIfAvailable, type)


 * {Boolean} `useWebStorageIfAvailable` - optional, defaults to `true`.
  When `true`, SimpleStorage will use the HTML5 web storage API, if available.
 * {String} `type` - optional, defaults to `'local'`.
 When `'session'`, SimpleStorage use sessionStorage instead of localStorage.

Let's say you name the module `mod/simplestorage`


	define(['mod/simplestorage']), function(SimpleStorage) {
		// use sessionStorage if possible
		var cache = new SimpleStorage(true, 'session')
		cache.set('keyName1', 'some string')
		console.log(cache.get('keyName1')) // 'some string'
		cache.set('keyName2', {foo: ['bar']})
		console.log(cache.get('keyName2').foo) // ['bar']
	}


BBStorage (backbone.storage.js)
=============

This module enhance SimpleStorage with a usefull API to store Models and Collections of [Backbone](http://backbonejs.org/).

If you create your collection like this before:


	var Library = Backbone.Collection.extend({
		model: Book,
		url: '/library'
	})
	var library = new Library([], {foo: 'bar'})
	var doSomething = function() {..}
	library.on('add', doSomething)
	library.fetch()


You can store the collection in localStorage or sessionStorage with BBStorage like this:


	define(['mod/backbone.storage']), function(BBStorage) {
		var cache = new BBStorage(true)
		var Library = Backbone.Collection.extend({
			model: Book,
			url: '/library'
		})
		var library = cache.getCollection('libraryName', Library, {foo: 'bar'})
		var doSomething = function() {..}
		library.on('add', doSomething)
		if(library.length) {
			doSomething()
		} else {
			library.fetch()
		}
	}


`library` will use the data in localStorage instead of fecthing from the server in this way. Whenever you add some model (the 'add' event) or do `fecth()` again (the 'reset' event), the cache will be updated immediately.

And there's a similar API `getModel` for models of Backbone:


	var book = cache.getModel('bookName', Book)
