const http = require('http');
const path = require('path');
const fs = require('fs');
const url = require('url');
const dataPath = path.join(__dirname, 'data');
const server = http.createServer((req, res) => {
 if(req.url == '/jokes' && req.method == 'GET') {
  getAllJokes(req, res);
 }
 if(req.url == '/jokes' && req.method == 'POST'){
 	addJokes(req, res);
 }
});
server.listen(3000);
function getAllJokes(req, res){
 let dir = fs.readdirSync(dataPath);
 let allJokes = [];
 for(let i = 0; i < dir.length; i++) {
  let file = fs.readFileSync(path.join(dataPath, i+'.json'));
  let jokeJSON = Buffer.from(file).toString();
  let joke = JSON.parse(jokeJSON);
  joke.id = i;
  allJokes.push(joke);
 }
 res.end(JSON.stringify(allJokes))
}

function addJokes(req, res){
	let data = '';
	req.on('data', function(chunk){
		data += chunk;
	})
	req.end('data', function() {
		let joke = JSON.parse(data);
		joke.likes = 0;
		joke.dislike = 0;

		let dir = fs.readdirSync(dataPath);
		let fileName = dir.length+'.json';
		let filePath = path.join(dataPath, fileName);
		fs.writeFileSync(filePath, JSON.stringify(joke));

		res.end();
	});
}