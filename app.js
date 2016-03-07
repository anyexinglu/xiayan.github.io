var Hexo = require('hexo');
var cwd = process.cwd();
console.log(cwd);
hexo = new Hexo(cwd, {});
hexo.init((args) => hexo.call('server'));	// init后再启动server