var Hexo = require('hexo');
var cwd = process.cwd();
console.log(cwd);
hexo = new Hexo(cwd, {});
hexo.init().then(() => {
	hexo.call('server', {port: 4484});
});