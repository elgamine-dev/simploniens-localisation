var fs = require('fs');
var gsjson= require('google-spreadsheet-to-json');
var config = require('./config.js');
var md5 = require('md5');
var values = require('./values.js');

var curseur = 0;

var groupTable= [
	{
		spreadsheetId: config.spreadsheetIdToulouse,
	}
];

/* Appel de la fonction principale */
getDataGsheets(groupTable);

function getDataGsheets(table){
	for (var i = 0; i < table.length; i++){
		gsjson({
			spreadsheetId: table[i].spreadsheetId,
		})
		.catch(function(err){
			console.log(err.message);
			console.log(err.stack);
		})
		.then(function(result){
			// console.log(result);
			next(result, table);
			
		});
	}
}

function next(result, table){
	groupTable[curseur].output = reorganizeJson(result, values);
	curseur ++;
	if(curseur === table.length){
		var fileJson = createJson(groupTable[0].output);
		ecritureJson(fileJson, __dirname + '/public/simploniens.json');
	}
}

function reorganizeJson(data, keys){
	return data.map(function(item){
		var output = {};
		createId(output, item.nom, item.prenom);
		for(var k in keys){
			output[k] = item[keys[k]] || '';
		}
		return output;
	});
}

function createId(object, nom, prenom){
	object.id = md5(nom + prenom);
}

function createJson(array1, array2){
	var Json = {}
	Json.marrainage = array1.concat(array2);
	return Json ;
}

function ecritureJson(file, path){
	var stringJson= JSON.stringify(file);
	fs.writeFile(path, stringJson, 'utf8', (err) => {
		if (err) throw err;
		console.log('It\'s saved!');
	});
}