var options = {
	"token": "Enter Token Here",
}
var bot = new Discord.Client();

if (options.token == "Enter Token Here") {
	alert("Token not added to interface.js")
} else {
	bot.login(options.token);
}

var guildarray;
var userarray;

bot.on('ready', function () {
	console.log(bot.user.username);
	guildarray = (bot.guilds.array()).sort(function(a, b){
		if(a.name.toLowerCase() < b.name.toLowerCase()) return -1;
		if(a.name.toLowerCase() > b.name.toLowerCase()) return 1;
		return 0;
	});
	userarray = bot.users.array().sort(function(a, b){
		if(a.username.toLowerCase() < b.username.toLowerCase()) return -1;
		if(a.username.toLowerCase() > b.username.toLowerCase()) return 1;
		return 0;
	});

	updateUserList(userarray);
	document.getElementById('type_select').style.visibility = "visible";
});

bot.on('message', function (message) {
	updateMessageBox(message);
});

document.getElementById('type_select').onchange = function() {
	updateType();
}

document.getElementById('guild_select').onchange = function() {
	var type = document.getElementById('type_select');
	if (type.value == "guilds") updateChannelList();
	if (type.value == "users") {
		if (document.getElementById('guild_select').value != "null") {
			document.getElementById('user_select').value = document.getElementById('guild_select').value;
			document.getElementById('user_wrapper').style.marginRight = "0px";
			setTimeout(function(){ document.getElementById('user_wrapper').style.marginRight = ""; }, 3000);
			updateUserInfo();
		}
	}
	if (document.getElementById('guild_select').value == "null") {
		clearList('channel_select');
		clearMessageBox();
		document.getElementById('channel_select').style.visibility = "hidden";
		return;
	}
	getMessages();
}

document.getElementById('channel_select').onchange = function() {
	console.log("channel changed");
	if (document.getElementById('channel_select').value == "null") {
		clearMessageBox();
		return;
	}
	getMessages();
}

document.getElementById('message_box').onkeyup = function(e) {
	e = e || event;
	if (e.keyCode === 13) {
		if (e.shiftKey === true) {
			return;
		}
		sendMessage();
	}
}

document.getElementById('searchuser_box').onkeyup = function(e) {
	e = e || event;
	if (e.keyCode === 13) {
		if (e.shiftKey === true) {
			return;
		}
		searchUsers();
	}
}

document.getElementById('user_select').onchange = function() {
	updateUserInfo();
}

function sendMessage() {
	var type = document.getElementById('type_select').value;
	var content = document.getElementById('message_box');
	if (content.value == "") {
		return;
	}
	if (type == null) return;
	if (type == "guilds") sendPublic(content);
	if (type == "users") sendPrivate(content);

	return;
}

function sendPublic(content) {
	var serverID = document.getElementById('guild_select').value;
	var channelID = document.getElementById('channel_select').value;
	
	var channel = (bot.guilds.get(serverID)).channels.get(channelID);
	
	channel.sendMessage(content.value);
	content.value = "";
}

function sendPrivate(content) {
	var userID = document.getElementById('guild_select').value;
	var channel = bot.users.get(userID);
	
	channel.sendMessage(content.value);
	content.value = "";
}

function updateServerList(array) {
	var server = document.getElementById('guild_select');
	var type = document.getElementById('type_select').value;
	clearList('guild_select');
	for(var i = 0; i < array.length; i++) {
			var opt = array[i];
			var el = document.createElement("option");
			el.textContent = opt.name;
			if (opt.name == undefined) el.textContent = opt.username;
			el.value = opt.id;
		if (type == "users") {
			if(opt.id != bot.user.id) {
				server.appendChild(el);
			}
		} else {
			server.appendChild(el);
		}
	}
}
function clearList(element_id) {
	var select = document.getElementById(element_id);
	var i;
	for(i = select.options.length - 1 ; i >= 0 ; i--) {
		if (select.options[i].value != "null") {
			select.remove(i);
		}
	}
}
function updateUserList(array) {
	clearList('user_select');
	var user = document.getElementById('user_select');
	for (var i = 0; i < array.length; i++) {
		var opt = array[i];
		var el = document.createElement("option");
		el.textContent = opt.username;
		el.value = opt.id;
		user.appendChild(el);
	}
}

