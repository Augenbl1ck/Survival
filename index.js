//SetLOGIN
require('dotenv').config();
const token = process.env.DISCORD_TOKEN;
const botversion = "Version " + process.env.VERSION
const botak = process.env.BOT
const { Client,AttachmentBuilder, GatewayIntentBits, ChannelType, REST, Routes, SlashCommandBuilder, PermissionFlagsBits,EmbedBuilder, ButtonBuilder, SelectMenuBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuBuilder, messageLink , ModalBuilder, TextInputBuilder,TextInputStyle, Colors, Embed, UserSelectMenuBuilder, PermissionsBitField } = require('discord.js');
const { createTranscript } = require("discord-html-transcripts")

const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
] });

const fs = require("fs")
const path = require('path');
let Canvacord = require("canvacord")

const warnjson = require("./warnings.json");
const settings = require("./settings.json");
const tempjson = require("./tempbans.json");
const xpdata = require("./xpdata.json");
const guildfile = require("./tstate.json");
const voicedata = require("./voicedata.json")

const regelEmbedCommand = new SlashCommandBuilder()
.setName('regel')
.setDescription('Regel Embed')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setDMPermission(false)

const whitelistEmbedCommand = new SlashCommandBuilder()
.setName('whitelistembed')
.setDescription('Whitelist Embed')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setDMPermission(false)

const wartungenCommand = new SlashCommandBuilder()
.setName('wartungen')
.setDescription('Setzt den Bot in Wartungen. Only Augenblick')
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setDMPermission(false)

const poggers = new SlashCommandBuilder()
.setName('poggers')
.setDescription('Poggers')
.setDMPermission(false)

const banCommand = new SlashCommandBuilder()
.setName('ban')
.setDescription('Bann a Member')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to ban')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for banning'))
.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
.setDMPermission(false)

const tempBanCommand = new SlashCommandBuilder()
.setName('tempban')
.setDescription('Tempban a Member')
.addUserOption(option =>
    option
        .setName('target')
        .setDescription('The member to tempban')
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('timeindication')
        .setDescription('Days/Minutes')
        .addChoices(
            { name: 'Days', value: 'tempban_days' },
            { name: 'Minutes', value: 'tempban_min' }
        )
        .setRequired(true))
.addIntegerOption(option =>
    option
        .setName('number')
        .setDescription('Number of Days/Minutes')
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('reason')
        .setDescription('The reason for tempbanning'))
.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
.setDMPermission(false)

const unbanCommand = new SlashCommandBuilder()
.setName('unban')
.setDescription('Unban a Member')
.addStringOption(option =>
    option
        .setName('targetid')
        .setDescription('The memberid to unban')
        .setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
.setDMPermission(false)

const kickCommand = new SlashCommandBuilder()
.setName('kick')
.setDescription('Kick a Member')
.addUserOption(option =>
    option
        .setName('target')
        .setDescription('The member to kick')
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('reason')
        .setDescription('The reason for kicking'))
.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
.setDMPermission(false)

const userInfoCommand = new SlashCommandBuilder()
.setName('userinfo')
.setDescription('Userinfo about a Member')
.addUserOption(option =>
    option
        .setName('target')
        .setDescription('The member')
        .setRequired(true))
.setDMPermission(false)


const roleInfoCommand = new SlashCommandBuilder()
.setName('roleinfo')
.setDescription('Roleinfo about a Role')
.addRoleOption(option =>
    option
        .setName('target')
        .setDescription('The role')
        .setRequired(true))
.setDMPermission(false)

const serverInfoCommand = new SlashCommandBuilder()
.setName('serverinfo')
.setDescription('Serverinfo about this Server')
.setDMPermission(false)

const empCommand = new SlashCommandBuilder()
.setName('emp')
.setDescription('Only Augenblick')
.setDMPermission(false)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

const ticketempCommand = new SlashCommandBuilder()
.setName('ticketemp')
.setDescription('Only Augenblick')
.setDMPermission(false)
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

const clearCommand = new SlashCommandBuilder()
.setName('clear')
.setDescription('Clear Messages')
.addIntegerOption(option =>
    option
        .setName('number')
        .setDescription('Number of Messages')
        .setRequired(true))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.setDMPermission(false)

const rankCommand = new SlashCommandBuilder()
.setName('rank')
.setDescription('Your/Members rank')
.addUserOption(option =>
    option
        .setName('target')
        .setDescription('Members rank'))
.setDMPermission(false)

const embedCommand = new SlashCommandBuilder()
.setName('embed')
.setDescription('Send a custom Embed in a Channel')
.addChannelOption(option =>
    option
        .setName('channel')
        .setDescription('Channel for send')
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('title')
        .setDescription('Embed Title')
        .setMaxLength(200)
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('description')
        .setDescription('Embed Description')
        .setMaxLength(4000)
        .setRequired(true))
.addStringOption(option =>
    option
        .setName('timestamp')
        .setDescription('Embed Timestamp Yes/No')
        .addChoices(
            { name: 'Yes', value: 'embed_timestamp_yes' },
            { name: 'No', value: 'embed_timestamp_no' },
        )
        .setRequired(true))
.addRoleOption(option =>
    option
        .setName('roleping')
        .setDescription('Ping a Role'))
.addStringOption(option =>
    option
        .setName('footer')
        .setMaxLength(1000)
        .setDescription('Embed Footer'))
.addStringOption(option =>
    option
        .setName('footericonurl')
        .setDescription('Embed Footer Icon'))
.addStringOption(option =>
    option
        .setName('color')
        .setDescription('Embed Color'))
.addStringOption(option =>
    option
        .setName('thumpnailurl')
        .setDescription('Embed Thumnail'))
.addStringOption(option =>
    option
        .setName('pictureurl')
        .setDescription('Embed Picture'))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
.setDMPermission(false)

const pingCommand = new SlashCommandBuilder()
.setName('ping')
.setDescription('Pong')
.setDMPermission(false)

const setSlowModeCommand = new SlashCommandBuilder()
.setName('slowmode')
.setDescription('Set Slowmode Off/Time')
.addStringOption(option =>
    option
        .setName('time')
        .setDescription('The time of Slowmode')
        .setRequired(true)
        .addChoices(
            { name: 'Off', value: 'slowmode_off' },
            { name: '5s', value: 'slowmode_5s' },
            { name: '10s', value: 'slowmode_10s' },
            { name: '15s', value: 'slowmode_15s' },
            { name: '30s', value: 'slowmode_30s' },
            { name: '1m', value: 'slowmode_1m' },
            { name: '2m', value: 'slowmode_2m' },
            { name: '5m', value: 'slowmode_5m' },
            { name: '10m', value: 'slowmode_10m' },
            { name: '15m', value: 'slowmode_15m' },
            { name: '30m', value: 'slowmode_30m' },
            { name: '1h', value: 'slowmode_1h' },
            { name: '2h', value: 'slowmode_2h' },
            { name: '6h', value: 'slowmode_6h' },
        ))
.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
.setDMPermission(false)

const warnCommand = new SlashCommandBuilder()
.setName('warn')
.setDescription('Warn a Member')
.addSubcommand(subcommand => 
    subcommand
        .setName('add')
        .setDescription('Give a Member a Warning')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('The reason for warning'))
        .addNumberOption(option => 
            option
                .setName(`duration`)
                .setDescription(`How long should the warn last`)
        ))
.addSubcommand(subcommand =>
    subcommand
        .setName('remove')
        .setDescription('Remove a Member a Warning')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to warn')
                .setRequired(true))
        .addIntegerOption(option =>
            option
                .setName('number')
                .setDescription('How many do you want to remove')
                .setRequired(true)))
.addSubcommand(subcommand =>
    subcommand
        .setName('show')
        .setDescription('Show how many Warnings the member have')
        .addUserOption(option =>
            option
                .setName('target')
                .setDescription('The member to warn')
                .setRequired(true)))

.setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
.setDMPermission(false)

const setCommand = new SlashCommandBuilder()
.setName('settings')
.setDescription('Server Setting')
.addSubcommand(subcommand => 
    subcommand
        .setName('welcome')
        .setDescription("Sets the Welcome Embed")
        .addStringOption(option =>
            option
                .setName('setting')
                .setDescription('The Setting')
                .setRequired(true)
                .addChoices(
                    { name: 'Title', value: 'set_welcome_title' },
                    { name: 'Description', value: 'set_welcome_description' },
                    { name: 'Footer', value: 'set_welcome_footer' },
                    { name: 'Color', value: 'set_welcome_color' },
                    { name: 'Thumpnail', value: 'set_welcome_thumpnail' },
                    { name: 'Timestamp', value: 'set_welcome_timestamp' },
                    { name: 'Channel', value: 'set_welcome_channel' },
                )))
.addSubcommand(subcommand => 
    subcommand
        .setName('leave')
        .setDescription("Sets the Leave Embed")
        .addStringOption(option =>
            option
                .setName('setting')
                .setDescription('The Setting')
                .setRequired(true)
                .addChoices(
                    { name: 'Title', value: 'set_leave_title' },
                    { name: 'Description', value: 'set_leave_description' },
                    { name: 'Footer', value: 'set_leave_footer' },
                    { name: 'Color', value: 'set_leave_color' },
                    { name: 'Thumpnail', value: 'set_leave_thumpnail' },
                    { name: 'Timestamp', value: 'set_leave_timestamp' },
                    { name: 'Channel', value: 'set_leave_channel' },
                )))
.addSubcommand(subcommand => 
    subcommand
        .setName('rank')
        .setDescription("Set the Rank System")
        .addStringOption(option =>
            option
                .setName('setting')
                .setDescription('The Setting (If URL Nothing -> Color Black | usercolor -> Display Color of User)')
                .setRequired(true)
                .addChoices(
                    { name: 'SystemRankChannel', value: 'XPSystemChannel'},
                    { name: 'SystemBildLevelNumberColor', value: 'SystemBildLevelNumber' },
                    { name: 'SystemBildLevelColor', value: 'SystemBildLevel' },
                    { name: 'SystemBildRankNumberColor', value: 'SystemBildRankNumber' },
                    { name: 'SystemBildRankColor', value: 'SystemBildRank' },
                    { name: 'SystemBildCurrentXPColor', value: 'SystemBildCurrentXPColor' },
                    { name: 'SystemBildRequiredXPColor', value: 'SystemBildRequiredXPColor' },
                    { name: 'SystemBildUsernameColor', value: 'SystemBildUsernameColor' },
                    { name: 'SystemBildDiscriminatorColor', value: 'SystemBildDiscriminatorColor' },
                    { name: 'SystemBildOverlayColor', value: 'SystemBildOverlayColor' },
                    { name: 'SystemBildProgressbarTrackColor', value: 'SystemBildProgressbarTrack' },
                    { name: 'SystemBildPictureURL', value: 'SystemBildPictureURL'},
                ))
        .addStringOption(option =>
            option
                .setName('input')
                .setDescription('The Settinginput')
                .setRequired(true)))
.addSubcommand(subcommand => 
    subcommand
        .setName('system')
        .setDescription("System Settings")
        .addStringOption(option =>
            option
                .setName('setting')
                .setDescription('The Setting')
                .setRequired(true)
                .addChoices(
                    { name: 'Rank', value: 'set_system_rank' },
                    { name: 'Rank System Settings', value: 'XPSystemSettings' },
                    { name: 'Color', value: 'set_system_color' },
                    { name: 'Ephemeral', value: 'set_system_ephemeral' },
                )))
.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
.setDMPermission(false)
const commands = [/*helpCommand, */wartungenCommand, whitelistEmbedCommand, poggers, regelEmbedCommand, ticketempCommand, embedCommand, empCommand, banCommand, kickCommand, warnCommand, setCommand, tempBanCommand, clearCommand, pingCommand, unbanCommand, roleInfoCommand, serverInfoCommand, userInfoCommand, setSlowModeCommand];
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
      console.log('Started refreshing application (/) commands.');
  
      await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  
      console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
      console.error(error);
    }
})();


