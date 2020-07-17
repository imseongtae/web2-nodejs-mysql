const url = require('url');
const qs = require('querystring');
const sanitizeHtml = require('sanitize-html');

const db = require('./../models');
const template = require('./template');

// home 함수의 인자로 response 하나만 넘어가므로 에러가 발생했다.
const home = response => {
	db.query(`SELECT * FROM topic`, (error, topics) => {
    db.query('SELECT * FROM author', (error2, authors) => {
      const title = 'Welcome';
      const description = 'Hello Nodejs-MySQL';
      const list = template.list(topics);
      const html = template.HTML(
        title,
        list,
        template.renderAuthorsTable(authors),
        `<a href="/create">create</a>`,
      );
      response.writeHead(200);
      response.end(html);
    })
	});
};


module.exports = {
  home,
  create,
  create_process,
}