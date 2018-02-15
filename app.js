//NEED THIS TO GET TO REDDIT
require('dotenv').config();
const Snoowrap = require('snoowrap');


//NEED THIS TO GET THE CURRENT DATE
var date = require('node-datetime');


//GET THE DB FILE
var path = require('path');
var appDir = path.dirname(require.main.filename);
var fs = require('fs')
var db = JSON.parse(fs.readFileSync(appDir+'/database.json', 'utf8'))
var begin = db.end;


//SET UP THE REDDIT CONNECTION
const r = new Snoowrap({
  "userAgent": 'reddit-manga-bot-node',
  "clientId": process.env.CLIENT_ID,
  "clientSecret": process.env.CLIENT_SECRET,
  "username": process.env.REDDIT_USER,
  "password": process.env.REDDIT_PASS
});


//LINK USER TO MANGA POSTS
function postComments(){
  r.getSubreddit('manga').getNew({limit:1}).then(firstListing => {
    begin = firstListing[0].id;
    exitTime = setTimeout(function() {
      console.log("timeout");
      afterMessages(begin, true);
    }, timeout);

    firstListing.fetchMore({amount:300*days, append:true}).then(myListing => {
      console.log("Attempting to search the last "+days+" day(s) of new /r/manga posts...");
      begin = myListing[0].id;
      for(var i = 0; i<myListing.length; i++){
        if(myListing[i].id === db.end){
          console.log("Searched all new posts");
          clearTimeout(exitTime);
          return begin;
        }
        else{
          var title = myListing[i].title.toLowerCase();
          for(var n = 0; n<db.manga.length; n++){
            if(title.includes(db.manga[n]) && title.includes("[disc]")){
              console.log("New chapter of '"+db.manga[n]+"' was found!");
              myListing[i].reply(db.username);
            }
          }
        }
      }
      clearTimeout(exitTime);
      return begin;
    }).then(start => afterMessages(start, false));
  });
}

//WRITE TO THE DATABASE
function afterMessages(start, kill){
  return new Promise(function(resolve, reject){
    db.date = today;
    db.end = start;
    fs.writeFile(appDir+"/database.json", JSON.stringify(db, null, "\t"), 'utf-8', err => {
      if(err){
        console.log(err);
      }
      else{
        console.log("Finished! Headpat me, senpai!");
      }
      if(kill === true){
        process.exit();
      }
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THE MAIN
console.log("I'm your manga-reddit-bot. Let's get started!")
var timeout = 600000;
var today = date.create().now();

if(db.date === 0){
  console.log("It appears that this is your first time! I'll be gentle...")
  db.end = "a";
  db.date = today - (1000*60*60*24);
  timeout = 10000;
}
else if(db.date - today < 1){
  console.log("You have already used manga-reddit-bot today! If you need to reset and try again, first change the 'date' value in database.json to 0.")
  process.exit();
}

var days = today - db.date;
days = days/(1000*60*60*24);
postComments();
