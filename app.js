var Hexo = require('hexo');
hexo = new Hexo(process.cwd(), {});
hexo.init().then(() => {
	hexo.call('server', {});
});