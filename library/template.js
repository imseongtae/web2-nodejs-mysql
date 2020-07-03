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
	list: function (filelist) {
		let list = '<ul>';
		let i = 0;
		while (i < filelist.length) {
			list += `<li><a href="/?id=${filelist[i]}">${filelist}</a></li>`;
			i = i + 1;
		}
		list += '</ul>';
		return list;
	},
};