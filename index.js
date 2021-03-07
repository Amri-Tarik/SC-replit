var express = require('express');
var axios = require('axios');
var bcrypt = require('bcrypt');
const Database = require("@replit/database")
const db = new Database()
cors = require('cors')

var app = express();

app.use(express.json());
app.use(cors())

app.post('/', function(request, response){
	var {username, password} = request.body;
	db.get(username).then(value => {
		if (value == null){
			response.send({error : true})
		} else {
			bcrypt.compare(password, value.pw).then(result => {
				if (result == true){
					response.send({error : false, role : value.rank, scribe : value.scribe});
				} else {
					response.send({error : true})
				}
			});
			
		}
	})
});

app.post('/chg', function(request, response){
	var {username, password,new_pass} = request.body;
	db.get(username).then(value => {
		if (value == null){
			response.send({error : true})
		} else {
			bcrypt.compare(password, value.pw).then(result => {
				if (result == true){
					const saltRounds = 10;
					bcrypt.hash(new_pass, saltRounds, function(err, hash) {
						db.set(username, {pw :hash, rank : value.rank, scribe : value.scribe  } ).then(() => {response.send({error : false})});
					});
				} else {
					response.send({error : true})
				}
			});
			
		}
	})
});

app.post('/notes', function(request, response){
	console.log("request found")
	var {username} = request.body;
	db.get(username).then(value => {
		if (value == null || value.notes == null){
			response.send({notes : null})
		} else {
			response.send({notes : value.notes})
		}
	})
});

app.post('/editnotes', function(request, response){
	console.log("request reached")
	var {username, notes } = request.body;
	db.get(username).then(value => {
		if (value == null ){
			db.set(username, {notes : notes})
			response.send("ok")
		} else {
			let dict = value
			dict.notes = notes
			db.set(username, dict)
			response.send("ok")
		}
	})
});

app.post('/sqd', function(request, response){
	var currentTime = new Date();
    let data = {
      header: {
        appName: "Second Chances DashBoard",
        appVersion: "0.1",
        isDeveloped: true,
        APIkey: "f8esm8mqr1sssc4c8kkkk84oo44ssws0ks440g",
        commanderName: "pepega_overlord",
        commanderFrontierID: "6091730",
      },
      events: [
        {
          eventCustomID: 13458,
          eventName: "getCommanderProfile",
          eventTimestamp: currentTime.toISOString(),
          eventData: {
            searchName: "pepega_overlord",
          },
        },
      ],
    };
    axios
      .post("https://inara.cz/inapi/v1/", data)
      .then((res) => {
		console.log(res.data)
        response.send(String(res.data.events[0].eventData.commanderSquadron.squadronMembersCount));
      })
	  .catch(err => console.log(err))
});

app.post('/cmdr', function(request, response){
	var {username} = request.body;
	var currentTime = new Date();
    let data = {
      header: {
        appName: "Second Chances DashBoard",
        appVersion: "0.1",
        isDeveloped: true,
        APIkey: "f8esm8mqr1sssc4c8kkkk84oo44ssws0ks440g",
        commanderName: "pepega_overlord",
        commanderFrontierID: "6091730",
      },
      events: [
        {
          eventCustomID: 13458,
          eventName: "getCommanderProfile",
          eventTimestamp: currentTime.toISOString(),
          eventData: {
            searchName: username,
          },
        },
      ],
    };
    axios
      .post("https://inara.cz/inapi/v1/", data)
      .then((res) => {
		console.log(res.data.events[0])
		if (res.data.events[0].eventData == undefined ){
			response.send({allegience : "user not found", power: "user not found", inaraURL : "user not found", rank : "user not found"})
		} else {
			console.log(username)
			var allegience = res.data.events[0].eventData.preferredAllegianceName
			var power = res.data.events[0].eventData.preferredPowerName
			var inaraURL = res.data.events[0].eventData.inaraURL
			var rank = res.data.events[0].eventData.commanderSquadron.squadronMemberRank
			var dict = {allegience : allegience, power: power, inaraURL : inaraURL, rank : rank}
			console.log(dict)
			response.send(dict)
		}
        // response.send(String(res.data.events[0].eventData.));
      })
	  .catch(err => console.log(err))
});


app.get('/', function(request, response){
	response.send("hello world");
});

app.listen(3000);

