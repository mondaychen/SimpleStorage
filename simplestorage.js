/**
 * {Boolean} useWebStorageIfAvailable - optional, defaults to true.
 * When true, SimpleStorage will use the HTML5 web storage API, if available.
 * {String} type - optional, defaults to 'local'.
 * When 'session', SimpleStorage use sessionStorage instead of localStorage.
 */
define(function() {

  var hasWebStorage = false
  try {
    hasWebStorage = ('Storage' in window) && window.Storage !== null
  } catch(ex) {}

  function SimpleStorage(useWebStorageIfAvailable, type) {
    if (type !== 'session') {
      type = 'local'
    }
    // values will be stored here
    this._cache = {}

    this._wantsWebStorage = 'undefined' === typeof(useWebStorageIfAvailable)
      ? true : useWebStorageIfAvailable
    this._useWebStorage = this._wantsWebStorage && hasWebStorage

    if (hasWebStorage) {
      this._storage = window[type + 'Storage']
    }
  }


  if (hasWebStorage) {
    Storage.prototype.setObject = function(key, value) {
      this.setItem(key, JSON.stringify(value))
    }

    Storage.prototype.getObject = function(key) {
      var stored = this.getItem(key)
      try {
        stored = JSON.parse(stored)
      } catch (ex) {
        stored = null
      }
      return stored
    }
  }

  SimpleStorage.prototype = {

    /**
     * {String} k - the key
     */
    get: function(k) {
      if (this._useWebStorage) {
        var isObject = this._storage.getItem(k + '___isObject')
        var action = isObject ? 'getObject' : 'getItem'
        return this._storage[action](k) || undefined
      } else {
        return this._cache[k] || undefined
      }
    },

    /**
     * {String} k - the key
     * {Object} v - any kind of value you want to store
     */
    set: function(k, v) {
      if (this._useWebStorage) {
        if (v && typeof v !== 'string') {
          // make assumption if it's not a string, then we're storing an object
          this._storage.setObject(k, v)
          this._storage.setItem(k + '___isObject', true)
        } else {
          try {
            this._storage.setItem(k, v)
          } catch (ex) {}
        }
      } else {
        // put in our local object
        this._cache[k] = v
      }
      // return our newly cached item
      return v
    },

    /**
     * {String} k - the key
     */
    clear: function(k) {
      if (this._useWebStorage) {
        this._storage.removeItem(k)
        this._storage.removeItem(k + '___isObject')
      }
      // delete in both caches - doesn't hurt.
      delete this._cache[k]
    }
  }

  return SimpleStorage
})
