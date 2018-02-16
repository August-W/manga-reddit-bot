# manga-reddit-bot
___________________


This server-less bot allows you to "subscribe" to your favorite manga on /r/manga. You decide which manga to subscribe to. Whenever a new chapter of one of your listed manga is posted on /r/manga, the bot will message you with a link to the post, so that you receive a notification.
__________________________________________________________________________________


# SETUP
1. Install Node.js
2. Download this project
3. Create a new Reddit account for this bot. Go to https://www.reddit.com/prefs/apps/ to create the bot.
4. Take note of the bot's Client ID and Client Secret. They look like this: https://i1.wp.com/pythonforengineers.com/wp-content/uploads/2014/11/redditbot2.jpg
5. Edit the values in .sample-env in this project with the Client ID, Client Secret, and the username and password for your bot's account.
6. Using the command prompt / terminal, navigate to this project's folder and run:

node setup.js        

This should create the .env file you need to run this bot, based on .sample-env.
7. Edit database.json with any text editor. Put your personal reddit account's username here (not the bot's username). Add the titles of manga you want to subscribe to. Follow the format of the examples in the file. The titles do not need to be case-sensitive, but use the same translation that the uploaders use (e.g., if they post new chapters under the English title for the manga, use the English title here... not the Japanese title). You do not need to include things like "[DISC]" or "Ch12" to copy the entire reddit post format, just the title of the manga.
_____________________________________________________________________________________


# RUN THE BOT  
Using the command prompt / terminal, navigate to this project's folder and run:

node app.js

The first time you run this bot, it will only check for new posts from that day. You will not get messaged for every single chapter of a manga from before you started using the bot.
_____________________________________________________________________________________


# I SUGGEST SETTING THIS BOT TO RUN ON BOOT
This way, the bot will visit reddit daily and notify you on new manga, and you don't have to manually run it each time. The bot tries to read every post that has been uploaded since the last post it read. This means that, the less frequently you run the bot, the more posts it has to read. If you run the bot very infrequently (e.g. once every two months or something), it may time out before it reads every post.

# TO RUN ON BOOT (WINDOWS):
1. Using any text editor, create a .bat file (the filename doesn't matter) with the following line:

node C:/{PATH_TO_YOUR_DIRECTORY}/app.js

Replacing {PATH_TO_YOUR_DIRECTORY} with the path to this project on your computer
2. Follow these steps to add this .bat file to your startup folder: https://www.computerhope.com/issues/ch000322.htm

3. Create environment variables for the .env values (CLIENT_ID, CLIENT_SECRET, etc.): https://msdn.microsoft.com/en-us/library/windows/desktop/ms682653%28v=vs.85%29.aspx

# TO RUN ON BOOT (LINUX/MAC):
 Same basic idea, but with a bash script (.sh, not .bat).
___________________________________________________________________________________


# ENJOY!
I hope the setup process isn't too complicated. Maybe one day I'll make a gui and make this more user-friendly but ehhh...
I didn't do much error handling here. You may want to keep a spare copy of your database.json in case the bot runs into an error and leaves a null object there. Also, if you ever want to "unsubscribe" from a manga, just delete it's title from that file.
