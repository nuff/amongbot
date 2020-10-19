const Discord = require("discord.js");
var jt = require('json-toolkit');
const embeds = require('../../utils/embed.js');
const botjs = require('../../bot.js');
const muteMinions = botjs.muteMinions;

module.exports.run = async (bot, msg, args) => {
    try {
        jt.parseFile('servers/' + msg.guild.id + '.json', (error, data) => {
            if(error) {
                console.log(error);
                return;
            }
            if(!(msg.member.roles.cache.find(r => r.id === data[0]))) {
                msg.channel.send({
                embed: embeds.errorEmbed('No permissions!')
                }).then(async msg => msg.delete({
                timeout: 5000
                }));
                return;
            }
            msg.delete();

            const minionEmbed = new Discord.MessageEmbed()
            .setColor('#6cd3eb')
            .setTitle('Mute Minion | summoned by "' + msg.author.username + '"')
            .setThumbnail(bot.user.avatarURL)
            .addFields(
            { name: '🟥', value: 'Mute', inline: true },
            { name: "🟩", value: 'Unmute', inline: true}
            )
            .setTimestamp()
            .setFooter('© amongbot 2020', bot.user.avatarURL);

            msg.channel.send(minionEmbed).then(message => {
                message.react("🟥");
                message.react("🟩");
                message.react("⏹️");
                muteMinions.push([message.id, msg.author.id]);
            });
        });
    } catch {
        msg.channel.send({
          embed: embeds.errorEmbed('This server has not been set up yet!')
        }).then(async msg => msg.delete({
          timeout: 5000
        }));
    }
};

module.exports.help = {
  name: "muteminion",
  arguments: "",
  description: "",
  category: "regular"
}
