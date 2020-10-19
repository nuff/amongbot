const Discord = require("discord.js");
const fs = require('fs');
var jt = require('json-toolkit');
const embeds = require('../../utils/embed.js');

module.exports.run = async (bot, msg, args) => {
    if(!(msg.member.hasPermission("ADMINISTRATOR"))) {
        msg.channel.send({
            embed: embeds.errorEmbed('No permissions!')
          }).then(async msg => msg.delete({
            timeout: 5000
          }));
        return;
    }

    if (!fs.existsSync('servers/' + msg.guild.id + '.json')) {
        msg.channel.send({
          embed: embeds.errorEmbed('This server has not been set up yet! Try \'among help\'.')
        }).then(async msg => msg.delete({
          timeout: 5000
        }));
        return;
    }

    jt.parseFile('servers/' + msg.guild.id + '.json', (error, data) => {
        if(error) {
            msg.channel.send({
                embed: embeds.errorEmbed('An error occured while setting the server up, please try again.')
            }).then(async msg => msg.delete({timeout: 5000}));
            console.log(error);
            return;
        }
        const configEmbed = new Discord.MessageEmbed()
        .setColor('#6cd3eb')
        .setTitle('Config | Server-ID: ' + msg.guild.id)
        .addFields(
        { name: 'Role', value: data[0] },
        { name: 'Channel', value: data[1] }
        )
        .setTimestamp()
        .setFooter('© amongbot 2020', bot.user.avatarURL);
        msg.channel.send(configEmbed);
    });
};

module.exports.help = {
  name: "config",
  arguments: "",
  description: "Display the configuration of a server.",
  category: "admin"
}
