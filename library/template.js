module.exports = {
	HTML: function (title, list, body, control) {
		return `
      <!doctype html>
      <html>
        <head>
          <title>WEB2 - ${title}</title>
					<meta charset="utf-8">
					<style>a {text-decoration: none;}</style>
        </head>
        <body>
					<h1><a href="/">WEB</a></h1>
					<a href="/author">author</a>
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
	renderAuthorsTable(authors) {
		let table_data = '';
		authors.forEach(author => {
			table_data += `
				<tr>
					<td>${author.name}</td>
					<td>${author.profile}</td>
					<td>
						<button><a href="/author/update?id=${author.id}">update</a></button>						
					</td>
					<td>
						<form action="/author/delete" method="post">
							<input type="hidden" name="id" value="${author.id}" />
							<button type="submit">delete</button>
						</form>						
					</td>
				</tr>
			`;
		});
		const table = `
			<table>
				<tr>
					<th>name</th>
					<th>profile</th>
					<th>update</th>
					<th>delete</th>
				</tr>
				${table_data}
			</table>
			<button type="button">
				<a href="/author/create">create</a>
			</button>	
			<style>
				table {border: 1px solid black; border-collapse: collapse; }
				td, th {border: 1px solid black; padding: 0 10px; }
			</style>
		`;
		return table;
	},
};
