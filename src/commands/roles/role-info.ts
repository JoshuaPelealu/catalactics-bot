import mongoose from 'mongoose';
import * as moment from 'moment';
import { Message, MessageEmbed, Role, PermissionString } from 'discord.js';
import { stripIndents } from 'common-tags';
import { getSettings } from '../../utils/get-settings';
import { roleSchema } from '../../index';
import { RolesDbInt, CommandsType } from '../../utils/interfaces';
const URI = getSettings().MONGO_URI;

mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(err => (err ? console.log(err) : undefined));

interface PermissionsInt {
    [key: string]: string;
}

const PERMS: PermissionsInt = {
    ADMINISTRATOR: 'Administrator',
	VIEW_AUDIT_LOG: 'View audit log',
	MANAGE_GUILD: 'Manage server',
	MANAGE_ROLES: 'Manage roles',
	MANAGE_CHANNELS: 'Manage channels',
	KICK_MEMBERS: 'Kick members',
	BAN_MEMBERS: 'Ban members',
	CREATE_INSTANT_INVITE: 'Create instant invite',
	CHANGE_NICKNAME: 'Change nickname',
	MANAGE_NICKNAMES: 'Manage nicknames',
	MANAGE_EMOJIS: 'Manage emojis',
	MANAGE_WEBHOOKS: 'Manage webhooks',
	VIEW_CHANNEL: 'Read text channels and see voice channels',
	SEND_MESSAGES: 'Send messages',
	SEND_TTS_MESSAGES: 'Send TTS messages',
	MANAGE_MESSAGES: 'Manage messages',
	EMBED_LINKS: 'Embed links',
	ATTACH_FILES: 'Attach files',
	READ_MESSAGE_HISTORY: 'Read message history',
	MENTION_EVERYONE: 'Mention everyone',
	USE_EXTERNAL_EMOJIS: 'Use external emojis',
	ADD_REACTIONS: 'Add reactions',
	CONNECT: 'Connect',
	SPEAK: 'Speak',
	MUTE_MEMBERS: 'Mute members',
	DEAFEN_MEMBERS: 'Deafen members',
	MOVE_MEMBERS: 'Move members',
	USE_VAD: 'Use voice activity',
};

const role_info: CommandsType = {
    prefix: 'role-info',
    additionalParam: '<Role>',
    desc: 'Give an info about the role',
    category: 'Information',
    command: async msg => {
        try {
            let mentioned = msg.mentions.roles.first();
            let text = msg.content.split(' ').slice(1).join(' ');

            let role = mentioned == undefined
                ? text == undefined
                    ? msg.guild!.roles.cache.find(role => role.name === "@everyone")
                    : msg.guild!.roles.cache.find(role => role.name.toLowerCase() == text)
                : msg.guild!.roles.cache.get(mentioned!.id);

            const permissions = Object.keys(PERMS).filter(
                // @ts-ignore
                (permission) => role.permissions.serialize()[permission],
            );


            let embed = new MessageEmbed()
            .setColor(role!.hexColor)
            .setThumbnail(msg.guild!.iconURL()!)
            .setDescription(`Info about **${role!.name}**`)
            .addField(
                'Info',
                stripIndents`
                • ID: ${role!.id}
                • Color: ${role!.hexColor} | The color of this embed.
                • Hoisted: ${role!.hoist ? 'Yes' : 'No'}
                • Raw Position: ${role!.rawPosition}
                • Mentionable: ${role!.mentionable ? 'Yes' : 'No'}
                • Date Created: ${moment.utc(role?.createdAt).format('YYYY/MM/DD')}
                • User Amount with Role: ${role!.members.size}
                \u200b
                `)
            .addField(
                'Permissions',
                stripIndents`
                ${permissions.map(permission => `• ${PERMS[permission]}`).join('\n') || 'None'}
                `, true
            )

            msg.channel.send(embed);
        } catch (err) {
            console.error(err);
        }
    }
}

export default role_info;
