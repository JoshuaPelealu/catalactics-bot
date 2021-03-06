import Discord, { Message, Channel, TextChannel }  from 'discord.js';
import lastCalled from '../data/lastCaller.json';
import commandUsed from './commandUsed';
import { getSettings } from './get-settings';
import { CommandsType } from './interfaces';
const logCommands = getSettings().LOG_COMMAND;


/**
 * Function that will log all the commands that are called
 * @param {Discord.Message} msg Discord Message Object
 * @param {Object} cmd Cmd Object
 * @param {Discord.Channel} ch Channel to log
 */
export default async function logCommand(msg: Message, cmd: CommandsType, channel: Channel): Promise<void> {

  // If the last logged author is not the same as the new author || the last author is empty/undefined
  const checks = lastCalled.author !== msg.author.toString() || lastCalled.author == '';
  // If the last logged command prefix is not the same as the new command prefix || the last prefix is empty/undefined
  const checksX = lastCalled.prefix !== cmd.prefix || lastCalled.prefix == '';
  // If the last logged author is the same as the new author AND(&&) the last logged prefix is the same as the new command prefix
  const check2 = lastCalled.author == msg.author.toString() && lastCalled.prefix == cmd.prefix;

  const overallCalledAmount = await commandUsed(msg, cmd);

  if(logCommands) {
    // check and checksX return true
    if (checks || checksX) {
      lastCalled.author = msg.author.toString();
      lastCalled.prefix = cmd.prefix;
      lastCalled.times = 1;
      const sent = await (channel as TextChannel)
        .send(
          new Discord.MessageEmbed()
            .setColor('#8238c7')
            .setTitle('Command Called')
            .setDescription(
              `Command: ${cmd.prefix}\n Called By: ${msg.author}\n Called Times: ${lastCalled.times}\n Overall Times Command Called On Server: ${overallCalledAmount}`
            )
        )
        .catch(err => console.error(err));
      lastCalled.id = (sent as Message).id;
      // else if check 2 returns true;
    } else if (check2) {
      lastCalled.times++;
      (channel as TextChannel).messages
        .fetch(lastCalled.id)
        .then(fetched =>
          fetched.edit(
            new Discord.MessageEmbed().setColor('#8238c7').setTitle('Command Called').setDescription(
              `Command: ${cmd.prefix}\n Called By: ${msg.author}\n Called Times: ${lastCalled.times}\n Overall Times Command Called On Server: ${overallCalledAmount}`
            )
          )
        )
      // If there is an error sending the message log it
        .catch(err => console.log(err));
    }
  } else return;

}

