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
    firstListing.fetchMore({amount:300*days, append:true}).then(myListing => {
      begin = myListing[0].id;
      for(var i = 0; i<myListing.length; i++){
        if(myListing[i].id === db.end){
          afterMessages();
          return;
        }
        else{
          var title = myListing[i].title.toLowerCase();
          for(var n = 0; n<db.manga.length; n++){
            if(title.includes(db.manga[n]) && title.includes("[disc]")){
              myListing[i].reply(db.username);
            }
          }
        }
      }
      afterMessages();
    })
  })
}

//WRITE TO THE DATABASE
function afterMessages(){
  db.date = today;
  db.end = begin;
  fs.writeFile("database.json", db, function(err){
    if(err){
      console.log(err);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THE MAIN
var today = date.create().now();
if(db.date === 0){
  db.date = today - (1000*60*60*24);
}
var days = today - db.date;
days = days/(1000*60*60*24);
postComments();

//THE TIMEOUT
setTimeout(function() {
  afterMessages();
}, 600000);
