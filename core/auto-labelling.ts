import { prisma } from "./database";
import { processLLM } from "./llm-api";

export async function autoLabelling(){
    const requestsPerDay = 50;
    const intervalMs = 86400000 / requestsPerDay;
    const limit = 40

    console.log(`[${new Date().toLocaleTimeString()}] Auto Labelling Run`)
    let count = await prisma.textRecord.count({
        where: {
            label: ""
        }
    })

    if(count <= limit){
        setTimeout(autoLabelling, intervalMs)
        return
    }

    const data = await prisma.textRecord.findMany({
        where: {
            label: ""
        },
        take: limit
    })

    let fromllm;
    try{
        const str = JSON.stringify(data)
        fromllm = JSON.parse(await processLLM(str))
        const content = JSON.parse(fromllm.choices[0].message.content)
        await Promise.all(
            content.map((v: {id: number, label: string}) => {
                return prisma.textRecord.update({
                    where: {
                        id: v.id
                    },
                    data: {
                        label: v.label
                    }
                })
            })
        )
        console.log(`[${new Date().toLocaleTimeString()}] Success Autolabel`)
    }
    catch {
        if(fromllm.error){
            const now = Date.now()
            const reset = parseInt(fromllm.error.metadata.headers["X-RateLimit-Reset"])
            const waitTime = Math.max(reset - now, 0);
            setTimeout(autoLabelling, waitTime);
            console.log(`[${new Date().toLocaleTimeString()}] Openrouter Limit Next in ${waitTime}`)
            return
        }
    }

    setTimeout(autoLabelling, intervalMs)
}