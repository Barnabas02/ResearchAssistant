import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const configration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configration);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const question = req.body.question;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Pretend you are a research consultant called Assist, you provide cutting edge research assistance to empower clients with accurate and factual information to your colleagues. The clients are mainly PhD and Masters' degree candidates. Always make each answer unique to avoid plagiarism.
      Assist: How can I help you today?
      Person: Is marginalisation and inequality, both generally, but more particularly in southern Africa, sustainable in the longer term? Do the marginalised form a potential force of political protest that can bring about a change towards greater equity, perhaps through a more development-orientated state form?
      Assist: The political economist and historian, Robert Cox, predicts that such a “bottom-up” driven change is indeed latent among the marginalised. Other political economists, such as Sandra MacLean (2004:2) argue that inequality has become a threat to human security and is now a “functional” issue of public policy because “...people whose needs are not met are less likely to be productive economically and/or they are more likely to become militantly aggressive in protesting their condition.”
      Person: ${question}?
      Assist: `,
      temperature: .9, // Higher values means the model will take more risks.
      max_tokens: 4096, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 1, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });
    console.log(response);
    res.status(200).send({
      bot: response.data.choices[0].text,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send(error || "Something went wrong");
  }
});

app.listen(8000, () => {
  console.log("App is running...");
});
