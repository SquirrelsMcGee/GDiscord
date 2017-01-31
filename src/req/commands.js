const commands = {
    "hello" : {
        name: "hello",
        desc: "Outputs Hello World!",
        ownerOnly: false,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function(bot, message, suffix) {
            message.channel.sendMessage("Hello " + message.author.username + "!");
        }
    },
    "tweet": {
        name: "tweet",
        desc: "Tweet Tweet",
        ownerOnly: true,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function (bot, message, suffix) {
            TwitterClient.post('statuses/update', { status: suffix.substring(0, 140) }, function (error, tweet, response) {
                if (error) {
                    console.log(error);
                }
                //console.log(tweet);  // Tweet body.
                message.channel.sendMessage(`:bird: Ok, i've tweeted that, here's a link to the tweet: <https\://twitter.com/DiscordUnit00/status/${tweet.id_str}>`)
                //console.log(response);  // Raw response object.
            });
        }
    },
    "8ball": {
        name: "8ball",
        desc: "Give infinite wisdom",
        ownerOnly: false,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function (bot, message, suffix) {
            let randInt = Math.floor(Math.random() * responses.fun.eightball.length);
            if (suffix == null) {
                message.channel.sendMessage(responses.errors.suffix.generic.empty);
                return;
            }
            message.channel.sendMessage(responses.fun.eightball[randInt]);
        }
    },
    "setname": {
        name: "setname",
        desc: "Sets the name of the bot",
        ownerOnly: true,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function (bot, message, suffix) {
            if (suffix.length > 32) {
                message.channel.sendMessage("Error: name is too long");
                return;
            } else if (suffix.length < 3) {
                message.channel.sendMessage("Error: name is too short");
                return;
            }
            bot.user.setUsername(suffix).
                then(function(user) {
                    message.channel.sendMessage(`Set username to ${user.username}`);
                    console.log(colors.data(`Change name to: ${bot.user.username}`));
                    })
                .catch(function (error) { console.log(colors.error(error));});

        }
    },
    "setpic": {
        name: "setpic",
        desc: "Sets the image for the bot",
        ownerOnly: true,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function (bot, message, suffix) {
            let wip_folder = './req/images/profile_pictures/';

            if (suffix == "") {
                if (message.attachments.array()[0] == undefined) {
                    message.channel.sendMessage(responses.errors.suffix.generic.no_pic);
                    return;
                }
                suffix = message.attachments.array()[0].url;
            }
            let filename = `${message.id}_${suffix.split('/')[suffix.split('/').length - 1]}`;
            download(suffix, wip_folder, filename, function () {
                    bot.user.setAvatar(wip_folder + filename).then(user => message.channel.sendMessage(`:ok: Set new profile picture`)).catch(console.error);
            });

        }
    },
    "setstatus": {
        name: "setstatus",
        desc: "Sets the bot's `playing` status",
        ownerOnly: true,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: false,
        delete_author_message: false,
        run: function (bot, message, suffix) {
            bot.user.setGame(suffix);
        }
    },
    "rule34": {
        name: "rule34",
        usage: "rule34 `tags`",
        desc: "Searches images on rule34.xxx using tags",
        ownerOnly: false,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: true,
        run: function (bot, message, suffix) {

            let tags = suffix.replace(' ', '+').replace('/', '%25-2F').replace("\n", null);

            let limit = null,
                amount = 3,
                randArray = [];

            let resultStr = "Searched for images ";
            if (suffix != "") resultStr += "using tag(s): `" + suffix + "`\n";
            if (suffix == "") resultStr += "with any tag\n";

            let options = {
                url: 'http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + tags,
                method: 'POST',
                headers: { 'user-agent': 'DiscordUnit00/2.0' }
            };
            request.post(options, function (err, siteData) {
                parseString(siteData.body, function (err, result) {
                    jsonify = result.posts.post;
                    if (err) {
                        return;
                    }
                    if (jsonify === undefined) {
                        message.channel.sendMessage(result + " and found nothing.")
                        return;
                    }
                    limit = jsonify.length;
                    if (amount > limit) amount = limit;
                    while (randArray.length < amount) {
                        var random_number = Math.floor(Math.random() * limit);
                        if (randArray.indexOf(random_number) == -1) {
                            randArray.push(random_number);
                        }
                    }
                    resultStr += `Showing \`${amount}\` of \`${limit}\` results`;
                    for (i = 0; i < randArray.length; i++) {
                        resultStr += "\nhttps:" + jsonify[randArray[i]].$.sample_url;
                    }
                    message.channel.sendMessage(resultStr);
                });

            });

        }
    },
    "e621": {
        name: "e621",
        usage: "e621 `tags`",
        desc: "Searches images on e621.net using tags",
        ownerOnly: false,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: true,
        run: function (bot, message, suffix) {

            let tags = suffix.replace(' ', '+').replace('/', '%25-2F').replace("\n", null);

            let limit = null,
                amount = 3,
                randArray = [];

            let resultStr = "Searched for images ";
            if (suffix != "") resultStr += "using tag(s): `" + suffix + "`\n";
            if (suffix == "") resultStr += "with any tag\n";

            let options = {
                url: 'https://e621.net/post/index.json?limit=1000&tags=' + tags,
                method: 'POST',
                headers: { 'user-agent': 'DiscordUnit00/2.0' }
            };
            request.post(options, function (err, siteData) {
                    jsonify = JSON.parse(siteData.body);
                    if (err) {
                        return;
                    }
                    if (jsonify === undefined) {
                        message.channel.sendMessage(result + " and found nothing.")
                        return;
                    }
                    limit = jsonify.length;
                    if (amount > limit) amount = limit;
                    while (randArray.length < amount) {
                        var random_number = Math.floor(Math.random() * limit);
                        if (randArray.indexOf(random_number) == -1) {
                            randArray.push(random_number);
                        }
                    }
                    resultStr += `Showing \`${amount}\` of \`${limit}\` results`;
                    for (i = 0; i < randArray.length; i++) {
                        resultStr += "\n" + jsonify[randArray[i]].sample_url;
                    }
                    message.channel.sendMessage(resultStr);

            });

        }
    },
    "e926": {
        name: "e926",
        usage: "e926 `tags`",
        desc: "Searches images on e926.net using tags",
        ownerOnly: false,
        adminOnly: false,
        publicOnly: false,
        nsfwOnly: true,
        run: function (bot, message, suffix) {

            let tags = suffix.replace(' ', '+').replace('/', '%25-2F').replace("\n", null);

            let limit = null,
                amount = 3,
                randArray = [];

            let resultStr = "Searched for images ";
            if (suffix != "") resultStr += "using tag(s): `" + suffix + "`\n";
            if (suffix == "") resultStr += "with any tag\n";

            let options = {
                url: 'https://e926.net/post/index.json?limit=1000&tags=' + tags,
                method: 'POST',
                headers: { 'user-agent': 'DiscordUnit00/2.0' }
            };
            request.post(options, function (err, siteData) {
                jsonify = JSON.parse(siteData.body);
                if (err) {
                    return;
                }
                if (jsonify === undefined) {
                    message.channel.sendMessage(result + " and found nothing.")
                    return;
                }
                limit = jsonify.length;
                if (amount > limit) amount = limit;
                while (randArray.length < amount) {
                    var random_number = Math.floor(Math.random() * limit);
                    if (randArray.indexOf(random_number) == -1) {
                        randArray.push(random_number);
                    }
                }
                resultStr += `Showing \`${amount}\` of \`${limit}\` results`;
                for (i = 0; i < randArray.length; i++) {
                    resultStr += "\n" + jsonify[randArray[i]].sample_url;
                }
                message.channel.sendMessage(resultStr);

            });

        }
    },
}

function randomImage(message, number, source) {
    let imageList = listDir('./images/' + source);
    let max = (imageList.length);
    if (number == "") {
        let randInt = Math.floor(Math.random() * max);
        message.channel.sendFile(imageList[randInt]).then(message => console.log('Sent File')).catch(console.log);
    } else {
        if (number < 1 || number > max) {
            message.channel.sendMessage(responses.errors.numbers.range);
            return null;
        }
        message.channel.sendFile(imageList[(number - 1)]).then(message => console.log('Sent File')).catch(console.log);
    }
}


String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
}

