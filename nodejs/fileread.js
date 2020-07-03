const fs = require('fs');

fs.readFile('./data/sample.txt', 'utf8', (err, data) => {
	console.log(data);
});