function updateType() {
	var type = document.getElementById('type_select').value;
	if (type == "null") {
		document.getElementById('guild_select').style.visibility = "hidden";
		document.getElementById('channel_select').style.visibility = "hidden";
		clearMessageBox();
	} else if (type == "guilds") {
		document.getElementById('guild_select').style.visibility = "visible";
		document.getElementById('channel_select').style.visibility = "visible";
		updateServerList(guildarray);
		updateChannelList();
	} else if (type == "users") {
		document.getElementById('guild_select').style.visibility = "visible";
		document.getElementById('channel_select').style.visibility = "hidden";
		updateServerList(userarray);
	}
}

function updateChannelList() {
	var guildID = document.getElementById('guild_select').value;
	if (guildID == null) {
		return;
	}
	var guild = bot.guilds.find('id', guildID);
	if (guild == null) return;
	var channelArray = guild.channels.array();
	var select = document.getElementById('channel_select');
	clearList('channel_select');
	
	for(var i = 0; i < channelArray.length; i++) {
		var opt = channelArray[i];
		var el = document.createElement("option");
		el.textContent = opt.name;
		el.value = opt.id;
		if (channelArray[i].type == 'text') select.appendChild(el);
	}		
}

function updateUserInfo() {
	var userID = document.getElementById('user_select').value;
	console.log(userID);
	document.getElementById('avatar').src = "";
	document.getElementById('userinfo').innerHTML = "";
	if (userID == "null") {
		document.getElementById('avatar').src = "";
		document.getElementById('userinfo').innerHTML = "";
		return;
	}
	var user = bot.users.get(userID);
	if (user == "" && userID == bot.user.id) {
		console.log("Self Get");
		user = bot.user;
	}
	document.getElementById('avatar').src = user.avatarURL;
	document.getElementById('userinfo').innerHTML = (user.username + "<br>" + user.id + "<br>");
	return user;
}

/*example use
filter(userarray, {username.toLowerCase().contains(search_text.toLowerCase())})
*/
// This function gets called whenever the user hits the enter key on that textbox
function searchUsers() {
	var search_text = document.getElementById('searchuser_box').value; //gets the value in the box
	if (search_text == "") return; //if its empty stop
	clearList('user_select'); //empties the drop down box of all <option> elements
	var temp_array = filterUsers(search_text); //creates a temp array
	updateUserList(temp_array); //updates the user list (the drop down box), using this temp array
	if (temp_array.length == 1) { //special case where there's only 1 result, why not automatically show that result
		document.getElementById('user_select').value = temp_array[0].id; //sets the value of the drop down to be equal to the value in the first position in the array
		document.getElementById('searchuser_box').value = ""; //empties the search box
		updateUserInfo(); //updates the avatar, username, and id shown below the search box and user select
		
	}
	document.getElementById('searchuser_box').value = document.getElementById('searchuser_box').value.replace('\n',''); //removes the newline from the search (because the enter press adds one)
}

function filterUsers(search_text) { //filter function to filter by "does username contain X"
	var temp_array = []; //creates temp array
	search_text = search_text.toLowerCase().replace('\n',""); //removes newlines from search text
	if (search_text == "") return userarray; //if the text is empy return, probably not needed but hey, yolo
	for (i = 0; i < userarray.length; i++) { //loops through the cached users (userarray is a global variable, set at start on login)
		var username = userarray[i].username.toLowerCase(); //temp username var to make things easier to read
		if (username.includes(search_text)) //if username contains search text
			temp_array.push(userarray[i]); //adds the user to the temp array
	}
	if (temp_array.length == 0) return userarray; //if the temp array is empty return the original array
	console.log(temp_array);
	return temp_array; //return temp array
}

