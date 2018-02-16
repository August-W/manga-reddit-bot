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
      kill = true;
      pmUser();
    }, timeout);

    firstListing.fetchMore({amount:300*days, append:true}).then(myListing => {
      console.log("Attempting to search the last "+days+" day(s) of new /r/manga posts...");
      begin = myListing[0].id;
      for(var i = 0; i<myListing.length; i++){
        if(myListing[i].id === db.end){
          console.log("Searched all new posts");
          kill = false;
          return begin;
        }
        else{
          var title = myListing[i].title.toLowerCase();
          for(var n = 0; n<db.manga.length; n++){
            if(title.includes(db.manga[n]) && title.includes("[disc]")){
              console.log("New chapter of '"+db.manga[n]+"' was found! ");
              newMangaNames.push(myListing[i].title);
              newMangaLinks.push("https://www.reddit.com/r/manga/"+myListing[i].id);
            }
          }
        }
      }
      kill = false;
      return begin;
    }).then( b => {pmUser();});
  });
}

//PM USER NEW MANGA CHAPTERS
function pmUser(){
  if(kill === false){
    clearTimeout(exitTime);
  }
  return r.getUser(db.username).fetch().then(user => {
    if(newMangaNames.length>0){
      var pm = "";
      for(var k = 0; k<newMangaNames.length; k++){
        pm=pm+"["+newMangaNames[k]+"]"+"("+newMangaLinks[k]+")"+"\n\n";
      }
      r.composeMessage({to: user, subject: newMangaNames.length+" new manga chapter(s) were uploaded!", text: pm}).then( u => {afterMessages();});
    }
    else{
      afterMessages();
    }
  });
}

//WRITE TO THE DATABASE
function afterMessages(){
  return new Promise(function(resolve, reject){
    db.date = today;
    db.end = begin;
    fs.writeFile(appDir+"/database.json", JSON.stringify(db, null, "\t"), 'utf-8', err => {
      if(err){
        console.log(err);
      }
      else if(kill === true){
        console.log("Timeout!");
        process.exit();
      }
      else {
        console.log("Finished! Headpat me, senpai!");
      }
    });
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//THE MAIN
console.log("I'm your manga-reddit-bot. Let's get started!")
var timeout = 600000;
var today = date.create().now();
var kill = true;
var newMangaLinks = [];
var newMangaNames = [];

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
