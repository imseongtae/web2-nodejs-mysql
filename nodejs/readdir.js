const dataFolder = './data';
const fs = require('fs');

fs.readdir(dataFolder, (err, fileList) => {
	console.log(fileList);
});
