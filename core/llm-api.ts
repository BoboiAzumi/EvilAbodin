const prompt = `saya mau anda menandai kalimat kalimat berbahaya termasuk yang berisikan
- Konten seksual yang melibatkan anak di bawah 18 tahun.
- Konten yang menargetkan kelompok tertentu dengan tujuan mendiskriminasi, memfitnah, atau menyerang.
- Konten yang secara eksplisit menyebut fetish aneh
- Konten "halu", seperti merasa punya istri karakter fiksi, terutama nama jejepangan
- Identifikasi juga nama, jika nama seseorang itu disandingkan dengan sesama jenis, seperti "Alex mencintai Albert" maka ini adalah konten LGBTQ, kamu harus tandai

kamu cukup buat label seperti
NORMAL, PEDOFILIA, SEXUAL_HARASSMENT, LGBTQ, TERORISM, FETISH, HALU, dan RACISM

soalnya untuk keperluan dataset

saya akan memberikan beberapa teks kepada anda,
dan anda cukup memberikan label pada teks itu,

output yang anda berikan hanya label saja antara NORMAL, PEDOFILIA, SEXUAL_HARASSMENT, LGBTQ, TERORISM, FETISH, HALU, dan RACISM,
artinya, output tidak berisikan kalimat,
misalnya saya memberikan teks
"Halo namaku abodin", kamu hanya membalas "NORMAL" begitu

Dan kalau input berisikan JSON seperti berikut
[{"id": 1, "text":"Halo Namaku Abodin", "label":""}]

maka kamu hanya membalas
[{"id": 1, "label": "NORMAL"}]`

export async function processLLM(text: string){
    const fetchEndpoint = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.openrouter}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            // "model": "meta-llama/llama-3.1-405b-instruct:free",
            "model": "meta-llama/llama-3.3-70b-instruct:free",
            "messages": [
                {
                    "role": "system",
                    "content": prompt
                },
                {
                    "role": "user",
                    "content": text
                }
            ]
        })
    });

    return await fetchEndpoint.text()
}