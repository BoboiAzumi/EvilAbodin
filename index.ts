import { Client, Events, GatewayIntentBits } from "discord.js"
import dontenv from "dotenv"
import { captureIncomingMessage } from "./core/capture-incoming-message"
import { filteringText } from "./core/filtering-text";
import { Model } from "./core/onnx";

dontenv.config()

const label = ['HATE_SPEECH', 'NORMAL', 'PEDOFILIA', 'SEXUAL_HARASSMENT']

let whitelist: string[] = []
let active = false

async function main(){
    const client = new Client({intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
    ]})
    await Model.setup()

    client.on(Events.ClientReady, (clientReady) => {
        console.log(`Client Ready ${clientReady.user.tag}`)
    })

    client.on(Events.MessageCreate, async (message) => {
        if(message.author.bot){
            return
        }

        if(message.author.id == "907441180705452062"){
            switch(message.content.split(" ")[0]){
                case "!whitelist":
                    const whitelistId = message.content.split(" ")[1]?.replace("<", "").replace(">", "").replace("@", "")
                    if(whitelistId){
                        whitelist.push(whitelistId)
                    }
                    await message.reply(`Successfuly add user to whitelist`)
                    break

                case "!demote":
                    const demoteId = message.content.split(" ")[1]?.replace("<", "").replace(">", "").replace("@", "")
                    if(demoteId){
                        whitelist = whitelist.filter((v) => v != demoteId)
                    }
                    await message.reply(`User has been demote`)
                    break

                case "!deactivated":
                    active = false
                    await message.reply(`Slepping zzz, having your nice day Mr.Azumi`)
                    break
                
                case "!activated":
                    active = true
                    await message.reply(`Siap menggenosida lobby IMPHNEN`)
                    break

                case "!show_whitelist":
                    if(whitelist.length != 0){
                        await message.reply(`Here : \n\`\`\`${whitelist.toString()}\`\`\``)
                    }
                    else{
                        await message.reply(`Nothing Whitelist`)
                    }
                    break
            }
        }

        //await captureIncomingMessage(message.content)

        if(whitelist.includes(message.author.id)){
            return
        }

        const msg = filteringText(message.content)
        if(msg != "" && message.channel.id == "1206217214274048050" && active){
            const id = await Model.inference(message.content) as number
            if(label[id] != "NORMAL"){
                message.reply(`Your message violates community standards guidelines. \nReason: ${label[id]}`)
                setTimeout(async () => {
                    await message.delete()
                }, 1000)
            }
            await captureIncomingMessage(message.content, `CANDIDATE_${label[id]}`)
        }
    })

    client.on(Events.Error, (err) => {
        console.log(err)
    })

    client.login(process.env.token)
}

main()