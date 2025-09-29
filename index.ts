import { Client, Events, GatewayIntentBits } from "discord.js"
import dontenv from "dotenv"
import { captureIncomingMessage } from "./core/capture-incoming-message"
import { filteringText } from "./core/filtering-text";
import { Model } from "./core/onnx";

dontenv.config()

const label = ['HATE_SPEECH', 'NORMAL', 'PEDOFILIA', 'SEXUAL_HARASSMENT']

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
        //await captureIncomingMessage(message.content)

        const msg = filteringText(message.content)
        if(msg != ""){
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