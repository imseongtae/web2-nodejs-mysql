module.exports = {
	HTML: function (title, list, body, control) {
		return `
      <!doctype html>
      <html>
        <head>
          <title>WEB1 - ${title}</title>
          <meta charset="utf-8">
        </head>
        <body>
          <h1><a href="/">WEB</a></h1>
          ${list}
          ${control}
          ${body}
        </body>
      </html>
    `;
	},
	list: function (topics) {
		let list = '<ul>';
		let i = 0;
		while (i < topics.length) {
			list += `<li><a href="/?id=${topics[i].id}">${topics[i].title}</a></li>`;
			i = i + 1;
		}
		list += '</ul>';
		return list;
	},
	selectAuthor(authors) {
		let tag = '';
		for (let i = 0; i < authors.length; i++) {
			tag += `<option value="${authors[i].id}">${authors[i].name}</option>`;
		}
		return `
      <select name="author">${tag}</select>
    `;
	},
};
