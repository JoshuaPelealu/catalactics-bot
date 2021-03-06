import { MessageEmbed } from 'discord.js';
import getRepoInfo from 'git-repo-info';
import { CommandsType } from '../../utils/interfaces';
import { getUptime } from './uptime';
import('dotenv').then(dotenv => dotenv.config());

export const stats: CommandsType = {
  prefix: 'stats',
  desc: 'Shows the status of the bot.',
  category: 'Information',
  command: async function stats(msg, { client }) {
    try {
      // The message embed to send
      const embed = new MessageEmbed().setColor('#FF00FF').setTitle('Catalactics Stats').setDescription(' ');

      // Basic infos
      embed.addField('Server Name', `\\>    ${msg.guild}`);

      embed.addField('Server Count', `\\>    ${client.guilds.cache.size}`);

      // get uptime value
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const time = client.uptime! / 1000;
      if (time == undefined) throw 'Cannot get Client Uptime';
      const up = getUptime(time);
      const days = up[0],
        hours = up[1],
        minutes = up[2],
        seconds = up[3];

      embed.addField('Uptime', `\\>    ${days} ${hours} ${minutes} ${seconds}`);

      // If version is undefined, it will get a different approach locally
      const envVar = process.env.SOURCE_VERSION;
      console.log(envVar, envVar == undefined);
      const hash = envVar == undefined ? getRepoInfo().abbreviatedSha : envVar.slice(0, 10);

      // Adds a field to the embed
      embed.addField(
        'Commit Version',
        `[${hash}](https://github.com/JoshuaPelealu/catalactics-bot/commit/${hash})`
      );

      embed.addField('More Information About Me', 'Visit https://github.com/JoshuaPelealu/catalactics-bot#catalactics-bot');

      msg.channel.send(embed);
    } catch (err) {
      console.error(err);
    }
  }
};

export default stats;
