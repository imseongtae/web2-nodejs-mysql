const http = require('http');
const url = require('url');

const topic = require('./library/topic');
const author = require('./library/author');

const app = http.createServer((request, response) => {
	const _url = request.url;
	const queryData = url.parse(_url, true).query;
	const pathName = url.parse(_url, true).pathname;

	if (pathName === '/') {
		if (queryData.id === undefined) {
			topic.home(response);
		} else {
			topic.page(request, response);
		}
	} else if (pathName === '/create') {
		topic.create(response);
	} else if (pathName === '/create_process') {
		topic.create_process(request, response);
	} else if (pathName === '/update') {
		topic.update(request, response);
	} else if (pathName === '/update_process') {
		topic.update_process(request, response);
	} else if (pathName === '/delete_process') {
		topic.destroy(request, response);
	} else if (pathName === '/author') {
		author.home(response, response);
	} else if (pathName === '/author/create') {
		author.create(response);
	} else if (pathName === '/author/create_process') {
		author.create_process(request, response);
	} else if (pathName === '/author/update') {
		author.update(request, response);
	} else if (pathName === '/author/update_process') {
		author.update_process(request, response);
	} else if (pathName === '/author/delete') {
		author.destroy(request, response);
	} else {
		response.writeHead(404);
		response.end('Not found');
	}
});

app.listen(3000, () => {
	console.log('application 동작 중');
});