client.on('ready', () => {
    console.log(`\nLogged in as ${client.user.username}! ${botversion}`);

    setInterval(() => {
        client.guilds.cache.forEach(async guild => {
            if(settings[guild.id] == undefined){
                console.log(`Settings für ${guild.name}`)

                settings[guild.id] = {
                    "MissingPermissions": false,
                    "System": false,
                    "Name": guild.name,

                    "JoinTitle": "Welcome",
                    "JoinDescription": "Welcome {user.username} to {guild.name}",
                    "JoinColor": "#7CFC00",
                    "JoinFooter": "Welcome Message",
                    "JoinFooterBild": "false",
                    "JoinTimestamp": "true",
                    "JoinThumpnail": "true",
                    "JoinChannel": "false",

                    "LeaveTitle": "Leave",
                    "LeaveDescription": "The user ${user.username} has leaved the Server",
                    "LeaveColor": "#FF4500",
                    "LeaveFooter": "Leave Message",
                    "LeaveFooterBild": "false",
                    "LeaveTimestamp": "true",
                    "LeaveThumpnail": "true",
                    "LeaveChannel": "false",

                    "SystemColor": "#FF00FF",
                    "SystemEphemeral": "true",
                    "SystemGlobalBan": "false",
                    "SystemXP": false,
                    "SystemXPDuration": 1,
                    "SystemXPPerMessageMin": 15,
                    "SystemXPPerMessageMax": 30,
                    "SystemXPErhöhung": 0.55,
                    "SystemBildLevelNumber": "#FF4500",
                    "SystemBildLevel": "#FF00FF",
                    "SystemBildRankNumber": "#FF4500",
                    "SystemBildRank": "#FF00FF",
                    "SystemBildCurrentXPColor": "#FF00FF",
                    "SystemBildRequiredXPColor": "#FF00FF",
                    "SystemBildUsernameColor": "#FF00FF",
                    "SystemBildDiscriminatorColor": "#FF00FF",
                    "SystemBildPictureURL": "#2B2B2B",
                    "SystemBildOverlay": "#000000",
                    "SystemBildProgressbarTrack": "#484b4E",
                    "SystemWartungen": false,
                }

            }else{
                if(settings[guild.id]["System"] == false){
                    client.user.setActivity(`Mutanten ausknocken. ${botversion}`);
                    client.user.setStatus("dnd")
                }else{
                    client.user.setStatus("invisible")
                }
            }

            guild.members.cache.forEach(member => {
                if(voicedata[member.id] == undefined){
                    voicedata[member.id] = {
                        "lastjoin": 0,
                    }
                }else{
                    if(new Date().getTime() - voicedata[member.id]["lastjoin"] > 1000 * 60 * 5){
                        voicedata[member.id]["lastjoin"] = 0
                    }
                }

                fs.writeFileSync(path.resolve(__dirname, "./voicedata.json"), JSON.stringify(voicedata, null, 4), err =>{
                    if(err){
                        console.log(err);
                    }
                });
            })

            guild.channels.cache.forEach(channel =>{
                if(!channel.isTextBased()) return;
                if(channel.isVoiceBased()) return;
                if(channel.isThread()) return;
                if(channel.isDMBased()) return;

                if(settings[guild.id]["XPSystemChannel"]){
                    if(!settings[guild.id]["XPSystemChannel"][channel.id]){
                        settings[guild.id] = {
                            ...settings[guild.id],
                            "XPSystemChannel": {
                                ...settings[guild.id]["XPSystemChannel"],
                                [channel.id]: {
                                    "aktiv": false,
                                }
                            }
                        }
                    }

                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }else{
                    settings[guild.id] = {
                        ...settings[guild.id],
                        "XPSystemChannel": {
                            ...settings[guild.id]["XPSystemChannel"],
                            [channel.id]: {
                                "aktiv": false,
                            }
                        }
                    }

                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            })
            
            let fetchBans;
            try {
                let fetchBans = await guild.bans.fetch()

                if(settings[guild.id]["MissingPermissions"] == true){
                    settings[guild.id]["MissingPermissions"] = false

                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }

                fetchBans.forEach(member =>{
                    let user = member.user

                    if(user.id == undefined) return;
                    if(tempjson[guild.id] == undefined) return;
                    if(tempjson[guild.id][user.id]["Rechnung"] == null) return;

                    if((new Date().getTime() - tempjson[guild.id][user.id]["Duration"] > tempjson[guild.id][user.id]["Rechnung"])){
                        guild.members.unban(user).catch(err =>{
                            if(err) return;
                        })

                        console.log(`User ${user.username} entbannt`)

                        tempjson[guild.id][user.id] = {};

                        fs.writeFileSync(path.resolve(__dirname, "./tempbans.json"), JSON.stringify(tempjson, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                })
            } catch (error) {
                if(error){
                    settings[guild.id]["MissingPermissions"] = true
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                    return;
                }
            }
        })
    }, 1000 * 5);
});

client.on("messageDelete", async message => {
    if(message.author.bot) return;
    if(!message.member) return;
    if(settings[message.guild.id]["SystemWartungen"] == true && botak == "Server") return;

    if(message.channelId !== "1076533935221252217" && message.channelId !== "1076532760644157531" && message.channelId !== "1078794326890524703" && message.channelId !== "1076516666554466315"){
        let logchannel = message.guild.channels.cache.find(ct => ct.id == "1125441024899162122")
        let embedlog = new EmbedBuilder()
            .setTitle(`${message.author.username} ${message.member.nickname !== undefined ? `(${message.member.nickname})` : ``}`)
            .setDescription(`${message.content.toString()}\n\nKategorie: ${message.channel.parent}\nChannel: ${message.channel}\nHighest Role: ${message.member.roles.highest.id == "1043823096626434130" ? "/" : `<@&${message.member.roles.highest.id}>`}`)
            .setColor(Colors.Red)
            .setThumbnail(message.author.avatarURL())
            .setFooter({
                text: `Delete`,
            })
            .setTimestamp()

        logchannel.send({embeds: [embedlog]})   
    }
})

client.on("messageCreate", async message => {
    if(message.author.bot) return;
    if(settings[message.guild.id]["SystemWartungen"] == true && botak == "Server") return;
    if(message.channel.id !== "1076533935221252217" && message.channel.id !== "1076532760644157531" && message.channel.id !== "1078794326890524703" && message.channel.id !== "1076516666554466315"){
        let logchannel = message.guild.channels.cache.find(ct => ct.id == "1125441024899162122")
        let embedlog = new EmbedBuilder()
            .setTitle(`${message.author.username} ${message.member.nickname !== undefined ? `(${message.member.nickname})` : ``}`)
            .setDescription(`${message.content.toString()}\n\nKategorie: ${message.channel.parent}\nNachricht: ${message.url}\nHighest Role: ${message.member.roles.highest.id == "1043823096626434130" ? "/" : `<@&${message.member.roles.highest.id}>`}`)
            .setColor(Colors.Green)
            .setThumbnail(message.author.avatarURL())
            .setFooter({
                text: `Write`,
            })
            .setTimestamp()

        logchannel.send({embeds: [embedlog]})   
    }

    let mLC = message.content.toLowerCase()

    if(message.channel.id == "1076493152963272727"){
        let row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setLabel("TikTok Kanal")
                .setStyle(ButtonStyle.Link)
                .setEmoji("<:logo:1104742671450394755>")
                .setURL("https://www.tiktok.com/@fallout.survival")
            )
    
        if(mLC.includes("whitelist") && (mLC.includes("wie") || mLC.includes("bekomme") || mLC.includes("lassen") || mLC.includes("kriegen") || mLC.includes("rolle"))){
            
            message.reply({content: `Wie kannst du dich Whitelisten lassen?\n\n<#1076529923306561648> lesen, alles weitere findest du dort. Weiteres Wissenswertes findest du in <#1100120179360419920> oder auf unserem TikTok Kanal.`, components: [row]})
        }

        if(mLC.includes("server") && (mLC.includes("komme") || mLC.includes("joine") || mLC.includes("beitreten") || mLC.includes("rolle") || mLC.includes("joint"))){
            message.reply({content: `Wie kommst du auf den Server?\n\nDu musst dich Whitelisten lassen also lese <#1076529923306561648>, alles weitere findest du dort. Weiteres Wissenswertes findest du in <#1100120179360419920> oder auf unserem TikTok Kanal.`, components: [row]})
        }

        if(mLC.includes("teamspeak") || mLC.includes(" ts ") && (mLC.includes("ip") || mLC.includes("adresse") || mLC.includes("was") || mLC.includes("lautet") || mLC.includes("link"))){
            message.reply({content: `Usere TeamSpeak Ip ist <#1076535780824064112>. Weiteres Wissenswertes findest du in <#1100120179360419920> oder auf unserem TikTok Kanal.`, components: [row]})
        }
    }

    if(settings[message.guild.id]["System"] == true) return;
    if(settings[message.guild.id]["SystemXP"] == false) return
    if(settings[message.guild.id]["XPSystemChannel"][message.channel.id] == undefined){
    }else{
        if(settings[message.guild.id]["XPSystemChannel"][message.channel.id]["aktiv"] == true){
            if(!xpdata[message.guild.id]){
                xpdata[message.guild.id] = {
                    [message.author.id]: {
                        "XP": 0,
                        "Level": 1,
                        "BisLevel": 100,
                        "NächsteXP": 0,
                        "XPIns": 0,
                    }
                }
            }else{
                if(!xpdata[message.guild.id][message.author.id]){
                    xpdata[message.guild.id] = {
                        ...xpdata[message.guild.id],
                        [message.author.id]: {
                            "XP": 0,
                            "Level": 1,
                            "BisLevel": 100,
                            "NächsteXP": 0,
                            "XPIns": 0,
                        }
                    }
                }
            }
    
            fs.writeFileSync(path.resolve(__dirname, "./xpdata.json"), JSON.stringify(xpdata, null, 4), err =>{
                if(err){
                    console.log(err);
                }
            });
    
            if(!(new Date().getTime() - xpdata[message.guild.id][message.author.id]["NächsteXP"] > 1000 * 60 * settings[message.guild.id]["SystemXPDuration"] || xpdata[message.guild.id][message.author.id]["NächsteXP"] == 0)) return;
    
            let currentxp = xpdata[message.guild.id][message.author.id]["XP"]
            let bislevel = xpdata[message.guild.id][message.author.id]["BisLevel"]
            let newxp = Math.floor(Math.random() * (settings[message.guild.id]["SystemXPPerMessageMax"] - settings[message.guild.id]["SystemXPPerMessageMin"])) + settings[message.guild.id]["SystemXPPerMessageMin"]
            let erhöhung = bislevel * settings[message.guild.id]["SystemXPErhöhung"]
            if(currentxp + newxp > bislevel){
                xpdata[message.guild.id][message.author.id]["BisLevel"] = bislevel + erhöhung
                xpdata[message.guild.id][message.author.id]["Level"] += 1
                xpdata[message.guild.id][message.author.id]["XP"] = (currentxp + newxp) - bislevel
                xpdata[message.guild.id][message.author.id]["XPIns"] += newxp
            }else{
                xpdata[message.guild.id][message.author.id]["XP"] += newxp
                xpdata[message.guild.id][message.author.id]["XPIns"] += newxp
            }
    
            xpdata[message.guild.id][message.author.id]["NächsteXP"] = new Date().getTime()
    
            fs.writeFileSync(path.resolve(__dirname, "./xpdata.json"), JSON.stringify(xpdata, null, 4), err =>{
                if(err){
                    console.log(err);
                }
            });
        }
    }
})

client.on("voiceStateUpdate", async (oldState, newState) => {
    if(settings[newState.guild.id]["SystemWartungen"] == true && botak == "Server") return;
    if(settings[newState.guild.id]["System"] == true) return;
    if(!newState.channel){
        if(oldState.channel.parentId == "1125041734947180575"){
            oldState.channel.permissionOverwrites.delete(oldState.member.id)
        }
    }else if(newState.channel.parentId == "1125041734947180575"){
        newState.channel.permissionOverwrites.edit(newState.member.id, { Connect: true, Speak: true, Stream: true, ViewChannel: true});

        if(oldState.channel !== null){
            oldState.channel.permissionOverwrites.delete(oldState.member.id)
        }
    }
    
    if(newState.channel == null) return;
    if(newState.channel.id == "1076536635497386084" || newState.channel.id == "1137101763174998017"){
        if(newState.member == undefined || newState.member == null) return;
        let channel = newState.guild.channels.cache.find(ct => ct.id == "1102197167990513774")
        let embed = new EmbedBuilder()
            .setTitle(`Support Warteraum`)
            .setDescription(`Der User ${newState.member.user.username} hat den ${newState.channel.id == "1076536635497386084" ? `Support` : `Whitelist`} Warteraum betreten\n\nUser: ${newState.member.user}\nID: ${newState.member.user.id}\nJoined: <t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - newState.member.joinedTimestamp / 1000)}:R>`)
            .setColor(settings[newState.guild.id]["SystemColor"])
            .setThumbnail(client.user.avatarURL())
            .setFooter({
                text: `Fallout Survival`,
                iconURL: client.user.avatarURL(),
            })
            .setTimestamp()

        if(voicedata[newState.member.id] == undefined  || voicedata[newState.member.id]["lastjoin"] == 0){
            voicedata[newState.member.id]["lastjoin"] = new Date().getTime()

            channel.send({content: `<@&1077220393775017995>`, embeds: [embed]})
        }else{
            if(new Date().getTime() - voicedata[newState.member.id]["lastjoin"] > 1000 * 60 * 2){
                voicedata[newState.member.id]["lastjoin"] = new Date().getTime()

                channel.send({content: `<@&1077220393775017995>`, embeds: [embed]})
            }else{
                voicedata[newState.member.id]["lastjoin"] = new Date().getTime()
            }
        }

        fs.writeFileSync(path.resolve(__dirname, "./voicedata.json"), JSON.stringify(voicedata, null, 4), err =>{
            if(err){
                console.log(err);
            }
        });
    }
})

function msgCollection(message, lastMsg, writeMsg, users) {
    let overflowToggle = true;
    //  Works Reverse Chronologically:  It Grabs Recent Messages First and Works Backwards.
    message.channel.messages.fetch({ limit: 100, before: lastMsg })
    .then(messages => {
        messages.forEach((message, index)=>{  //  Funnels the last 100 Messages into an Array
            writeMsg.push(`${message.author.username} (${message.createdAt.toString().replace(" GMT+0200 (Mitteleuropäische Sommerzeit)", "")}): ${message.content}`);  //  Writes the Message Author and Content to an Array
            if(!users.includes(message.author.id)){
                if(message.author.id == client.user.id) return;
                users.push(`${message.author.id}`)
            }

            //  Checks if a Text Channel has more than 100 Messages and Recursively Readies the Second Block of 100 Messages
            if (index == 99) {
                lastMsg = message.id;
                overflowToggle = false;  //  Toggle to Make Sure All Messages are Collected in The Array Prior to being Written to a File.
                msgCollection(message, lastMsg, writeMsg, users)
            }
        })
        writeToFile(message, writeMsg, overflowToggle, users);  //  Sends the Array to be Written to a File
    })
    .catch(console.error);  //  Catches Promise Errors
}

function writeToFile(message, writeMsg, overflowToggle) {
    let fileName = "./transkript/" + message.channel.name + '.txt';
    if (overflowToggle == true) {
        let file = ""
        for (i = writeMsg.length -1; i >= 0; i--) {
            file = file + writeMsg[i].toString() + "\n"
        }

        fs.appendFile(fileName, file, (err) => {
            if (err) throw err;
        })
    }
}
  
client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()){
        if(interaction.commandName == "wartungen" && botak == "Server"){
            if(settings[interaction.guild.id]["SystemWartungen"] == true){
                settings[interaction.guild.id]["SystemWartungen"] = false
                interaction.reply({content: "Der Bot befindet sich nun nicht mehr in Wartungen", ephemeral: true})
            }else{
                settings[interaction.guild.id]["SystemWartungen"] = true
                interaction.reply({content: "Der Bot befindet sich nun in Wartung", ephemeral: true})
            }
            fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                if(err){
                    console.log(err);
                }
            });
            return
        }
    }
    if(settings[interaction.guild.id]["SystemWartungen"] == true && botak == "Server"){
        interaction.channel.send({content: "Aktuell befindet sich der Bot in Wartungen", ephemeral: true})
        console.log("Wartungen")
        return
    }else{
        try {
            if(settings[interaction.guild.id]["System"] == true){
                if(interaction.isModalSubmit()){
                    if(interaction.customId == "poggers_modal"){
                        let input1 = interaction.fields.getTextInputValue(`poggers_input`)
        
                        if(input1 !== "79897") return interaction.reply({content: "Falsch", ephemeral: true})
        
                        if(settings[interaction.guild.id]["System"] == false){
                            settings[interaction.guild.id]["System"] = true
                            client.user.setStatus("invisible")
                            interaction.reply({content: "Set True", ephemeral: true})
                        }else{
                            settings[interaction.guild.id]["System"] = false
                            client.user.setActivity(`Mutanten ausknocken`);
                            client.user.setStatus("dnd")
                            interaction.reply({content: "Set False", ephemeral: true})
                        }
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if (interaction.isChatInputCommand()){
                    if(interaction.commandName === 'poggers'){
                        const modal = new ModalBuilder()
                        .setCustomId(`poggers_modal`)
                        .setTitle(`Passwort?`);
        
                        const set_poggers_input1 = new TextInputBuilder()
                            .setCustomId("poggers_input")
                            .setLabel(`Passort eingeben`)
                            .setMinLength(1)
                            .setStyle(TextInputStyle.Short);
        
                        let ActionRow1 = new ActionRowBuilder().addComponents(set_poggers_input1);
                        
                        modal.addComponents(ActionRow1);
        
                        interaction.showModal(modal)
                        return;
                    }
                    return;
                }
                return;
            }
            if(interaction.isAnySelectMenu()){
                if(interaction.customId == "whitelistroleuser"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    let whitelistrole = interaction.guild.roles.cache.find(r => r.id === "1124973181871071273")
                    let whitelistroleuser = interaction.member.roles.cache.find(r => r.id === "1124973181871071273")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let input1 = interaction.values

                    let user = interaction.guild.members.cache.find(user => user.id == input1)
                    
                    if(whitelistroleuser == undefined){
                        interaction.reply({content: `${user} besitzt bereits die Whitelist`, ephemeral: true})
                    }else{
                        user.roles.add(whitelistrole)
    
                        interaction.reply({content: `Der User ${user} besitzt nun die Whitelist`, ephemeral: true})

                        let whitelistlog = interaction.guild.channels.cache.find(r => r.id === "1142781964273856552")

                        let embed = new EmbedBuilder()
                        .setTitle(`Whitelist - ${user.user.username.toLocaleUpperCase()}`)
                        .setDescription(`Der Teamler ${interaction.user} **(${interaction.user.username})** mit der ID **${interaction.member.id}** hat ${user} **(${user.user.username})** die Whitelist gegeben. \n\nID: ${interaction.user.id}\nJoined: <t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - interaction.member.joinedTimestamp / 1000)}:R>`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                        whitelistlog.send({embeds: [embed]})
                    }
                }
                if(interaction.customId == "ticketadduser"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let input1 = interaction.values

                    let userlist = ""
                    for (let index = 0; index < input1.length; index++) {
                        interaction.channel.permissionOverwrites.edit(input1[index], { ViewChannel: true, SendMessages: true });
                        userlist = userlist + `<@${input1[index]}>, `
                    }

                    interaction.reply({content: `Die User ${userlist} wurden dem Ticket hinzugefügt. \n\n**Bitte bedenke, dass du die User manuell wieder über __📍Remove User__ entfernen musst. Beim claimen werden __nur__ die __Team Rollen__ überschrieben**`, ephemeral: true})
                    interaction.message.delete()
                }
                if(interaction.customId == "ticketremoveuser"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let input1 = interaction.values

                    let userlist = ""
                    for (let index = 0; index < input1.length; index++) {
                        interaction.channel.permissionOverwrites.edit(input1[index], { ViewChannel: false});
                        userlist = userlist + `<@${input1[index]}>, `
                    }

                    interaction.reply({content: `Die User ${userlist} wurden aus dem Ticket entfernt`, ephemeral: true})
                    interaction.message.delete()
                }
                if(interaction.customId == "ticketMenu"){
                    let s = interaction.values
                    let categoryfilter = s.toString().replace(" ", "")
                    let category = interaction.guild.channels.cache.find(ct => ct.name === `${categoryfilter} Ticket` && ct.type === ChannelType.GuildCategory)

                    if(!guildfile[interaction.guild.id]){
                        guildfile[interaction.guild.id] = {
                            "Ticketnummer": 1,
                        }
                    }

                    fs.writeFileSync(path.resolve(__dirname, "./tstate.json"), JSON.stringify(guildfile, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });

                    let embed = new EmbedBuilder()
                        .setTitle(`Ticket - ${guildfile[interaction.guild.id].Ticketnummer} - ${s}`)
                        .setDescription(`Hallo ${interaction.user},\nes wird sich innerhalb 72 Stunden jemand um dich kümmern. Bitte schildere in der Zeit bitte schon einmal dein Anliegen.\nNotiere dir bitte deine Ticket Nummer und hebe sie für weitere Verläufe auf: **Ticket - ${guildfile[interaction.guild.id].Ticketnummer}**\n\nTicketart: ${s}\nErsteller: ${interaction.user}\nID: ${interaction.user.id}\nJoined: <t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - interaction.member.joinedTimestamp / 1000)}:R>`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
                    
                    let rechte
                    if(s.toString().toLowerCase() == "allgemein"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076541418119647272",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076506247232237609",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "bug report"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1111724241432354987",
                                allow:[PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1126403209464918098",
                                allow:[PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1126458798773653545",
                                allow:[PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "fahrzeuge"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1111724241432354987",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "beschwerden"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            }
                        ]
                    }
                    if(s.toString().toLowerCase() == "rückerstattungen ic"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "entbannungsanträge"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "fraktion"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1122960864656502897",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "streampartnerschaft"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076541418119647272",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076506247232237609",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }
                    if(s.toString().toLowerCase() == "bewerbung"){
                        rechte = [
                            {
                                id: interaction.guild.id,
                                deny:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel],
                            },
                            {
                                id: interaction.user.id,
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                            {
                                id: "1076534492535201812",
                                allow:[PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ViewChannel]
                            },
                        ]
                    }

                    await interaction.guild.channels.create({
                        name: `ticket-${guildfile[interaction.guild.id].Ticketnummer}-${s.toString().toLowerCase()}`,
                        type: ChannelType.GuildText,
                        parent: category,
                        permissionOverwrites: rechte,
                    }).then(async channel =>{
                        let row1 = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("ticketclose")
                            .setLabel("Ticket Schließen")
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji("🛡")
                        )
                        if(s.toString().toLowerCase() !== "beschwerden"){
                            row1.addComponents(
                                new ButtonBuilder()
                                .setCustomId("ticketclaim")
                                .setLabel("Ticket Claimen")
                                .setStyle(ButtonStyle.Secondary)
                                .setEmoji("🔐")
                            )
                        }
                        row1
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("ticketadduserlist")
                            .setLabel("Add User")
                            .setStyle(ButtonStyle.Success)
                            .setEmoji("📍")
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setCustomId("ticketremoveuserlist")
                            .setLabel("Remove User")
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji("✂️")
                        )

                        interaction.reply({content: `Du hast das Ticket: ${channel} erstellt`, ephemeral: true})

                        await channel.send({embeds: [embed], components: [row1]}).then(msg => {
                            msg.pin()
                        })

                        guildfile[interaction.guild.id].Ticketnummer = guildfile[interaction.guild.id].Ticketnummer + 1

                        fs.writeFileSync(path.resolve(__dirname, "./tstate.json"), JSON.stringify(guildfile, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    })
                }

                if(interaction.customId == "pingMenu"){
                    let role = interaction.guild.roles.cache.find(ch => ch.id == "1077982135262126120");
                    let role2 = interaction.guild.roles.cache.find(ch => ch.id == "1138497890470346873");
                    let roleMember = interaction.member.roles.cache.find(ch => ch.id == "1077982135262126120");
                    let roleMember2 = interaction.member.roles.cache.find(ch => ch.id == "1138497890470346873");
                    let s = interaction.values

                    if(s.includes("first_option")){
                        if(!roleMember){
                            interaction.member.roles.add(role)
                        }
                    }else{
                        if(roleMember){
                            interaction.member.roles.remove(role)
                        }
                    }

                    if(s.includes("second_option")){
                        if(!roleMember2){
                            interaction.member.roles.add(role2)
                        }
                    }else{
                        if(roleMember2){
                            interaction.member.roles.remove(role2)
                        }
                    }

                    interaction.reply({content: `Du bekommst nun die ausgewählten Pings`, ephemeral: true})
                    interaction.message.edit({content: ``})
                }

                return;
            }

            if(interaction.isButton()){
                if(interaction.customId == "ticketadduserlist"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let channel = interaction.channel

                    let row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId("ticketadduser")
                            .setPlaceholder("Keinen User ausgewählt")
                            .setMaxValues(25)
                    )

                    let embed = new EmbedBuilder()
                        .setTitle(`Add User - ${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}`)
                        .setDescription(`Wähle die User aus die dieses Ticket sehen sollen.\n\n**Bitte bedenke, dass du die User manuell wieder über __✂️Remove User__ entfernen musst. Beim claimen werden __nur__ die __Team Rollen__ überschrieben**`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                    interaction.reply({embeds: [embed], components: [row]})
                }
                if(interaction.customId == "ticketremoveuserlist"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let channel = interaction.channel

                    let row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId("ticketremoveuser")
                            .setPlaceholder("Keinen User ausgewählt")
                            .setMaxValues(25)
                    )

                    let embed = new EmbedBuilder()
                        .setTitle(`Remove User - ${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}`)
                        .setDescription(`Wähle die User aus die dieses Ticket nicht mehr sehen sollen`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                    interaction.reply({embeds: [embed], components: [row]})
                }

                if(interaction.customId == "ticketclose"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    interaction.reply({content: `Das Ticket wird in 10s gelöscht... <#1113039541750739025>`}).then(async m =>{
                        let file = await createTranscript(interaction.channel, {
                            limit: 100000000000,
                            filename: `${interaction.channel.name.toLowerCase()}-trankript.html`
                        })

                        let cache = client.channels.cache.get("1137061778916900917")
                        let msg = await cache.send({files: [file]})
                        cache = client.channels.cache.get("1113039541750739025")

                        let button = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel("Trankript öffnen")
                                .setURL(`https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`)
                                .setStyle(ButtonStyle.Link)
                            )
                            .addComponents(
                                new ButtonBuilder()
                                .setLabel("Download")
                                .setURL(`${msg.attachments.first()?.url}`)
                                .setStyle(ButtonStyle.Link)
                            )
                        
                        let embed = new EmbedBuilder()
                        .setTitle(`Transkript ${interaction.channel.name}`)
                        .setDescription(`Das Transkript wurde erfolgreich gespeichert`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                        await cache.send({embeds: [embed], components: [button]})

                        setTimeout(() => {
                            interaction.channel.delete()
                        }, 10000)
                    })

                    return;
                }
                if(interaction.customId == "ticketopen"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }
                    

                    let channel = interaction.channel

                    let s = channel.name.toLowerCase().replace(`${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}-`, "").replace("ticket-", "")
                    if(s.toString().toLowerCase() == "allgemein"){
                        channel.permissionOverwrites.edit("1076541418119647272", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1076506247232237609", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "bug report"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1111724241432354987", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1126403209464918098", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1126458798773653545", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "fahrzeuge"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1111724241432354987", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "rückerstattungen ic"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "entbannungsanträge"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "fraktion"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1122960864656502897", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "streampartnerschaft"){
                        channel.permissionOverwrites.edit("1076541418119647272", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1076506247232237609", { ViewChannel: true });
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                    }
                    if(s.toString().toLowerCase() == "bewerbung"){
                        channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: true });
                    }

                    channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: null});

                    let row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketclose")
                        .setLabel("Ticket Schließen")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🛡")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketclaim")
                        .setLabel("Ticket Claimen")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("🔐")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketuser")
                        .setLabel("Add User")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("📍")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketremoveuserlist")
                        .setLabel("Remove User")
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("✂️")
                    )

                    interaction.message.edit({components: [row1]})

                    let embed = new EmbedBuilder()
                        .setTitle(`Open Ticket - ${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}`)
                        .setDescription(`${interaction.member.nickname ? `**${interaction.member.nickname}** *(${interaction.user.username})*` : interaction.user.username} du hast das Ticket mit der Ticketnummer: **${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}** wieder geöffnet.\n\n**Bitte bedenke, dass du User manuell wieder über __✂️Remove User__ entfernen musst. Beim claimen werden __nur__ die __Team Rollen__ überschrieben**`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                    interaction.reply({embeds: [embed]})
                }
                if(interaction.customId == "ticketclaim"){
                    let supportrole = interaction.member.roles.cache.find(r => r.id === "1077220393775017995")
                    if(!supportrole){
                        interaction.reply({content: "Du hast keine Berechtigung hier für", ephemeral: true})
                        return
                    }

                    let channel = interaction.channel

                    channel.permissionOverwrites.edit("1076541418119647272", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1076506247232237609", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1076534492535201812", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1122960864656502897", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1111724241432354987", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1126403209464918098", { ViewChannel: false });
                    channel.permissionOverwrites.edit("1126458798773653545", { ViewChannel: false });

                    channel.permissionOverwrites.edit(interaction.user.id, { ViewChannel: true });

                    let row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketclose")
                        .setLabel("Ticket Schließen")
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji("🛡")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketopen")
                        .setLabel("Ticket Öffnen")
                        .setStyle(ButtonStyle.Secondary)
                        .setEmoji("🔓")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketadduserlist")
                        .setLabel("Add User")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("📍")
                    )
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("ticketremoveuserlist")
                        .setLabel("Remove User")
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji("✂️")
                    )

                    interaction.message.edit({components: [row1]})

                    let embed = new EmbedBuilder()
                        .setTitle(`Claiming Ticket - ${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}`)
                        .setDescription(`${interaction.member.nickname ? `**${interaction.member.nickname}** *(${interaction.user.username})*` : interaction.user.username} du hast das Ticket mit der Ticketnummer: **${channel.name.toLowerCase().replace("ticket-", "").replace("-allgemein", "").replace("-bug-report", "").replace("-fahrzeuge", "").replace("-beschwerden", "").replace("-rückerstattungen-ic", "").replace("-entbannungsanträge", "").replace("-fraktion", "").replace("-streampartnerschaft", "").replace("-bewerbung", "")}** geclaimed. \n\n- Um es wieder zu öffnen drücke 🔓**Ticket öffnen**\n- Um einen User zum Ticket hinzuzufügen drücke 📍**Add User**\n- Um einen User aus dem Ticket zu entfernen drücke ✂️**Remove User**\n\n**Bitte bedenke, dass du User manuell wieder über __✂️Remove User__ entfernen musst. Beim claimen werden __nur__ die __Team Rollen__ überschrieben**`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()

                    interaction.reply({embeds: [embed]})
                }
                if(interaction.customId == "gelesen"){
                    let role = interaction.member.roles.cache.find(ch => ch.id == "1076515188452360283");

                    if(role) return interaction.reply({content: `Du wurdest bereits für ${interaction.guild.name} freigeschaltet`, ephemeral: true})

                    const modal = new ModalBuilder()
                    .setCustomId(`set_regel_gelesen_modal`)
                    .setTitle(`Regelwerk gelesen?`);

                    const set_regel_gelesen_input1 = new TextInputBuilder() // Pistazie
                        .setCustomId("set_regel_gelesen_input1")
                        .setLabel(`Unser Lieblingseis`)
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short);
                    const set_regel_gelesen_input2 = new TextInputBuilder() //Madeira
                        .setCustomId("set_regel_gelesen_input2")
                        .setLabel(`Wo möchten wir einmal in unserem Leben hin`)
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short);

                    let ActionRow1 = new ActionRowBuilder().addComponents(set_regel_gelesen_input1);
                    let ActionRow2 = new ActionRowBuilder().addComponents(set_regel_gelesen_input2);
                    
                    modal.addComponents(ActionRow1);
                    modal.addComponents(ActionRow2);

                    interaction.showModal(modal)
                    return;
                }
                return
            }
            if(interaction.isModalSubmit()){
                if(interaction.customId == "poggers_modal"){
                    let input1 = interaction.fields.getTextInputValue(`poggers_input`)

                    if(input1 !== "79897") return interaction.reply({content: "Falsch", ephemeral: true})

                    if(settings[interaction.guild.id]["System"] == false){
                        settings[interaction.guild.id]["System"] = true
                        interaction.reply({content: "Set True", ephemeral: true})
                    }else{
                        settings[interaction.guild.id]["System"] = false
                        interaction.reply({content: "Set False", ephemeral: true})
                    }
                    
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                //Gelesen
                if(interaction.customId == "set_regel_gelesen_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_regel_gelesen_input1`)
                    let input2 = interaction.fields.getTextInputValue(`set_regel_gelesen_input2`)

                    let channel = interaction.guild.channels.cache.find(ch => ch.id == "1076790606661173258")
                    let role = interaction.guild.roles.cache.find(ch => ch.id == "1076515188452360283");

                    let embed = new EmbedBuilder()
                    .setTitle(`Freigeschaltet - ${interaction.user.username}`)
                    .setDescription(`Der User ${interaction.user} wurde erfolgreich auf **${interaction.guild.name}** freigeschaltet`)
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())

                    let embed2 = new EmbedBuilder()
                    .setTitle(`Abgelehnt - ${interaction.user.username}`)
                    .setDescription(`Der User ${interaction.user} hat die Fragen nicht richtig beantwortet und wurde auf **${interaction.guild.name}** nicht freigeschaltet`)
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())

                    let i = 0;

                    if(input1.toLowerCase() == "pistazie"){
                        i++
                    }

                    if(input2.toLowerCase() == "madeira"){
                        i++
                    }

                    if(i == 2){
                        interaction.member.roles.add(role)

                        interaction.reply({content: `Du wurdest erfolgreich für den Server freigeschaltet`, ephemeral: true})
                        channel.send({embeds: [embed]})
                    }else{
                        interaction.reply({content: `Da muss wohl etwas falsch gewesen sein`, ephemeral: true})
                        channel.send({embeds: [embed2]})
                    }
                }

                //SetRank
                if(interaction.customId == "set_rank_settings"){
                    let input1 = interaction.fields.getTextInputValue(`set_rank_settings_input1`)
                    let input2 = interaction.fields.getTextInputValue(`set_rank_settings_input2`)
                    let input3 = interaction.fields.getTextInputValue(`set_rank_settings_input3`)
                    let input4 = interaction.fields.getTextInputValue(`set_rank_settings_input4`)

                    let h1 = 0;
                    let h2 = 0;
                    let h3 = 0;
                    let h4 = 0;

                    let replys = "";


                    if(parseInt(input1).toString() == "NaN" && input1 !== ""){
                        interaction.reply({content: `Please enter a number`, ephemeral: true})
                        return;
                    }else{
                        if(input1 !== ""){
                            input1 = parseFloat(input1)

                            if(input1 <= 0) return interaction.reply({content: `Please enter a positv number`, ephemeral: true})

                            h1 = 1;

                            replys = replys + `XP Duration: ${input1}\n`
                        }
                    }

                    if(parseInt(input2).toString() == "NaN" && input2 !== ""){
                        interaction.reply({content: `Please enter a number`, ephemeral: true})
                        return;
                    }else{
                        if(input2 !== ""){
                            input2 = parseFloat(input2)

                            if(input2 <= 0) return interaction.reply({content: `Please enter a positv number`, ephemeral: true})

                            
                            h2 = 1;

                            replys = replys + `XP per Message Minimum: ${input2}\n`
                        }
                    }

                    if(parseInt(input3).toString() == "NaN" && input3 !== ""){
                        interaction.reply({content: `Please enter a number`, ephemeral: true})
                        return;
                    }else{
                        if(input3 !== ""){
                            input3 = parseFloat(input3)

                            if(input3 <= 0) return interaction.reply({content: `Please enter a positv number`, ephemeral: true})

                            h3 = 1;

                            replys = replys + `XP per Message Maximum: ${input3}\n`
                        }
                    }

                    input4 = input4.replace("%", "")

                    if(parseInt(input4).toString() == "NaN" && input4 !== ""){
                        interaction.reply({content: `Please enter a positv pocent number`, ephemeral: true})
                        return;
                    }else{
                        if(input4 !== ""){
                            input4 = parseFloat(input4)

                            if(input4 <= 0) return interaction.reply({content: `Please enter a positv number`, ephemeral: true})

                            input4 = parseFloat(`0.${input4}`)
                            h4 = 1;

                            replys = replys + `Required XP increase: ${input4}%`
                        }
                    }

                    let i = 0

                    if(input2 !== ""){
                        if(input2 > settings[interaction.guild.id]["SystemXPPerMessageMax"]){
                            if(input3 !== ""){
                                if(input2 > input3){
                                    interaction.reply({content: `**XP per Message Minimum** must be less than **XP per Message Maximum**`, ephemeral: true})
                                    i = 1
                                    return
                                }
                            }else{
                                interaction.reply({content: `**XP per Message Minimum** must be less than **XP per Message Maximum**`, ephemeral: true})
                                i = 1
                                return
                            }
                        }
                    }

                    if(input3 !== ""){
                        if(input3 < settings[interaction.guild.id]["SystemXPPerMessageMin"]){
                            if(input2 !== ""){
                                if(input3 < input2){
                                    interaction.reply({content: `**XP per Message Minimum** must be less than **XP per Message Maximum**`, ephemeral: true})
                                    i = 1
                                    return
                                }
                            }else{
                                interaction.reply({content: `**XP per Message Maximum** must be less than **XP per Message Minimum**`, ephemeral: true})
                                i = 1
                                return
                            }
                        }
                    }

                    
                    if(i == 0){
                        if(h1 == 1) settings[interaction.guild.id]["SystemXPDuration"] = parseFloat(input1)
                        if(h2 == 1) settings[interaction.guild.id]["SystemXPPerMessageMin"] = parseFloat(input2)
                        if(h3 == 1) settings[interaction.guild.id]["SystemXPPerMessageMax"] = parseFloat(input3)
                        if(h4 == 1) settings[interaction.guild.id]["SystemXPErhöhung"] = input4

                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }

                    input4 = input4.toString().replace("0.", "")

                    await interaction.reply({content: `Setting for System-Rank-Settings are saved\n${replys}`, ephemeral: true})
                    return;
                }

                //SetSystem
                if(interaction.customId == "set_system_rank_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_system_rank_input`)
                    input1 = input1.toLowerCase()
        
                    if(input1 == "false" || input1 == "true"){
                        settings[interaction.guild.id]["SystemXP"] = (input1 == "true" ? true : false)
        
        
                        await interaction.reply({content: `Setting for System-Embed-Rank (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_system_color_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_system_color_input`)
        
                    if(/^#[0-9A-F]{6}$/i.test(input1)){
                        settings[interaction.guild.id]["SystemColor"] = input1.toUpperCase()
        
                        await interaction.reply({content: `Setting for System-Embed-Color (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_system_ephemeral_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_system_ephemeral_input`)
        
                    if(input1.toLowerCase() == "false" || input1.toLowerCase() == "true"){
                        settings[interaction.guild.id]["SystemEphemeral"] = input1.toLowerCase()
        
                        await interaction.reply({content: `Setting for System-Embed-Ephemeral (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
        
        
                //JoinSet
                if(interaction.customId == "set_welcome_title_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_title_input`)
        
                    settings[interaction.guild.id]["JoinTitle"] = input1
        
                    await interaction.reply({content: `Setting for Join-Embed-Title (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_welcome_description_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_description_input`)
                    
                    settings[interaction.guild.id]["JoinDescription"] = input1
        
                    await interaction.reply({content: `Setting for Join-Embed-Description (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_welcome_footer_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_footer_input`)
                    let input2 = interaction.fields.getTextInputValue(`set_welcome_footer_bild_input`)
                    
                    settings[interaction.guild.id]["JoinFooter"] = input1
                    settings[interaction.guild.id]["JoinFooterBild"] = input2
        
                    await interaction.reply({content: `Setting for Join-Embed-Footer (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_welcome_color_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_color_input`)
        
                    if(/^#[0-9A-F]{6}$/i.test(input1)){
                        settings[interaction.guild.id]["JoinColor"] = input1.toUpperCase()
        
                        await interaction.reply({content: `Setting for Join-Embed-Color (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_welcome_thumpnail_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_thumpnail_input`)
                    
                    if(input1.toLowerCase() == "false" || input1.toLowerCase() == "true"){
                        settings[interaction.guild.id]["JoinThumpnail"] = input1
        
                        await interaction.reply({content: `Setting for Join-Embed-Thumpnail (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_welcome_timestamp_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_timestamp_input`)
                    
                    if(input1.toLowerCase() == "false" || input1.toLowerCase() == "true"){
                        settings[interaction.guild.id]["JoinTimestamp"] = input1
                        
                        await interaction.reply({content: `Setting for Join-Embed-Timestamp (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_welcome_channel_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_welcome_channel_input`)
                    
                    if(!(Number.isNaN(+input1))){
                        settings[interaction.guild.id]["JoinChannel"] = input1
                        
                        await interaction.reply({content: `Setting for Join-Embed-Channel (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
        
        
        
                //LeaveSet
                if(interaction.customId == "set_leave_title_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_title_input`)
        
                    settings[interaction.guild.id]["LeaveTitle"] = input1
        
                    await interaction.reply({content: `Setting for Leave-Embed-Title (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_leave_description_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_description_input`)
                    
                    settings[interaction.guild.id]["LeaveDescription"] = input1
        
                    await interaction.reply({content: `Setting for Leave-Embed-Description (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_leave_footer_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_footer_input`)
                    let input2 = interaction.fields.getTextInputValue(`set_leave_footer_bild_input`)
                    
                    settings[interaction.guild.id]["LeaveFooter"] = input1
                    settings[interaction.guild.id]["LeaveFooterBild"] = input2
        
                    await interaction.reply({content: `Setting for Leave-Embed-Footer (**${input1}**) saved`, ephemeral: true})
                        
                    fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
                if(interaction.customId == "set_leave_color_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_color_input`)
        
                    if(/^#[0-9A-F]{6}$/i.test(input1)){
                        settings[interaction.guild.id]["LeaveColor"] = input1.toUpperCase()
        
                        await interaction.reply({content: `Setting for Leave-Embed-Color (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_leave_thumpnail_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_thumpnail_input`)
                    
                    if(input1.toLowerCase() == "false" || input1.toLowerCase() == "true"){
                        settings[interaction.guild.id]["LeaveThumpnail"] = input1
        
                        await interaction.reply({content: `Setting for Leave-Embed-Thumpnail (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_leave_timestamp_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_timestamp_input`)
                    
                    if(input1.toLowerCase() == "false" || input1.toLowerCase() == "true"){
                        settings[interaction.guild.id]["LeaveTimestamp"] = input1
                        
                        await interaction.reply({content: `Setting for Leave-Embed-Timestamp (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
                if(interaction.customId == "set_leave_channel_modal"){
                    let input1 = interaction.fields.getTextInputValue(`set_leave_channel_input`)
                    
                    if(!(Number.isNaN(+input1))){
                        settings[interaction.guild.id]["LeaveChannel"] = input1
                        
                        await interaction.reply({content: `Setting for Leave-Embed-Channel (**${input1}**) saved`, ephemeral: true})
                        
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                }
        
                return;
            }
        
            if(interaction.isButton()){
                if(interaction.customId.toString().includes("ban ")){
                    if(!interaction.member.permissions.has(PermissionFlagsBits.BanMembers)) return;
                    let user = await interaction.guild.members.fetch(interaction.customId.toString().replace("ban ", ""))
                    interaction.guild.bans.create(user.id, {reason: "Global Ban"})
        
                    interaction.reply({content: `The member was successfully banned from the server`})
                }
                return;
            }
        
            if (interaction.isChatInputCommand()){
                if(interaction.commandName === 'poggers'){
                    const modal = new ModalBuilder()
                    .setCustomId(`poggers_modal`)
                    .setTitle(`Passwort?`);

                    const set_poggers_input1 = new TextInputBuilder()
                        .setCustomId("poggers_input")
                        .setLabel(`Passort eingeben`)
                        .setMinLength(1)
                        .setStyle(TextInputStyle.Short);

                    let ActionRow1 = new ActionRowBuilder().addComponents(set_poggers_input1);
                    
                    modal.addComponents(ActionRow1);

                    interaction.showModal(modal)
                    return;
                }

                if(interaction.commandName === 'ping'){
                    await interaction.reply({content: `Pong`, ephemeral: true})
                    interaction.followUp({content: `My Ping is around **${client.ws.ping}ms**`, ephemeral: true})
                    return;
                }

                if(interaction.commandName === 'ticketemp'){
                    let embed = new EmbedBuilder()
                    .setTitle("Ticket erstellen")
                    .setDescription("Wähle im Menu eine Ticket Kategorie aus.\n\n*Solltest du zwei mal die gleiche Art des Tickets auswählen und dies ist nicht möglich, starte bitte einmal deinen Discord Client neu*")
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")
                    
                    const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('ticketMenu')
                            .setPlaceholder('Nichts ausgewählt')
                            .addOptions(
                                {
                                    label: 'Allgemein',
                                    description: 'Hier kannst du z.B. Fragen stellen',
                                    value: 'Allgemein',
                                },
                                {
                                    label: 'Bug Report',
                                    description: 'Du hast einen Bug gefunden, dann reporte dies hier',
                                    value: 'Bug Report',
                                },
                                {
                                    label: 'Fahrzeuge',
                                    description: 'Wenn es um Fahrzeuge geht, kannst du dieses Ticket öffnen',
                                    value: 'Fahrzeuge',
                                },
                                {
                                    label: 'Beschwerden',
                                    description: 'Willst du dich über einen Spieler/Teamler beschweren? Dann kannst du dies hier tun',
                                    value: 'Beschwerden',
                                },
                                {
                                    label: 'Rückerstattungen IC',
                                    description: 'Falls du durch z.B. einen Bug gestorben bist, kannst du hier eine Rückerstattung beantragen',
                                    value: 'Rückerstattungen IC',
                                },
                                {
                                    label: 'Entbannungsanträge',
                                    description: 'Stelle einen Entbannungsantrag',
                                    value: 'Entbannungsanträge',
                                }
                            )
                            .addOptions(
                                {
                                    label: 'Fraktion',
                                    description: 'Möchtest du eine Fraktion gründen? Dann stelle hier einen Antrag',
                                    value: 'Fraktion',
                                },
                                {
                                    label: 'Streampartnerschaft',
                                    description: 'Du möchtest auf unserem Server streamen? Dann erhalte die Streampartnerschaft',
                                    value: 'Streampartnerschaft',
                                },
                                {
                                    label: 'Bewerbung',
                                    description: 'Du willst uns kostenlos unterstützen? Dann bewerbe dich hier',
                                    value: 'Bewerbung',
                                },
                            )
                    );
                    interaction.reply({content: " asd", ephemeral: true})
                    await interaction.deleteReply()
                    
                    interaction.channel.send({embeds: [embed], components: [row]})
                    return;
                }

                if(interaction.commandName === 'emp'){
                    let embed = new EmbedBuilder()
                    .setTitle("Custom Pings")
                    .setDescription("Stelle deine Pings ein.\n\nWähle aus für was du gepingt werden möchtest. Alles was du nicht ausgewählt hast wird entfernt")
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")
                    
                    const row = new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('pingMenu')
                            .setPlaceholder('Nothing selected')
                            .setMaxValues(2)
                            .addOptions(
                                {
                                    label: 'Stream Ping',
                                    description: 'Bekomme Stream Pings',
                                    value: 'first_option',
                                },
                                {
                                    label: 'TikTok Ping',
                                    description: 'Bekomme TikTok Pings von unserem Kanal',
                                    value: 'second_option',
                                },
                                {
                                    label: 'Keinen Ping',
                                    description: 'Bekomme keine Pings mehr',
                                    value: 'third_option',
                                }
                            ),
                    );
                    interaction.reply({content: " asd", ephemeral: true})
                    interaction.deleteReply()
                    
                    interaction.channel.send({embeds: [embed], components: [row]})
                    return;
                }
                if(interaction.commandName == "whitelistembed"){
                    let embed = new EmbedBuilder()
                    .setTitle("Whitelist Rolle")
                    .setDescription("Wähle einen User aus der die Whitelist Rolle bekommen soll")
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")

                    let row = new ActionRowBuilder()
                    .addComponents(
                        new UserSelectMenuBuilder()
                            .setCustomId("whitelistroleuser")
                            .setPlaceholder("Keinen User ausgewählt")
                            .setMaxValues(1)
                    )

                    interaction.reply({content: " asd", ephemeral: true})
                    interaction.deleteReply()
                    
                    interaction.channel.send({embeds: [embed], components: [row]})
                }
                if(interaction.commandName == "rank"){
                    let user1 = interaction.options.get("target");
        
                    let user = interaction.user
                    let member = interaction.member
        
                    if(user1 !== null) user = interaction.guild.members.cache.find(m => m.id == user1.value).user
                    if(user1 !== null) member = interaction.guild.members.cache.find(m => m.id == user1.value)
        
                    if(settings[interaction.guild.id]["SystemXP"] == false) return interaction.reply({content: `The XP system is disabled for this server. The XP system can be enabled under </settings system:1075051097896521748> (Permission: **Server Manager**)`, ephemeral: true})
        
                    if(!xpdata[interaction.guild.id]){
                        xpdata[interaction.guild.id] = {
                            [user.id]: {
                                "XP": 0,
                                "Level": 1,
                                "BisLevel": 100,
                                "NächsteXP": 0,
                                "XPIns": 0,
                            }
                        }
                    }else{
                        if(!xpdata[interaction.guild.id][user.id]){
                            xpdata[interaction.guild.id] = {
                                ...xpdata[interaction.guild.id],
                                [user.id]: {
                                    "XP": 0,
                                    "Level": 1,
                                    "BisLevel": 100,
                                    "NächsteXP": 0,
                                    "XPIns": 0,
                                }
                            }
                        }
                    }
            
                    fs.writeFileSync(path.resolve(__dirname, "./xpdata.json"), JSON.stringify(xpdata, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
        
                    if(user.bot) return interaction.reply({content: `Dies ist ein Bot`, ephemeral: true})
        
                    let obj;
                    fs.readFile('./xpdata.json', 'utf8', function (err, data) {
                        if (err) throw err;
        
                        try {
                            obj = JSON.parse(data)
                        } catch (error) {
                            if(error) return console.log("Ein Fehler ist aufgetreten! " + error);
                        }
        
                        let sorted = Object.entries(obj[interaction.guild.id]).sort((a, b) =>(
                            b[1]?.XPIns - a[1]?.XPIns
                        ), [])
        
                        let i = 1
                        let rang = 0
                        sorted.forEach(userdata => {
                            if(i == -1) return;
                            if(userdata[0] !== user.id) return i++;
        
                            rang = i
                        })
        
                        let rankcard = new Canvacord.Rank()
                        .setFontSize("Arial")
                        .setAvatar(member.displayAvatarURL())
                        .setCurrentXP(xpdata[interaction.guild.id][user.id]["XP"], settings[interaction.guild.id]["SystemBildCurrentXPColor"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildCurrentXPColor"])
                        .setRequiredXP(xpdata[interaction.guild.id][user.id]["BisLevel"], settings[interaction.guild.id]["SystemBildRequiredXPColor"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildRequiredXPColor"])
                        .setStatus(interaction.member.presence.status)
                        .setLevel(parseInt(xpdata[interaction.guild.id][user.id]["Level"]), "LEVEL")
                        .setLevelColor(settings[interaction.guild.id]["SystemBildLevel"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildLevel"], settings[interaction.guild.id]["SystemBildLevelNumber"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildLevelNumber"])
                        .setRank(rang, "RANG", true)
                        .setRankColor(settings[interaction.guild.id]["SystemBildRank"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildRank"], settings[interaction.guild.id]["SystemBildRankNumber"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildRankNumber"])
                        .setProgressBar(settings[interaction.guild.id]["SystemColor"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemColor"], "COLOR")
                        .setProgressBarTrack(settings[interaction.guild.id]["SystemBildProgressbarTrack"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildProgressbarTrack"])
                        .setOverlay(settings[interaction.guild.id]["SystemBildOverlay"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildOverlay"])
                        .setUsername(member.displayName, settings[interaction.guild.id]["SystemBildUsernameColor"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildUsernameColor"])
                        .setDiscriminator(user.discriminator, settings[interaction.guild.id]["SystemBildDiscriminatorColor"] == "usercolor" ? user1 ? interaction.guild.members.cache.find(m => m.id == user1.value).displayHexColor : interaction.member.displayHexColor : settings[interaction.guild.id]["SystemBildDiscriminatorColor"])
                        .setBackground(/^#[0-9A-F]{6}$/i.test(settings[interaction.guild.id]["SystemBildPictureURL"])  ? "COLOR" : "IMAGE", settings[interaction.guild.id]["SystemBildPictureURL"])
                        rankcard.build()
                        .then(data => {
                            let atta = new AttachmentBuilder(data, "rank.png")
                            interaction.reply({files: [atta]})
                        })
        
                    });
                }

                if(interaction.commandName === 'regel'){
                    let embed = new EmbedBuilder()
                    .setTitle("Regelwerk")
                    .setDescription("Unser Discord Regelwerk - 🛠️\nUnser Ic Regelwerk - 📖\n\nBitte halte dich an unsere Regeln für einen gemeinsamen Spielspaß")
                    .setColor(settings[interaction.guild.id]["SystemColor"])
                    .setFooter({
                        text: `${interaction.guild.name}`,
                        iconURL: interaction.guild.iconURL()
                    })
                    .setTimestamp()
                    .setThumbnail(interaction.guild.iconURL())
                    .setImage("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")
                    
                    let row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel("Discord Regelwerk")
                            .setStyle(ButtonStyle.Link)
                            .setEmoji("🛠️")
                            .setURL("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")
                        )
                        .addComponents(
                            new ButtonBuilder()
                            .setLabel("Ic Regelwerk")
                            .setStyle(ButtonStyle.Link)
                            .setEmoji("📖")
                            .setURL("https://cdn.discordapp.com/attachments/1076532760644157531/1076623628344504400/desktop-1920x1080.jpg")
                        )
                    let row1 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId("gelesen")
                        .setLabel("Gelesen?")
                        .setStyle(ButtonStyle.Success)
                        .setEmoji("✅")
                    )
                    interaction.reply({content: " asd", ephemeral: true})
                    interaction.deleteReply()
                    
                    interaction.channel.send({embeds: [embed], components: [row, row1]})
                    return;
                }
        
                if(interaction.commandName === 'embed'){
                    let title = interaction.options.get("title").value;
                    let description = interaction.options.get("description").value;
                    let footer = interaction.options.get("footer");
                    let footericonurl = interaction.options.get("footericonurl");
                    let color = interaction.options.get("color");
                    let thumnailurl = interaction.options.get("thumpnailurl");
                    let timestamp = interaction.options.get("timestamp");
                    let pictureurl = interaction.options.get("pictureurl");
                    let channel1 = interaction.options.get("channel").value;
                    let roleping1 = interaction.options.get("roleping");
                    let channel = interaction.guild.channels.cache.find(ch => ch.id == channel1)
                    
                    let embed = new EmbedBuilder()
                    .setTitle(await changeVariables(title, interaction.user, interaction.guild))
                    .setDescription(await changeVariables(description, interaction.user, interaction.guild))
        
                    if(footer !== null) embed.setFooter({
                        text: await changeVariables(footer.value, interaction.user, interaction.guild),
                        iconURL: footericonurl !== null ? footericonurl.value : null,
                    })
                    if(color !== null){
                        if(/^#[0-9A-F]{6}$/i.test(color.value)){
                            embed.setColor(color.value)
                        }else{
                            interaction.reply({content: `Please specify a hex code as color`, ephemeral: true})
                            return;
                        }
                    }
                    if(thumnailurl !== null) embed.setThumbnail(thumnailurl.value)
                    if(timestamp !== null){
                        if(timestamp.value == "embed_timestamp_yes") embed.setTimestamp()
                    }
                    if(pictureurl !== null) embed.setImage(pictureurl.value)
                    if(roleping1 !== null){
                        let roleping = interaction.guild.roles.cache.find(rl => rl.id == roleping1.value)
                        channel.send({content: `${roleping}`})
                    }
        
                    interaction.deferReply();
                    interaction.deleteReply();
                    channel.send({embeds: [embed]})
                    return;
                }
        
                if(interaction.commandName === 'slowmode'){
                    let time1 = interaction.options.get("time").value.toString();
                    let time = time1.replace("slowmode_" , "")
                    let channel = interaction.channel
        
                    time1 = time1.replace("slowmode_" , "")
        
                    if(time.includes("s")){
                        time = time.replace("s", "")
                        time = parseInt(time)
                    }else if(time.includes("m")){
                        time = time.replace("m", "")
                        time = parseInt(time) * 60
                    }else if(time.includes("h")){
                        time = time.replace("h", "")
                        time = parseInt(time) * 60 * 60
                    }

                    if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) return interaction.channel.send({content: `I do not have Manage Channel Permission\n DiscordAPIError[50013]: Missing Permissions`})
                
                        
                    channel.setRateLimitPerUser(time == "off" ? 0 : time)
        
                    let embed = new EmbedBuilder()
                        .setTitle(`Slowmode - ${channel.name}`)
                        .setDescription(`Slowmode set to **${time1}** for <#${channel.id}>`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false});
                    return;
                }
        
                if(interaction.commandName === 'serverinfo'){
                    let guild = interaction.guild
                    let embed = new EmbedBuilder()
                        .setTitle(`Serverinfo - ${guild.name}`)
                        .addFields(
                            { name: 'Name', value: `${guild.name}`, inline: true },
                            { name: 'ID', value: `${guild.id}`, inline: true },
                            { name: 'Servercreate', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - guild.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: 'Description', value: `${guild.description == null ? "/": guild.description}`, inline: true },
                            { name: 'Membercount', value: `${guild.memberCount}`, inline: true },
                            { name: 'Features', value: `${guild.features}`, inline: true },
                            { name: 'Owner', value: `<@${guild.ownerId}>`, inline: true },
                            { name: 'AFKChannel', value: guild.afkChannelId == null ? "/" : `<#${guild.afkChannelId}>`, inline: true },
                            { name: 'AFKTimeout', value: guild.afkChannelId == null ? "/" : `${guild.afkTimeout / 60}min`, inline: true },
                            { name: 'Partner', value: `${guild.partnered == false ? "No" : "Yes"}`, inline: true },
                            { name: 'Language', value: `${guild.preferredLocale}`, inline: true },
                            { name: 'Boostcount', value: `${guild.premiumSubscriptionCount}`, inline: true },
                            { name: 'Boostlevel', value: `${guild.premiumTier}`, inline: true },
                            { name: 'Progressbar', value: `${guild.premiumProgressBarEnabled == false ? "No Progressbar" : "Progressbar Enabled"}`, inline: true },
                            { name: 'Discordupdates', value: guild.publicUpdatesChannelId == null ? "/" : `<#${guild.publicUpdatesChannelId}>`, inline: true },
                            { name: 'Rulechannel', value: guild.rulesChannelId == null ? "/" : `<#${guild.rulesChannelId}>`, inline: true },
                            { name: 'Systemchannel', value: guild.systemChannelId == null ? "/" : `<#${guild.systemChannelId}>`, inline: true },
                            { name: 'Verificationlevel', value: `${guild.verificationLevel}`, inline: true },
                            { name: 'Bannerurl', value: `${guild.bannerURL() == null ? "No Banner" : guild.bannerURL()}`, inline: true },
                            { name: 'Iconurl', value: `${guild.iconURL() == null ? "No Icon" : guild.iconURL()}`, inline: true },
                            { name: 'Notification', value: `${guild.defaultMessageNotifications}`, inline: true },
                            )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(guild.iconURL() == null ? client.user.avatarURL() : guild.iconURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                
                    interaction.reply({embeds: [embed]});
                    return;
                }
        
                if(interaction.commandName === 'roleinfo'){
                    let role1  = interaction.options.get("target").value;
                    let role = interaction.guild.roles.cache.find(rl => rl.id == role1)
                    
                    let embed = new EmbedBuilder()
                        .setTitle(`Role - ${role.name}`)
                        .addFields(
                            { name: 'Name', value: `${role.name}`, inline: true },
                            { name: 'ID', value: `${role.id}`, inline: true },
                            { name: 'Color', value: `${role.hexColor}`, inline: true },
                            { name: 'Create', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - role.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: 'Roleicon', value: `${role.iconURL() == null ? "/" : role.iconURL()}`, inline: true },
                            { name: 'Managed', value: `${role.managed}`, inline: true },
                            { name: 'Mentionable', value: `${role.mentionable}`, inline: true },
                            { name: 'Permission Integer', value: `${role.permissions.bitfield.toString()}`, inline: true },
                            { name: 'Role Position', value: `${role.position}`, inline: true },
                            )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(role.iconURL() == null ? client.user.avatarURL() : role.iconURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                
                    interaction.reply({embeds: [embed]});
                    return;
                }
        
                if(interaction.commandName === 'userinfo'){
                    let user1  = interaction.options.get("target").value;
                    let member = interaction.guild.members.cache.find(rl => rl.id == user1)
                    let user = await client.users.fetch(user1)
                    
                    let embed = new EmbedBuilder()
                        .setTitle(`Role - ${user.username}`)
                        .addFields(
                            { name: 'Name', value: `${user.username}`, inline: true },
                            { name: 'ID', value: `${user.id}`, inline: true },
                            { name: 'Nickname', value: `${member.nickname == null ? "/" : member.nickname}`, inline: true },
                            { name: 'Created', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - user.createdTimestamp / 1000)}:R>`, inline: true },
                            { name: 'Joined', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - member.joinedTimestamp / 1000)}:R>`, inline: true },
                            { name: 'Accentcolor', value: `${user.hexAccentColor == undefined ? "/" : user.hexAccentColor}`, inline: true },
                            { name: 'Avatarurl', value: `${user.avatarURL() == null ? "/" : user.avatarURL()}`, inline: true },
                            { name: 'Bannerurl', value: `${user.bannerURL() == null ? "/" : user.bannerURL()}`, inline: true },
                            { name: 'Bot', value: `${user.bot == true ? "Yes" : "No"}`, inline: true },
                            { name: 'Displaycolor', value: `${member.displayHexColor}`, inline: true },
                            { name: 'Permission Integer', value: `${member.permissions.bitfield.toString()}`, inline: true },
                            { name: 'Boost', value: member.premiumSince == null ? "/" : `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - member.premiumSinceTimestamp / 1000)}:R>`, inline: true },
                            { name: 'Highest Role', value: member.roles.highest.id == "1043823096626434130" ? "/" : `<@&${member.roles.highest.id}>`, inline: true },
                            { name: 'Highest Role Position', value: member.roles.highest.id == "1043823096626434130" ? "/" : `${member.roles.highest.position}`, inline: true },
                            )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(user.avatarURL() == null ? client.user.avatarURL() : user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                
                    interaction.reply({embeds: [embed]});
                    return;
                }
        
                if(interaction.commandName === 'settings'){
                    let subCommand = interaction.options.getSubcommand();
        
                    if(subCommand == "rank"){
                        let setting = interaction.options.get("setting").value;
                        let input = interaction.options.get("input").value;

                        if(setting == "XPSystemChannel"){
                            if(input == "false" || input == "true"){

                                if(settings[interaction.guild.id]["XPSystemChannel"][interaction.channel.id]["aktiv"] == (input == "true" ? true : false)) return interaction.reply({content: `This Channel is already set to ${input}`, ephemeral: true})

                                settings[interaction.guild.id]["XPSystemChannel"][interaction.channel.id]["aktiv"] = (input == "true" ? true : false)

                                interaction.reply({content: `Channel ${interaction.channel} is now ${input == "false" ? "no longer" : ""} a XP Reward Channel`, ephemeral: true})

                                fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            }else{
                                interaction.reply({content: `Please specify true or false`, ephemeral: true})
                            }
                            return;
                        }
        
                        if(!(/^#[0-9A-F]{6}$/i.test(input)) && setting !== "SystemBildPictureURL" && input !== "usercolor") return interaction.reply({content: `Please enter a hex code`, ephemeral: true})
        
                        settings[interaction.guild.id][setting] = input
            
                        fs.writeFileSync(path.resolve(__dirname, "./settings.json"), JSON.stringify(settings, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
        
                        interaction.reply({content: `Setting ${setting} are saved (**${input}**)`, ephemeral: true})
                        return
                    }
        
                    if(subCommand == "system"){
                        let setting = interaction.options.get("setting").value;

                        if(setting == "XPSystemSettings"){
                            const modal = new ModalBuilder()
                            .setCustomId(`set_rank_settings`)
                            .setTitle(`SET_RANK_SETTINGS`);
                            let se = "";
                            se = settings[interaction.guild.id]["SystemXPErhöhung"]
                            se = parseFloat(se)
                            se = se * 100
                            se = parseInt(se)

        
                            const set_rank_settings_input1 = new TextInputBuilder()
                                .setCustomId("set_rank_settings_input1")
                                .setLabel(`XP Duration`)
                                .setRequired(false)
                                .setPlaceholder(`${settings[interaction.guild.id]["SystemXPDuration"]}`)
                                .setStyle(TextInputStyle.Short);
                            const set_rank_settings_input2 = new TextInputBuilder()
                                .setCustomId("set_rank_settings_input2")
                                .setLabel(`XP per Message Minimum`)
                                .setRequired(false)
                                .setPlaceholder(`${settings[interaction.guild.id]["SystemXPPerMessageMin"]}`)
                                .setStyle(TextInputStyle.Short);
                            const set_rank_settings_input3 = new TextInputBuilder()
                                .setCustomId("set_rank_settings_input3")
                                .setLabel(`XP per Message Maximum`)
                                .setRequired(false)
                                .setPlaceholder(`${settings[interaction.guild.id]["SystemXPPerMessageMax"]}`)
                                .setStyle(TextInputStyle.Short);
                            const set_rank_settings_input4 = new TextInputBuilder()
                                .setCustomId("set_rank_settings_input4")
                                .setLabel(`Required XP increase`)
                                .setPlaceholder(`${se}%`)
                                .setRequired(false)
                                .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_rank_settings_input1);
                            ActionRow2 = new ActionRowBuilder().addComponents(set_rank_settings_input2);
                            ActionRow3 = new ActionRowBuilder().addComponents(set_rank_settings_input3);
                            ActionRow4 = new ActionRowBuilder().addComponents(set_rank_settings_input4);
                            
                            modal.addComponents(ActionRow1);
                            modal.addComponents(ActionRow2);
                            modal.addComponents(ActionRow3);
                            modal.addComponents(ActionRow4);
                            
                            await interaction.showModal(modal);
                            return;
                        }
                        
                        if(setting == "set_system_rank"){
                            const modal = new ModalBuilder()
                            .setCustomId(`set_system_rank_modal`)
                            .setTitle(`SET_SYSTEM_RANK`);
        
                            const set_system_rank_input = new TextInputBuilder()
                                .setCustomId("set_system_rank_input")
                                .setLabel(`System Embed Rank`)
                                .setPlaceholder(`${settings[interaction.guild.id]["SystemXP"]}`)
                                .setMinLength(1)
                                .setMaxLength(20)
                                .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_system_rank_input);
                            
                            modal.addComponents(ActionRow1);
                            
                            await interaction.showModal(modal);
                        }
        
                        if(setting == "set_system_color"){
                            const modal = new ModalBuilder()
                            .setCustomId(`set_system_color_modal`)
                            .setTitle(`SET_SYSTEM_COLOR`);
        
                            const set_system_color_input = new TextInputBuilder()
                                .setCustomId("set_system_color_input")
                                .setLabel(`System Embed Color`)
                                .setPlaceholder(settings[interaction.guild.id]["SystemColor"])
                                .setMinLength(1)
                                .setMaxLength(20)
                                .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_system_color_input);
                            
                            modal.addComponents(ActionRow1);
                            
                            await interaction.showModal(modal);
                        }
        
                        if(setting == "set_system_ephemeral"){
                            const modal = new ModalBuilder()
                            .setCustomId(`set_system_ephemeral_modal`) //Umgeschrieben
                            .setTitle(`SET_SYSTEM_EPHEMERAL`);
        
                            const set_system_ephemeral_input = new TextInputBuilder()
                                .setCustomId("set_system_ephemeral_input")
                                .setLabel(`System Embed Ephemeral`)
                                .setPlaceholder(settings[interaction.guild.id]["SystemEphemeral"])
                                .setMinLength(1)
                                .setMaxLength(20)
                                .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_system_ephemeral_input);
                            
                            modal.addComponents(ActionRow1);
                            
                            await interaction.showModal(modal);
                        }
                        return;
                    }
        
                    
                    let setting = interaction.options.get("setting").value;
        
                    const modal = new ModalBuilder()
                    .setCustomId(`${setting}_modal`)
                    .setTitle(`${setting.toUpperCase()}`);
        
                    if(subCommand == "welcome"){
                        let ActionRow1;
                        let ActionRow2;
                        if(setting == "set_welcome_title"){
                            const set_welcome_title_input = new TextInputBuilder()
                            .setCustomId("set_welcome_title_input")
                            .setLabel(`Embed Title`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinTitle"])
                            .setMinLength(1)
                            .setMaxLength(250)
                            .setStyle(TextInputStyle.Paragraph);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_title_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_welcome_description"){
                            const set_welcome_description_input = new TextInputBuilder()
                            .setCustomId("set_welcome_description_input")
                            .setLabel(`Embed Description`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinDescription"])
                            .setMinLength(1)
                            .setMaxLength(4000)
                            .setStyle(TextInputStyle.Paragraph);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_description_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_welcome_footer"){
                            const set_welcome_footer_input = new TextInputBuilder()
                            .setCustomId("set_welcome_footer_input")
                            .setLabel(`Embed Footer`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinFooter"])
                            .setMinLength(1)
                            .setMaxLength(1000)
                            .setStyle(TextInputStyle.Paragraph);
        
                            const set_welcome_footer_bild_input = new TextInputBuilder()
                            .setCustomId("set_welcome_footer_bild_input")
                            .setLabel(`Embed Footer Bild (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinFooterBild"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_footer_input);
                            ActionRow2 = new ActionRowBuilder().addComponents(set_welcome_footer_bild_input);
                            
                            modal.addComponents(ActionRow1, ActionRow2);
                        }
        
                        if(setting == "set_welcome_color"){
                            const set_welcome_color_input = new TextInputBuilder()
                            .setCustomId("set_welcome_color_input")
                            .setLabel(`Embed Color (Only HexCodes)`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinColor"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_color_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_welcome_thumpnail"){
                            const set_welcome_thumpnail_input = new TextInputBuilder()
                            .setCustomId("set_welcome_thumpnail_input")
                            .setLabel(`Embed Thumpnail (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinThumpnail"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_thumpnail_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_welcome_timestamp"){
                            const set_welcome_timestamp_input = new TextInputBuilder()
                            .setCustomId("set_welcome_timestamp_input")
                            .setLabel(`Embed Timestamp (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinTimestamp"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_timestamp_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_welcome_channel"){
                            const set_welcome_channel_input = new TextInputBuilder()
                            .setCustomId("set_welcome_channel_input")
                            .setLabel(`Channel where Embed send (false or ID)`)
                            .setPlaceholder(settings[interaction.guild.id]["JoinChannel"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_welcome_channel_input);
                            
                            modal.addComponents(ActionRow1);
                        }
                    }
        
                    if(subCommand == "leave"){
                        let ActionRow1;
                        let ActionRow2;
                        if(setting == "set_leave_title"){
                            const set_leave_title_input = new TextInputBuilder()
                            .setCustomId("set_leave_title_input")
                            .setLabel(`Embed Title`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveTitle"])
                            .setMinLength(1)
                            .setMaxLength(250)
                            .setStyle(TextInputStyle.Paragraph);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_title_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_leave_description"){
                            const set_leave_description_input = new TextInputBuilder()
                            .setCustomId("set_leave_description_input")
                            .setLabel(`Embed Description`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveDescription"])
                            .setMinLength(1)
                            .setMaxLength(4000)
                            .setStyle(TextInputStyle.Paragraph);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_description_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_leave_footer"){
                            const set_leave_footer_input = new TextInputBuilder()
                            .setCustomId("set_leave_footer_input")
                            .setLabel(`Embed Footer`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveFooter"])
                            .setMinLength(1)
                            .setMaxLength(1000)
                            .setStyle(TextInputStyle.Paragraph);
        
                            const set_leave_footer_bild_input = new TextInputBuilder()
                            .setCustomId("set_leave_footer_bild_input")
                            .setLabel(`Embed Footer Bild (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveFooterBild"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_footer_input);
                            ActionRow2 = new ActionRowBuilder().addComponents(set_leave_footer_bild_input);
                            
                            modal.addComponents(ActionRow1, ActionRow2);
                        }
        
                        if(setting == "set_leave_color"){
                            const set_leave_color_input = new TextInputBuilder()
                            .setCustomId("set_leave_color_input")
                            .setLabel(`Embed Color (Only HexCodes)`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveColor"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_color_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_leave_thumpnail"){
                            const set_leave_thumpnail_input = new TextInputBuilder()
                            .setCustomId("set_leave_thumpnail_input")
                            .setLabel(`Embed Thumpnail (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveThumpnail"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_thumpnail_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_leave_timestamp"){
                            const set_leave_timestamp_input = new TextInputBuilder()
                            .setCustomId("set_leave_timestamp_input")
                            .setLabel(`Embed Timestamp (false or true)`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveTimestamp"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_timestamp_input);
                            
                            modal.addComponents(ActionRow1);
                        }
        
                        if(setting == "set_leave_channel"){
                            const set_leave_channel_input = new TextInputBuilder()
                            .setCustomId("set_leave_channel_input")
                            .setLabel(`Channel where Embed send (false or ID)`)
                            .setPlaceholder(settings[interaction.guild.id]["LeaveChannel"])
                            .setMinLength(1)
                            .setMaxLength(20)
                            .setStyle(TextInputStyle.Short);
        
                            ActionRow1 = new ActionRowBuilder().addComponents(set_leave_channel_input);
                            
                            modal.addComponents(ActionRow1);
                        }
                    }
        
                    await interaction.showModal(modal);
                    return;
                }
        
                if(interaction.commandName === 'unban'){
                    let user = interaction.options.get("targetid").value;
                    if(parseInt(user).toString() == "NaN") return interaction.reply({content: `Please enter the ID`, ephemeral: true})

                    if(!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ViewAuditLog)) return interaction.channel.send({content: `I do not have View Auditlog Permission\n DiscordAPIError[50013]: Missing Permissions`})
                    let banid = interaction.guild.bans.cache.find(us => us.user.id == user)
        
                    if(banid == undefined) return interaction.reply({content: `The user (ID: **${user}**) could not be found. Maybe wrong ID?`, ephemeral: true})
        
                    interaction.guild.members.unban(banid.user)
        
                    interaction.reply({content: `The User **${banid.user.username}** was unbanned`})
        
                    return;
                }
        
                if(interaction.commandName === 'help'){
                    let embed = new EmbedBuilder()
                        .setTitle(`Help`)
                        .setDescription(`</ping:1075027452327374899>\n</clear:1075012684451414116>\n</embed:1075392315650216046></roleinfo:</:>\n>\n\n</ban local:1074608651484016740>\n</ban global:1074608651484016740>\n</tempban:1074982442110304296>\n</unban:1075029467862413482>\n`)
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false}); 
        
                    return;
                }
        
                if(interaction.commandName === 'clear'){
                    let number = interaction.options.get("number").value;
                    number = number + 1
                    await interaction.deferReply()
            
                    for (let i = number; i > 0; i -= 100) {
                        await interaction.channel.bulkDelete(i > 100 ? 100 : i, true)
                    }
        
                    await interaction.channel.send({content: `I have deleted **${number}** of the messages that are not older than 14 days. `})
                    return;
                }
        
                if(interaction.commandName === 'tempban'){
                    if(settings[interaction.guild.id]["MissingPermissions"] == true) return interaction.reply({content: `I lack the authorization to unban someone`, ephemeral:true})
                    let user = interaction.options.get("target").user;
                    let member = interaction.options.get("target").member;
                    let reason = interaction.options.get("reason");
                    let number = interaction.options.get("number").value;
                    let indication = interaction.options.get("timeindication").value;
        
                    if(interaction.options.get("target").member.roles.highest.position > interaction.member.roles.highest.position) return interaction.reply({content: `The member you want to tempban is above you in the hierarchy, you can't tempban him.`, ephemeral: true})
                    if(interaction.options.get("target").user.id == client.user.id) return interaction.reply({content: `I cannot tempbanish myself. You'll have to do that then, too tempbad you don't need me anymore`, ephemeral: true})
                    if(!interaction.options.get("target").member.bannable) return interaction.reply({content: `I can't tempban the member you want to ban. Probably he is above me in the hierarchy`, ephemeral: true})
        
        
                    tempjson[interaction.guild.id] = {
                        ...tempjson[interaction.guild.id],
                        [user.id]: {
                            "Name": user.username,
                            "Reason": reason ? reason.value : "/",
                            "Duration": new Date().getTime(),
                            "Rechnung": indication == "tempban_days" ? 1000 * 60 * 60 * 24 * parseInt(number) : 1000 * 60 * parseInt(number)
                        }
                    }
                    fs.writeFileSync(path.resolve(__dirname, "./tempbans.json"), JSON.stringify(tempjson, null, 4), err =>{
                        if(err){
                            console.log(err);
                        }
                    });
        
                    member.ban({reason: reason ? reason.value : ""})
        
                    let embed = new EmbedBuilder()
                        .setTitle(`Tempban - ${member.username}`)
                        .setDescription(`The User **${user.username}** (ID: **${user.id}**) was banned for **${number} ${indication == "tempban_days" ? "Days" : "Minutes"}**.\n${reason ? "Reason: **" + reason.value + "**": ""}`)
                        .addFields(
                            { name: 'Username', value: `${member.username}`, inline: true },
                            { name: 'ID', value: `${member.id}`, inline: true },
                            { name: 'Joined', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - interaction.member.joinedTimestamp / 1000)}:R>`, inline: true },
                        )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false}); 
                    return;
                }
        
                if (interaction.commandName === 'warn'){
                    let subCommand = interaction.options.getSubcommand();
                    let user = interaction.options.get("target").user;
                    let member = interaction.options.get("target").member;
                    let reason = interaction.options.get("reason");
                    let number = interaction.options.get("number");
                    let duration = interaction.options.get("duration").value
                    let role = member.roles.cache.find(rl => rl.id === "1077220393775017995")
        
                    if(member.roles.highest.position > interaction.member.roles.highest.position && subCommand == "add") return interaction.reply({content: `The member you want to warn is above you in the hierarchy, you can't warn him.`, ephemeral: true})
                    if(user.id == client.user.id) return interaction.reply({content: `Hey why do you want to warn me, I did not make anything!`, ephemeral: true})
        
                    if(!warnjson[user.id]){
                        warnjson[user.id] = {
                            [interaction.guild.id] : {
                                "Name": user.username,
                                "DurationTeam": [0, 0, 0],
                                "DurationCom": [0, 0, 0],
                                "Warnings": 0,
                            }
                        }
        
                        fs.writeFileSync(path.resolve(__dirname, "./warnings.json"), JSON.stringify(warnjson, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
        
                    if(subCommand == "add"){
                        if(role !== undefined){
                            let x = 0
                            if(member.roles.cache.find(rl => rl.id == "1076571253550362624") !== undefined) x = 1
                            if(x == 0){
                                let rolecount = 0;
                                for (let index = 1; index <= 3; index++) {
                                    let string = `${index}. Teamwarn`
                                    let findrole = member.roles.cache.find(rl => rl.name == string.toString())
                                    if(findrole == undefined){
                                        rolecount = index;
                                        index = 10
                                    }
                                }

                                if(duration){
                                    let dur = warnjson[user.id][interaction.guild.id]["DurationCom"]
                                    if(rolecount == 1){
                                        warnjson[user.id][interaction.guild.id]["DurationTeam"] = [duration, dur[1], dur[2]]
                                    }
                                    if(rolecount == 2){
                                        warnjson[user.id][interaction.guild.id]["DurationTeam"] = [dur[0], duration, dur[2]]
                                    }
                                    if(rolecount == 3){
                                        warnjson[user.id][interaction.guild.id]["DurationTeam"] = [dur[0], dur[1], duration]
                                    }
                                    fs.writeFileSync(path.resolve(__dirname, "./warnings.json"), JSON.stringify(warnjson, null, 4), err =>{
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }

                                let string = `${rolecount}. Teamwarn`
                                let addrole = interaction.guild.roles.cache.find(rl => rl.name == string)
                                member.roles.add(addrole)
                            }else{
                                let TeamManagement = member.roles.cache.find(rl => rl.id == "1076545835036311694")
                                let Marketing = member.roles.cache.find(rl => rl.id == "1101242928040509591")
                                let EventManagement = member.roles.cache.find(rl => rl.id == "1076541017999806625")
                                let Fraktionsverwaltung = member.roles.cache.find(rl => rl.id == "1122960864656502897")
                                let CarDev = member.roles.cache.find(rl => rl.id == "1111724241432354987")
                                let Mapper = member.roles.cache.find(rl => rl.id == "1126403209464918098")
                                let Kleidung = member.roles.cache.find(rl => rl.id == "1126458798773653545")
                                let Moderator = member.roles.cache.find(rl => rl.id == "1076534492535201812")
                                let Support = member.roles.cache.find(rl => rl.id == "1076541418119647272")
                                let TestSupport = member.roles.cache.find(rl => rl.id == "1076506247232237609")
                                let TeamUnterstützung = member.roles.cache.find(rl => rl.id == "1076593576349282365")
                                let Konfliktlotsin = member.roles.cache.find(rl => rl.id == "1076961732364349440")
                                let Team = member.roles.cache.find(rl => rl.id == "1077220393775017995")
                                
                                let TeamManagementGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076545835036311694")
                                let MarketingGuild = interaction.guild.roles.cache.find(rl => rl.id == "1101242928040509591")
                                let EventManagementGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076541017999806625")
                                let FraktionsverwaltungGuild = interaction.guild.roles.cache.find(rl => rl.id == "1122960864656502897")
                                let CarDevGuild = interaction.guild.roles.cache.find(rl => rl.id == "1111724241432354987")
                                let MapperGuild = interaction.guild.roles.cache.find(rl => rl.id == "1126403209464918098")
                                let KleidungGuild = interaction.guild.roles.cache.find(rl => rl.id == "1126458798773653545")
                                let ModeratorGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076534492535201812")
                                let SupportGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076541418119647272")
                                let TestSupportGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076506247232237609")
                                let TeamUnterstützungGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076593576349282365")
                                let KonfliktlotsinGuild = interaction.guild.roles.cache.find(rl => rl.id == "1076961732364349440")
                                let TeamGuild = interaction.guild.roles.cache.find(rl => rl.id == "1077220393775017995")
                                let TeamWarn1Guild = member.roles.cache.find(rl => rl.id == "1076571133383544862")
                                let TeamWarn2Guild = member.roles.cache.find(rl => rl.id == "1076571208079908955")
                                let TeamWarn3Guild = member.roles.cache.find(rl => rl.id == "1076571253550362624")

                                if(TeamManagement) member.roles.remove(TeamManagementGuild)
                                if(Marketing) member.roles.remove(MarketingGuild)
                                if(EventManagement) member.roles.remove(EventManagementGuild)
                                if(Fraktionsverwaltung) member.roles.remove(FraktionsverwaltungGuild)
                                if(CarDev) member.roles.remove(CarDevGuild)
                                if(Mapper) member.roles.remove(MapperGuild)
                                if(Kleidung) member.roles.remove(KleidungGuild)
                                if(Moderator) member.roles.remove(ModeratorGuild)
                                if(Support) member.roles.remove(SupportGuild)
                                if(TestSupport) member.roles.remove(TestSupportGuild)
                                if(TeamUnterstützung) member.roles.remove(TeamUnterstützungGuild)
                                if(Konfliktlotsin) member.roles.remove(KonfliktlotsinGuild)
                                if(Team) member.roles.remove(TeamGuild)
                                member.roles.remove(TeamWarn1Guild)
                                member.roles.remove(TeamWarn2Guild)
                                member.roles.remove(TeamWarn3Guild)
                            }
                        }else {
                            let x = 0
                            if(member.roles.cache.find(rl => rl.id == "1076571320663425024") !== undefined) x = 1
                            if(x == 0){
                                let rolecount = 0;
                                for (let index = 1; index <= 3; index++) {
                                    let string = `${index}. Communitywarn`
                                    let findrole = member.roles.cache.find(rl => rl.name == string.toString())
                                    if(findrole == undefined){
                                        rolecount = index;
                                        index = 10
                                    }
                                }

                                if(duration){
                                    let dur = warnjson[user.id][interaction.guild.id]["DurationCom"]
                                    console.log(duration)
                                    if(rolecount == 1){
                                        warnjson[user.id][interaction.guild.id]["DurationCom"] = [duration, dur[1], dur[2]]
                                    }
                                    if(rolecount == 2){
                                        warnjson[user.id][interaction.guild.id]["DurationCom"] = [dur[0], duration, dur[2]]
                                    }
                                    if(rolecount == 3){
                                        warnjson[user.id][interaction.guild.id]["DurationCom"] = [dur[0], dur[1], duration]
                                    }
                                    fs.writeFileSync(path.resolve(__dirname, "./warnings.json"), JSON.stringify(warnjson, null, 4), err =>{
                                        if(err){
                                            console.log(err);
                                        }
                                    });
                                }
                                let string = `${rolecount}. Communitywarn`
                                let addrole = interaction.guild.roles.cache.find(rl => rl.name == string)
                                member.roles.add(addrole)
                            }else{
                                let embed = new EmbedBuilder()
                                    .setTitle(`Warn ${subCommand} - ${user.username}`)
                                    .setDescription(`Der User ${user} wurde automatisch nach 3 Community Warns gebannt`)
                                    .setColor(settings[interaction.guild.id]["SystemColor"])
                                    .setThumbnail(client.user.avatarURL())
                                    .setFooter({
                                        text: `Fallout Survival`,
                                        iconURL: client.user.avatarURL(),
                                    })
                                    .setTimestamp()
                                
                                await interaction.guild.channels.cache.find(ch => ch.id == "1110976523168649319").send({embeds: [embed]})

                                member.ban()
                            }
                        }

                        warnjson[user.id][interaction.guild.id]["Warnings"] += 1;
                        fs.writeFileSync(path.resolve(__dirname, "./warnings.json"), JSON.stringify(warnjson, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                    if(subCommand == "remove"){
                        warnjson[user.id][interaction.guild.id]["Warnings"] -= number.value;
                        fs.writeFileSync(path.resolve(__dirname, "./warnings.json"), JSON.stringify(warnjson, null, 4), err =>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                    
                    let embed = new EmbedBuilder()
                        .setTitle(`Warn ${subCommand} - ${user.username}`)
                        .setDescription(subCommand == "add" ? "Ich habe den User " + user + " verwarnt\n" + (reason ? "Reason: **" + reason.value + "**" : "") : subCommand == "remove" ? "Ich habe **" + number.value + "** Warns von <@" + user + ">'s Warnings entfernt" : "<@" + user + "> Warnings")
                        .addFields(
                            { name: 'Username', value: `${user.username}`, inline: true },
                            { name: 'ID', value: `${user.id}`, inline: true },
                            { name: 'Current Warnings', value: `${warnjson[user.id][interaction.guild.id]["Warnings"]}`, inline: true },
                        )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false});

                    if((subCommand == "add" || subCommand == "remove") && role == undefined){
                        let embed2 = new EmbedBuilder()
                            .setTitle(`Warn ${subCommand} - ${user.username}`)
                            .setDescription(subCommand == "add" ? "Ich habe den User <@" + user + "> verwarnt\n" + (reason ? "Reason: **" + reason.value + "**" : "") : "Ich habe **" + number.value + "** Warns von <@" + user + ">'s Warnings entfernt")
                            .addFields(
                                { name: 'Username', value: `${user.username}`, inline: true },
                                { name: 'ID', value: `${user.id}`, inline: true },
                                { name: 'Current Warnings', value: `${warnjson[user.id][interaction.guild.id]["Warnings"]}`, inline: true },
                            )
                            .setColor(settings[interaction.guild.id]["SystemColor"])
                            .setThumbnail(client.user.avatarURL())
                            .setFooter({
                                text: `Fallout Survival`,
                                iconURL: client.user.avatarURL(),
                            })
                            .setTimestamp()
                        
                        interaction.guild.channels.cache.find(ch => ch.id == "1110976523168649319").send({embeds: [embed2]})
                    }
        
                    return;
                }
        
                if (interaction.commandName === 'kick') {
                    let user = interaction.options.get("target").user;
                    let member = interaction.options.get("target").member;
                    let reason = interaction.options.get("reason");
                    
                    if(interaction.options.get("target").member.roles.highest.position > interaction.member.roles.highest.position) return interaction.reply({content: `The member you want to kick is above you in the hierarchy, you can't kick him.`, ephemeral: true})
                    if(interaction.options.get("target").user.id == client.user.id) return interaction.reply({content: `I cannot kick myself. You'll have to do that then, too bad you don't need me anymore`, ephemeral: true})
                    if(!interaction.options.get("target").member.kickable) return interaction.reply({content: `I can't kick the member you want to kick. Probably he is above me in the hierarchy or I do not have permission to kick him`, ephemeral: true})
        
        
                    let embed = new EmbedBuilder()
                        .setTitle(`Kick - ${user.username}`)
                        .setDescription(`I have Kicked **${user.username}** from the Server\nModeration: ${interaction.user}\n${reason ? "Reason: `" + reason.value + "`": ""}`)
                        .addFields(
                            { name: 'Username', value: `${user.username}`, inline: true },
                            { name: 'ID', value: `${user.id}`, inline: true },
                            { name: 'Joined', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - interaction.member.joinedTimestamp / 1000)}:R>`, inline: true },
                        )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false});
        
                    member.kick()
        
                    return;
                }
        
                if (interaction.commandName === 'ban') {
                    let member = interaction.options.get("target").user;
                    let reason = interaction.options.get("reason");
        
                    if(interaction.options.get("target").member.roles.highest.position > interaction.member.roles.highest.position) return interaction.reply({content: `The member you want to ban is above you in the hierarchy, you can't ban him.`, ephemeral: true})
                    if(interaction.options.get("target").user.id == client.user.id) return interaction.reply({content: `I cannot banish myself. You'll have to do that then, too bad you don't need me anymore`, ephemeral: true})
                    if(!interaction.options.get("target").member.bannable) return interaction.reply({content: `I can't ban the member you want to ban. Probably he is above me in the hierarchy or I do not have permission to ban him`, ephemeral: true})
        
                    let embed = new EmbedBuilder()
                        .setTitle(`Local Ban - ${member.username}`)
                        .setDescription(`I have Banned **${member.username}** local\nModeration: ${interaction.user}\n${reason ? "Reason: `" + reason.value + "`": ""}`)
                        .addFields(
                            { name: 'Username', value: `${member.username}`, inline: true },
                            { name: 'ID', value: `${member.id}`, inline: true },
                            { name: 'Joined', value: `<t:${Math.floor(Date.now() / 1000) - Math.floor(Date.now() / 1000 - interaction.member.joinedTimestamp / 1000)}:R>`, inline: true },
                        )
                        .setColor(settings[interaction.guild.id]["SystemColor"])
                        .setThumbnail(client.user.avatarURL())
                        .setFooter({
                            text: `Fallout Survival`,
                            iconURL: client.user.avatarURL(),
                        })
                        .setTimestamp()
        
                    
                    interaction.reply({embeds: [embed], ephemeral: settings[interaction.guild.id]["SystemEphemeral"] == "true" ? true : false});
        
                    interaction.options.get("target").member.ban({reason: reason ? reason.value : ""})
                    return;
                }
            }
        } catch (error) {
            if(error){
                console.log(error)
            }
        }
    }
});

client.on("guildMemberAdd", async joinMember => {
    if(settings[joinMember.guild.id]["SystemWartungen"] == true && botak == "Server") return;
    let channel1 = settings[joinMember.guild.id]["JoinChannel"]
    if(channel1 == "false") return;

    let channel = joinMember.guild.channels.cache.find(ch => ch.id == channel1);
    let role = joinMember.guild.roles.cache.find(ch => ch.id == "1076515188452360283");

    if(role) joinMember.roles.add(role)

    if(channel == undefined) return;

    const card = new Canvacord.Welcomer()
    .setUsername(joinMember.user.username)
    .setDiscriminator(joinMember.user.discriminator)
    .setGuildName(joinMember.guild.name)
    .setAvatar(joinMember.displayAvatarURL())
    .setMemberCount(joinMember.guild.memberCount)

    card.build()
    .then(data => {
        let atta = new AttachmentBuilder(data, "welcome.png")
        channel.send({files: [atta]})
    })
})

function changeVariables(string, user, guild){

    while (string.includes("{user.mention}")) {
        string = string.replace("{user.mention}", "<@" + user.id.toString() + ">")
    }
    while (string.includes("{user.id}")) {
        string = string.replace("{user.id}", user.id)
    }
    while (string.includes("{user.username}")) {
        string = string.replace("{user.username}", user.username)
    }
    while (string.includes("{user.name}")) {
        string = string.replace("{user.name}", user.username)
    }
    while (string.includes("{user.nickname}")) {
        string = string.replace("{user.nickname}", user.nickname == null ? "[No Nickname]" : user.nickname)
    }
    while (string.includes("{guild.id}")) {
        string = string.replace("{guild.id}", guild.id)
    }
    while (string.includes("{guild.name}")) {
        string = string.replace("{guild.name}", guild.name)
    }

    return string;
}

client.login(token)