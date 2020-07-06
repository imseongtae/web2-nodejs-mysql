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
	selectAuthor(authors, author_id) {
		let tag = '';
		// let selected = ''; // for문 밖에 있다고 selected가 안됨. 이유를 모르겠음
		// 모든 항목에 selected="" 가 붙음
		for (let i = 0; i < authors.length; i++) {
			let selected = '';
			if (authors[i].id === author_id) {
				selected = ' selected';
			}
			tag += `<option value="${authors[i].id}" ${selected}>${authors[i].name}</option>`;
		}
		return `
      <select name="author">${tag}</select>
    `;
	},
};
