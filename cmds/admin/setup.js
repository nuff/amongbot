var jt = require('json-toolkit');
var fs = require('fs');
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

    if (fs.existsSync('servers/' + msg.guild.id + '.json')) {
      msg.channel.send({
        embed: embeds.errorEmbed('This server has either already been set up or an error occured! Try again or \'among edit\'.')
      }).then(async msg => msg.delete({
        timeout: 5000
      }));
      return;
    }

    if(args.length < 1) {
        msg.channel.send({
            embed: embeds.errorEmbed('Not enough arguments! Use \'among help\'')
          }).then(async msg => msg.delete({timeout: 5000}));
        return;
    }

    var role = msg.guild.roles.cache.find(x => x.id === args[0]);
    var channel = msg.guild.channels.cache.find(c => c.id === args[1]);
    if(!role && !channel) {
      msg.channel.send({
        embed: embeds.errorEmbed('Neither this channel nor the role exist!')
      }).then(async msg => msg.delete({timeout: 5000}));
      return;
    }
    if(!role) {
      msg.channel.send({
        embed: embeds.errorEmbed('This role doesn\'t exist!')
      }).then(async msg => msg.delete({timeout: 5000}));
      return;
    }
    if(!channel) {
      msg.channel.send({
        embed: embeds.errorEmbed('This channel doesn\'t exist!')
      }).then(async msg => msg.delete({timeout: 5000}));
      return;
    }

    jt.saveToFile([args[0], args[1]], "servers/" + msg.guild.id + ".json", "\t", error => {
        if(error) {
          msg.channel.send({
              embed: embeds.errorEmbed('An error occured while setting the server up, please try again.')
          }).then(async msg => msg.delete({timeout: 5000}));
          return;
        }
        msg.channel.send({
            embed: embeds.notifEmbed('Success!', 'This server has been set up successfully. Use among edit to edit the values.')
        });
      });
};

module.exports.help = {
  name: "setup",
  arguments: "<hostRoleId> <voiceChannelId>",
  description: "Setup a server with the host role and voice channel ID.",
  category: "admin"
}
