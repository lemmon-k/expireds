//openai
import { OpenAI } from "openai";

// gpt-4o-mini text message
export async function gpt(data) {
  console.log("gpt-thinking...");
  try {
    // init gpt
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    if (!data) throw new Error("no data");

    // write text msg
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      // response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are a summerizer for a real estate agent.",
        },
        {
          role: "user",
          content: `Given the following "Input Listing" please constructe and SMS friendly summary for an aspiring real estate agent looking to utilize expired listings for leads, while adhering to the following rules.
RULES:
1. Always mention the address, property type, price, days on market(dom), days expired.
1. Do not use emojis.
2. Do not make up information.
3. Message should be in sentence form.

Input listing:
${JSON.stringify(data)}
        `,
        },
      ],
    });

    // parse stream message
    const message = stream.choices[0].message.content;
    return message;
  } catch (error) {
    console.error("Error at gpt:", error);
    return false;
  }
}
