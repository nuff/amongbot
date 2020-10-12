var jt = require('json-toolkit');
const embeds = require('../../utils/embed.js');

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
      const channel = msg.guild.channels.cache.find(c => c.id === data[1]);
      channel.members.forEach(member => { member.voice.setMute(true); });
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
  name: "mute",
  arguments: "",
  description: "",
  category: "regular"
}
