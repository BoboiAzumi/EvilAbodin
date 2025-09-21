import { prisma } from "./database";
import { filteringText } from "./filtering-text";

export async function captureIncomingMessage(message: string){
    message = filteringText(message)
    if(message == "" || message.length <= 15){
        return
    }

    return await prisma.textRecord.create({
        data: {
            text: message
        }
    })
}