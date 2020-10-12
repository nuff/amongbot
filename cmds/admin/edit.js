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

  if (!fs.existsSync('servers/' + msg.guild.id + '.json')) {
    msg.channel.send({
      embed: embeds.errorEmbed('This server has not been set up yet! Try \'among help\'.')
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

  switch(args[0]) {
    case "role": 
    var role = msg.guild.roles.cache.find(x => x.id === args[1]);
    if(!role) {
      msg.channel.send({
        embed: embeds.errorEmbed('This role doesn\'t exist!')
      }).then(async msg => msg.delete({timeout: 5000}));
      return;
    }
    jt.parseFile('servers/' + msg.guild.id + '.json', (error, data) => {
      if(error) {
        console.log(error);
        return;
      }
      jt.saveToFile([args[1], data[1]], "servers/" + msg.guild.id + ".json", "\t", error => {
        if(error) {
          msg.channel.send({
              embed: embeds.errorEmbed('An error occured while setting the server up, please try again.')
          }).then(async msg => msg.delete({timeout: 5000}));
          return;
        }
        msg.channel.send({
            embed: embeds.notifEmbed('Success!', 'The host role has successfully been edited!.')
        });
      });
    });
    break;
    case "channel": 
    var channel = msg.guild.channels.cache.find(c => c.id === args[1]);
    if(!channel) {
      msg.channel.send({
        embed: embeds.errorEmbed('This channel doesn\'t exist!')
      }).then(async msg => msg.delete({timeout: 5000}));
      return;
    }
    jt.parseFile('servers/' + msg.guild.id + '.json', (error, data) => {
      if(error) {
        console.log(error);
        return;
      }
      jt.saveToFile([data[0], args[1]], "servers/" + msg.guild.id + ".json", "\t", error => {
        if(error) {
          msg.channel.send({
              embed: embeds.errorEmbed('An error occured while setting the server up, please try again.')
          }).then(async msg => msg.delete({timeout: 5000}));
          return;
        }
        msg.channel.send({
            embed: embeds.notifEmbed('Success!', 'The voice channel has successfully been edited!.')
        });
      });
    });
    break;
    default: 
    msg.channel.send({
      embed: embeds.errorEmbed('Wrong syntax! Try \'among help\'.')
    }).then(async msg => msg.delete({
      timeout: 5000
    }));
    return;
    break;
  }
};

module.exports.help = {
  name: "edit",
  arguments: "<role/channel> <hostRoleId/voiceChannelId>",
  description: "",
  category: ""
}