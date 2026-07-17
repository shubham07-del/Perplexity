import { ChatMistralAI } from "@langchain/mistralai";

import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const model_one = new ChatMistralAI({
  model: "mistral-small-latest",
  temperature: 0,
});

export const generateResponse = async (messages) => {
  const respose = await model_one.invoke(messages.map(msg=>{
    if(msg.role=="user"){
      return new HumanMessage(msg.content)
    }
    else if(msg.role=="ai"){
      return new AIMessage(msg.content)
    }
  }));
  return respose.text;
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
