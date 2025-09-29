import { DistilBertTokenizer, PreTrainedTokenizer } from '@huggingface/transformers';
import * as ort from "onnxruntime-web";

class ONNXRuntime {
    tokenizer: PreTrainedTokenizer | undefined;
    model: ort.InferenceSession | undefined;

    async setup(){
        this.tokenizer = await DistilBertTokenizer.from_pretrained("./tokenizer")
        this.model = await ort.InferenceSession.create("./models/imphnenbert.onnx")
    }

    async inference(text: string){
        if(this.tokenizer && this.model){
            const encoded = this.tokenizer.encode(text, {
                add_special_tokens: true
            })
            const inputIds = new ort.Tensor(
                "int64",
                BigInt64Array.from(encoded.map(i => BigInt(i))),
                [1, encoded.length]
            );
            const attentionMask = new ort.Tensor(
            "int64",
                BigInt64Array.from(encoded.map(() => BigInt(1))),
                [1, encoded.length]
            );
            
            const feeds: Record<string, ort.Tensor> = {
                input_ids: inputIds,
                attention_mask: attentionMask
            };

            const results = await this.model.run(feeds);
            const logitsData = results.logits ? await results.logits.getData() : undefined;
            
            if (logitsData) {
                const logits = logitsData as Float32Array;
                const numClasses = logits.length; // kalau batch=1
                let maxIdx = 0;
                let maxVal = logits[0];
                for (let i = 1; i < numClasses; i++) {
                    if ((logits[i] ?? 0) > (maxVal ?? 0)) {
                        maxVal = logits[i];
                        maxIdx = i;
                    }
                }

                return maxIdx
            } else {
                throw new Error("Logits data is undefined.");
            }
        }
    }
}

export const Model = new ONNXRuntime()