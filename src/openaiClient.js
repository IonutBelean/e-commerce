// src/openaiClient.js
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey:
    "k-proj-anMhZ8va1aAldPTgxt4YKEuuS-z6cvELDidYWnkWhbFHrNHjEavvc3rOTLAzD6FRymsqZL8hX0T3BlbkFJFUMIs5cOxYZNnKmB5GjbKwVor6NsmT5jeMGHQsAxHqSgJSz4ZfjL5TtuQIt0lSEu_sBkdPUewA", // ⚠️ Înlocuiește cu cheia ta OpenAI temporar (doar pentru test)
});

const openai = new OpenAIApi(configuration);
export default openai;
