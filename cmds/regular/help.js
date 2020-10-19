const Discord = require("discord.js");

module.exports.run = async (bot, msg, args) => {
  const helpEmbed = new Discord.MessageEmbed()
	.setColor('#6cd3eb')
	.setTitle('amongbot')
	.setDescription('A list of all commands')
	.setThumbnail(bot.user.avatarURL)
	.addFields(
    { name: 'among setup <hostRoleId> <voiceChannelId>', value: 'Setup a server with the host role and voice channel ID.' },
    { name: 'among edit <role/channel> <hostRoleId/voiceChannelId>', value: 'Edit the host role or voice channel ID.' },
    { name: 'among lobby <code> <region: NA/EU/ASIA> <map: TheSkeld/MiraHQ/Polus> <impostors: 1/2/3>  <confirmEjects: on/off> <visualTasks: on/off>', value: 'Post a lobby message.'},
    { name: 'among muteminion', value: 'Create an embed you can use to mute and unmute the voice channel using reactions.'},
    { name: 'among ghostping', value: 'Ghostping whereever you send the message!' },
    { name: 'among mute', value: 'Mute everyone in the specified Among Us voice channel.' },
    { name: 'among unmute', value: 'Unmute everyone in the specified Among Us voice channel.' },
    { name: 'among help', value: 'List all commands.' },
	)
	.setTimestamp()
	.setFooter('© amongbot 2020', bot.user.avatarURL);

  msg.channel.send(helpEmbed);
};

module.exports.help = {
  name: "help",
  arguments: "",
  description: "",
  category: "regular"
}
