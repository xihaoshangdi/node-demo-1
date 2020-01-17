var http = require('http');
var fs = require('fs');
var url = require('url');
var port = process.argv[2];
const Operate = require('./DAO');
let operate = new Operate();
if (!port) {
  console.log('请指定端口号好不啦？\n node server.js 8888 这样不会吗？');
  process.exit(1);
}

var server = http.createServer(function(request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = '';
  if (pathWithQuery.indexOf('?') >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log('发请求过来啦！路径（带查询参数）为：' + pathWithQuery);
  if (path === '/home.html') {
    const cookie = request.headers['cookie'];
    //响应部分
    response.setHeader('Content-Type', 'text/html;charset=utf-8');
    let content;
    try {
      content = fs.readFileSync(`./public/home.html`).toString();
      response.statusCode = 200;
    } catch (error) {
      content = 'error';
      response.statusCode = 404;
    }
    if (cookie) {
      const cookieList = cookie.split(';');
      const user_id = cookieList.filter(item => {
        return item.search('user_id') >= 0;
      });
      const id = user_id[0].trim().replace('user_id=', '');
      const result = operate.searchUser(id);
      const username = result.name;
      content = content
        .replace('{{username}}', username)
        .replace('{{loginStatus}}', '欢迎登录');
    } else {
      content = content
        .replace('{{username}}', '未登录')
        .replace('{{loginStatus}}', '');
    }
    response.write(content);
    response.end();
    //
  } else if (path === '/SignIn' && method === 'POST') {
    //请求部分
    const buffer = [];
    request.on('data', chunk => {
      buffer.push(chunk);
    });
    request.on('end', () => {
      const Data = Buffer.concat(buffer).toString();
      const User = JSON.parse(Data);
      const user = {
        name: User.username,
        password: User.password
      };
      const result = operate.checkUser(user);
      console.log(result);
      //响应部分
      if (result) {
        response.statusCode = 200;
        response.setHeader('Set-Cookie', `user_id=${result.id};HttpOnly`);
      } else {
        response.statusCode = 400;
        response.setHeader('Content-Type', 'text/json;charset=UTF-8');
        response.write('errorCode:4001');
      }
      response.end();
    });
  } else if (path === '/SignUp' && method === 'POST') {
    //请求部分
    const buffer = [];
    request.on('data', chunk => {
      buffer.push(chunk);
    });
    request.on('end', () => {
      const Data = Buffer.concat(buffer).toString();
      const User = JSON.parse(Data);
      const user = {
        name: User.username,
        password: User.password,
        id: operate.getIndex() + 1
      };
      operate.setUser(user);
      //响应部分
      response.statusCode = 200;
      response.setHeader('Content-Type', 'text/html;charset=UTF-8');
      response.end();
    });
  } else {
    response.statusCode = 200;
    const defaultPath = path === '/' ? '/index.html' : path;
    const index = defaultPath.indexOf('.');
    const suffix = defaultPath.substr(index);
    const fileTypes = {
      '.html': 'text/html;charset=utf-8',
      '.css': 'text/css',
      '.js': 'text/javascript;charset=utf-8',
      '.png': 'image/png;charset=utf-8',
      '.jpg': 'image/jpeg;charset=utf-8',
      '.mp3': 'audio/mpeg'
    };
    response.setHeader(
      'Content-Type',
      `${fileTypes[suffix]}||text/html;charset=utf-8`
    );
    let content;
    try {
      content = fs.readFileSync(`./public${defaultPath}`);
    } catch (error) {
      content = 'error';
      response.statusCode = 404;
    }

    response.write(content);
    response.end();
  }
  /******** 代码结束，下面不要看 ************/
});

server.listen(port);
console.log(
  '监听 ' +
    port +
    ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' +
    port
);
