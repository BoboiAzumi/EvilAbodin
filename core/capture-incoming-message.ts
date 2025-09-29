import { prisma } from "./database";
import { filteringText } from "./filtering-text";

export async function captureIncomingMessage(message: string, label: string = ""){
    message = filteringText(message)
    
    if(message == ""){
        return
    }

    return await prisma.textRecord.create({
        data: {
            text: message
        }
    })
}