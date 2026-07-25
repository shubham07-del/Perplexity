import { generateResponse, generateTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";
import redis from "../config/cache.js";
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

    await redis.del(`chats:${req.user.id}`);
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
    const cachedChats = await redis.get(`chats:${user.id}`)
    if(cachedChats){
      return res.status(200).json({
        message:"chats retrieved successfully.",
        success:true,
        chats:JSON.parse(cachedChats)
      })
    }
    const chat = await chatModel.find({user:user.id}).lean()
    await redis.set(`chats:${user.id}`,JSON.stringify(chat),"EX",300)

    res.status(200).json({
        message:"Chat retrieved successfully.",
        chat
    })
}

export async function getMessages(req, res) {
    const {chatId} = req.params
    const cachedMessage = await redis.get(`messages:${chatId}`)
    if(cachedMessage){
        return res.status(200).json({
            message:"messages fetched successfully.",
            success:true,
            messages:JSON.parse(cachedMessage)
        })
    }
    const chat = await chatModel.findOne({
        _id:chatId,
        user:req.user.id
    }).lean()

    if(!chat){
        return res.status(404).json({
            message:"Chat not found"
        })
    }


    const messages = await messageModel.find({
        chat:chatId
    }).lean()
    await redis.set(`messages:${chatId}`,JSON.stringify(messages),"EX",300)

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