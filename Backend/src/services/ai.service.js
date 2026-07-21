import { ChatMistralAI } from "@langchain/mistralai";
import { tool } from "@langchain/core/tools";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { z } from "zod";
import { searchINternet } from "./webSearch.service.js";
import { sendEmail } from "./mail.service.js";



const model_one = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

const searchInternetTool = tool(searchINternet, {
  name: "searchInternet",
  description:
    "Search the internet for real-time, up-to-date information. Use this for current events, latest news, live data, recent updates, or any question requiring information beyond your training data.",
  schema: z.object({
    query: z.string().describe("The search query to look up on the internet."),
  }),
});

const emailTool = tool(sendEmail, {
  name: "emailTool",
  description: "use this tool to send an email",
  schema: z.object({
    to: z.string().describe("The recipient's email address"),
    html: z.string().describe("The HTML content for email"),
    subject: z.string().describe("the subject of email"),
  }),
});

const agent = createReactAgent({
  llm: model_one,
  tools: [searchInternetTool, emailTool],
});

export const generateResponse = async (messages, res) => {
  const stream = await agent.stream(
    {
      messages: [
        new SystemMessage(`You are Signature AI, a helpful and knowledgeable assistant.

Today's date and time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "full", timeStyle: "short" })}.

IMPORTANT — Tool Usage Rules:
1. You have access to a "searchInternet" tool that searches the web for real-time information.
2. You MUST use the searchInternet tool when the user asks about:
   - Current events, news, or anything happening "today", "recently", "right now", or "latest"
   - Real-time data like stock prices, weather, sports scores, or election results
   - Information about events, releases, or updates after your training data cutoff
   - Any question where up-to-date accuracy is critical (e.g. "Who is the current president of X?")
   - Product launches, version releases, or recent announcements
3. When using the tool, extract a clear and concise search query from the user's question.
4. After receiving search results, synthesize them into a clear, well-structured answer. Cite sources when possible.
5. If the user's question can be fully answered from your training data (general knowledge, math, coding, etc.), answer directly WITHOUT using the tool.

Always be concise, accurate, and helpful. Use markdown formatting for readability when appropriate.`),
        ...messages.map((msg) => {
          if (msg.role == "user") {
            return new HumanMessage(msg.content);
          } else if (msg.role == "ai") {
            return new AIMessage(msg.content);
          }
        }),
      ],
    },
    {
      streamMode: "messages",
    },
  );
  let fullResponse = "";

  for await (const chunk of stream) {
    const message = Array.isArray(chunk) ? chunk[0] : chunk;
    const metadata = Array.isArray(chunk) ? chunk[1] : {};

    // Do not stream the tool's raw output back to the user
    if (metadata?.langgraph_node === "tools") continue;
    if (message?.constructor?.name?.includes("Tool")) continue;
    if (typeof message?._getType === "function" && message._getType() === "tool") continue;

    // Only stream string content chunks from the AI
    if (message && message.content && typeof message.content === "string") {
      fullResponse += message.content;
      res.write(`data: ${JSON.stringify({ type: 'chunk', content: message.content })}\n\n`);
    }
  }

  return fullResponse;
};

export const generateTitle = async (message) => {
  const response = await model_one.invoke([
    new SystemMessage(`
            You are a helpful assistant that generates concise and descriptive titles for chat conversations.
User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, giving users a quick understanding of the chat's topic.
            `),
    new HumanMessage(`
                Generate a title for a chat conversation based on following first messge:  
                "${message}" 
                `),
  ]);

  return response.text;
};
