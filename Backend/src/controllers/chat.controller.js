import { generateResponse, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  const { message, chat: chatId } = req.body;

  let title = null;
  let chat = null;

  if (!chatId) {
    title = await generateTitle(message);
    chat = await chatModel.create({
      user: req.user.id,
      title,
    });
  }

  const userMessage = await messageModel.create({
    chat: chatId || chat._id,
    role: "user",
    content: message,
  });

  const messages = await messageModel.find({ chat: chatId || chat._id });

  // 1. Set SSE Headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // Ensure headers are sent immediately

  // 2. Send Start Event with chat metadata
  const startData = {
    type: "start",
    chatId: chatId || chat._id,
    title: title, // only present if new chat
  };
  res.write(`data: ${JSON.stringify(startData)}\n\n`);

  // 3. Stream the AI response
  const result = await generateResponse(messages, res);

  // 4. Save final AI message to DB
  const aiMessage = await messageModel.create({
    chat: chatId || chat._id,
    role: "ai",
    content: result,
  });

  // 5. Send Done Event and End Stream
  res.write(`data: ${JSON.stringify({ type: "done" })}\n\n`);
  res.end();
}


export async function getChats(req,res) {
    const user = req.user
    const chat = await chatModel.find({user:user.id})

    res.status(200).json({
        message:"Chat retrieved successfully.",
        chat
    })
}

export async function getMessages(req, res) {
    const {chatId} = req.params
    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    const messages = await messageModel.find({
        chat:chatId
    })
    res.status(200).json({
        message:"chat message fetched successfully.",
        messages
    })
}


export async function deleteChat(req,res) {
    const {chatId} = req.params

    const chat = await chatModel.findOneAndDelete({
        _id:chatId,
        user:req.user.id
    })

    await messageModel.deleteMany({
        chat:chatId
    })

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }

    res.status(200).json({
        message:"chat deleted successfully."
    })
}