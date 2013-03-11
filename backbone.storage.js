define([
  'underscore',
  'backbone',
  'mod/simplestorage'
], function(_, Backbone, SimpleStorage) {
  var tuples = [
    ['Collection', [], 'add reset'],
    ['Model', {}, 'change']
  ]
  _.each(tuples, function(tuple) {
    var name = tuple[0]
    var defaultObj = tuple[1]
    var events = tuple[2]
    SimpleStorage.prototype['get' + name] = function(key, Constructor, options) {
      if (!this._useWebStorage) {
        return this.get(key) || this.set(key, new Constructor(defaultObj, options))
      }
      var cached = this.get(key) || defaultObj
      var result = this.set(key, new Constructor(cached, options))
      return result.on(events, function() {
        this.set(key, result)
      }, this)
    }
  })

  return SimpleStorage
})
