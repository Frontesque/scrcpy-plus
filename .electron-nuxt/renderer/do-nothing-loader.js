// Credits: https://github.com/axtgr/do-nothing-loader/blob/master/index.js

module.exports = function(source) {
  this.cacheable && this.cacheable();
  return source;
};
