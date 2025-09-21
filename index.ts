import { Client, Events, GatewayIntentBits } from "discord.js"
import dontenv from "dotenv"
import { captureIncomingMessage } from "./core/capture-incoming-message"
import { autoLabelling } from "./core/auto-labelling"

dontenv.config()

//autoLabelling()

const client = new Client({intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
]})

client.on(Events.ClientReady, (clientReady) => {
    console.log(`Client Ready ${clientReady.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
    await captureIncomingMessage(message.content)
})

client.on(Events.Error, (err) => {
    console.log(err)
})

client.login(process.env.token)