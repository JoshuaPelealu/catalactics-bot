const { DiscordAPIError } = require("discord.js");

/**
 * Function checking if the user have specific permission
 * @param {Discord.Message} msg The msg object
 * @param {String} perm Permission String.
 */
function memberHasPerm(msg, perm) {
    if(msg.author.bot) return;
    let member = msg.member;
    if(typeof perm !== "string") return perm = perm.toString();
    if(member.hasPermission(perm)) return true;
    else return false;
}

//This function may be useful later
/*function hasRoleOrNot(msg) {
    let user = msg.author;
    let Role = mongoose.model("Role", roleSchema, msg.guild);
    if(msg.author.bot) return;
    let member = msg.member.roles.cache;
    let x;
    Role.find((err, data) => {
        for(let role of data) {
            if(member.has(role.roleId)) {
                x = true;
                break;
            } else {
                x = false;
            } 
        }
        data.forEach(role => {
            if(member.has(role.roleId)) return true;
            else return false;
        })
    } )
    return x;
}*/

module.exports = memberHasPerm;