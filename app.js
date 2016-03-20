var Hexo = require('hexo');
var cwd = process.cwd();
hexo = new Hexo(cwd, {});
hexo.init((args) => hexo.call('server'));