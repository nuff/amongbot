const Discord = require("discord.js");
const { config } = require("dotenv");
const version = '1.2';
const fs = require('fs');
const botSettings = JSON.parse(fs.readFileSync('./botSettings.json'));
const bot = new Discord.Client({disableEveryone: false});
bot.commands = new Discord.Collection();
var prefix = botSettings.prefix;
config({ path: __dirname + "/.env" });
var currentGames = [];
module.exports = currentGames;

fs.readdir("./cmds/", (err) => {
    if (err) console.error(err);

    const dirs = source =>
        fs.readdirSync(source, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
    dirs("./cmds/").forEach(dir => {
        fs.readdir("./cmds/" + dir + "/", (err, files) => {
            let jsfiles = files.filter(f => f.split(".").pop() === "js");
            if (jsfiles <= 0) {
                console.log("> Error: No commands to load!");
                return;
            }

            var names = [];
        
            jsfiles.forEach(f => {
                let prop = require(`./cmds/${dir}/${f}`);
                bot.commands.set(f, prop);
                names.push(prop.help.name);
            });
            
            console.log(`> loaded ${jsfiles.length} commands: ${names}`);
        });
    });
});

bot.on('messageReactionAdd', (reaction, user) => {
    let message = reaction.message, emoji = reaction.emoji;

    if(user.bot) return;

    if (emoji.name == '⬆️') {
        currentGames.forEach(game => {
            if(game[0] === message.id) {
                if(game[1] === user.id && game[2] >= 0 && game[2] <= 10) {
                    game[2] += 1;
                    var players = "";
                    for(var i = 0; i < 10; i++) {
                        if(i < game[2]) {
                            players += "⏺️";
                        } else {
                            players += "➖";
                        }
                    }
                    const editEmbed = new Discord.MessageEmbed()
                    .setColor('#FBD6C6')
                    .setTitle('Among Us Lobby - hosted by "' + user.username + '"')
                    .setThumbnail(bot.user.avatarURL)
                    .addFields(
                        { name: 'Code', value: '**' + game[3] + '**', inline: true},
                        { name: 'Region', value: '**' + game[4] + '**', inline: true },
                        { name: 'Map', value: game[5] },
                        { name: 'Impostors', value: game[6] },
                        { name: 'Confirm Ejects', value: game[7], inline: true},
                        { name: 'Visual Tasks', value: game[8], inline: true },
                        { name: "Players", value: "⏪" + players + "⏩ (" + game[2] + ")"}
                    )
                    .setTimestamp()
                    .setFooter('© amongbot 2020', bot.user.avatarURL);
                    message.edit(editEmbed);
                }
                message.reactions.resolve(emoji.name).users.remove(user.id);
            }
        }); 
    }

    if (emoji.name == '⬇️') {
        currentGames.forEach(game => {
            if(game[0] === message.id) {
                if(game[1] === user.id && game[2] >= 0) {
                    game[2] -= 1;
                    var players = "";
                    for(var i = 0; i < 10; i++) {
                        if(i < game[2]) {
                            players += "⏺️";
                        } else {
                            players += "➖";
                        }
                    }
                    const editEmbed = new Discord.MessageEmbed()
                    .setColor('#FBD6C6')
                    .setTitle('Among Us Lobby - hosted by "' + user.username + '"')
                    .setThumbnail(bot.user.avatarURL)
                    .addFields(
                        { name: 'Code', value: '**' + game[3] + '**', inline: true},
                        { name: 'Region', value: '**' + game[4] + '**', inline: true },
                        { name: 'Map', value: game[5] },
                        { name: 'Impostors', value: game[6] },
                        { name: 'Confirm Ejects', value: game[7], inline: true},
                        { name: 'Visual Tasks', value: game[8], inline: true },
                        { name: "Players", value: "⏪" + players + "⏩ (" + game[2] + ")"}
                    )
                    .setTimestamp()
                    .setFooter('© amongbot 2020', bot.user.avatarURL);
                    message.edit(editEmbed);
                }
                message.reactions.resolve(emoji.name).users.remove(user.id);
            }
        }); 
    }

    if (emoji.name == '⏹️') {
        //game: [messageId, hostId]
        currentGames.forEach(game => {
            if(game[0] === message.id) {
                if(game[1] === user.id) {
                    const editEmbed = new Discord.MessageEmbed()
                    .setColor('#FBD6C6')
                    .setTitle('Among Us Lobby - hosted by "' + user.username + '"')
                    .setDescription('This game has ended.')
                    .setThumbnail(bot.user.avatarURL)
                    .setTimestamp()
                    .setFooter('© amongbot 2020', bot.user.avatarURL);
                    message.edit(editEmbed);
                    message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                    var newArr = currentGames.filter(item => item !== game);
                    currentGames = newArr;
                    console.log(currentGames);
                } else {
                    message.reactions.resolve(emoji.name).users.remove(user.id);
                }
            }
        }); 
    }
});

bot.on('ready', () => {
    console.log("> v" + version + " | started");
    bot.user.setStatus("online");
    bot.user.setActivity("among help | v" + version, { type: "PLAYING" });
});

bot.on("message", async msg => {
    if (!msg.content.startsWith(prefix)) return;
    if (msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();

    let command = bot.commands.get(cmd + ".js");
    if (command) command.run(bot, msg, args);
});

bot.login(process.env.TOKEN);