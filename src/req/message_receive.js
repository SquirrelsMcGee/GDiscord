function getMessages() {
	clearMessageBox();
	var messagebox = document.getElementsByClassName('message_wrapper')[0];
	var type = document.getElementById('type_select').value;
	var guild_id = document.getElementById('guild_select').value;
	var messageStr;
	if (type == "users") {
		var channel = bot.users.get(guild_id).dmChannel;
		console.log("Fetching DMs");
	} else if(type == "guilds") {
		var channel_id = document.getElementById('channel_select').value;
		var server = bot.guilds.get(guild_id);
		
		var channel = server.channels.get(channel_id);
		console.log("Fetching Text Messages");
	}
	if (channel == null) {
		console.log("Channel/User returned null");
		return;
	}
	channel.fetchMessages({limit: 100})
		.then(messages => {
			console.log(`Received ${messages.size} messages`);
			var message_array = messages.array().reverse();
			if (messages.size == 0) return;
			var limit = 100;
			if (messages.size < 100) limit = messages.size;
			
			for (i = 0; i < limit; i++) {
				//console.log(message_array[i]);
				//console.log(i);
				messagebox.innerHTML = messagebox.innerHTML + "<br>" + (message_array[i].author.username + " - " + message_array[i].content.replace("<", "&lt;").replace(">", "&gt;"));
			}
			messagebox.scrollTop = messagebox.scrollHeight;
		})
		.catch(console.error);
}

function updateMessageBox(message) {
	var messagebox = document.getElementsByClassName('message_wrapper')[0];
	var type = document.getElementById('type_select').value;
	var guild_id = document.getElementById('guild_select').value;
	if (message.channel.type == "dm") {
		if (message.channel.recipient.id != guild_id) return;
	} else if(message.channel.type == "text") {
		var channel_id = document.getElementById('channel_select').value;
		if (message.channel.id != channel_id) return;
	}
	messagebox.innerHTML = messagebox.innerHTML + "<br>" + (message.author.username + " - " + message.content.replace("<", "&lt;").replace(">", "&gt;"));
	messagebox.scrollTop = messagebox.scrollHeight;
	return;	
}

function clearMessageBox() {
	var messagebox = document.getElementsByClassName('message_wrapper')[0];
	messagebox.innerHTML = "";
	return;
}
