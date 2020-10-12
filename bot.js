const Discord = require("discord.js");
const { config } = require("dotenv");
const version = '1.0';
const fs = require('fs');
const botSettings = JSON.parse(fs.readFileSync('./botSettings.json'));
const bot = new Discord.Client({disableEveryone: false});
bot.commands = new Discord.Collection();
var prefix = botSettings.prefix;
config({ path: __dirname + "/.env" });

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