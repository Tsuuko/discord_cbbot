// Response for Uptime Robot
const http = require('http');
http.createServer(function (request, response) {
	response.writeHead(200, { 'Content-Type': 'text/plain' });
	response.end('Discord bot is active now \n');
}).listen(3000);

// Discord bot implements
const discord = require('discord.js');
const client = new discord.Client();


client.on('ready', message => {
	client.user.setPresence({ game: { name: 'プリコネR' } });
	console.log('bot is ready!');
	require("./module.js").cron(client);
	//client.channels.get("562846684158099478").send("test");
	//console.log(client.channels);
});

client.on('message', message => {
	const bot = require("./discord_bot.js");
	bot.discord_bot(message);
});


if (process.env.DISCORD_BOT_TOKEN == undefined) {
	console.log('please set ENV: DISCORD_BOT_TOKEN');
	process.exit(0);
}

client.login(process.env.DISCORD_BOT_TOKEN);
