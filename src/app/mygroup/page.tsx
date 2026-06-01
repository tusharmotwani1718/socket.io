"use client"

import { useState, useEffect } from "react"
import { ArrowUp, Square } from "lucide-react"
import { useRouter } from "next/navigation"
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container"

import {
  Message,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"

import { Button } from "@/components/ui/button";

import { useUserStore } from "../../../lib/store/user.store";
import { useMessageStore } from "../../../lib/store/message.store";

import { ws } from "../../lib/socket/ws"

import type { messageObject } from "../../../types/msg.types";

function Page() {

  const [input, setInput] = useState("")

  const { user } = useUserStore();
  const { messages, addMessage } = useMessageStore();

  const router = useRouter();

  const handleSendMessage = () => {
    if (!input.trim()) return

    const msgObject: messageObject = {
      id: Date.now(),
      userName: user!,
      message: input.trim(),
      ts: new Date().toISOString(),
    }

    addMessage(msgObject);

    ws.emit("chatMessage", msgObject);

    setInput("");

  }


  useEffect(() => {

    if (!user) {
      router.push("/");
    }

    const handleJoinNotification = (userName: string) => {
      console.log(`${userName} joined client side`);
    };

    const handleNewMessage = (msgObject: messageObject) => {
      console.log("message received", msgObject);
      addMessage(msgObject);
    };

    ws.on("join_notification", handleJoinNotification);

    ws.on("newMessage", handleNewMessage);

    ws.onAny((event, ...args) => {
      console.log("EVENT:", event, args);
    });

    ws.emit("join_room", user);

    return () => {
      ws.off("join_notification", handleJoinNotification);
      ws.off("newMessage", handleNewMessage);
    };
  }, []);



  return (
    <div className="h-screen bg-background">
      <div className="mx-auto flex h-full max-w-3xl flex-col">
        {
          user && (
            <div className="border-b p-4">
              <p className="text-sm text-muted-foreground">
                Logged in as <span className="font-medium">{user}</span>
              </p>
            </div>
          )
        }
        {/* Messages */}
        <ChatContainerRoot className="flex-1 overflow-hidden">
          <ChatContainerContent className="flex flex-col gap-4 p-4">
            {
              messages && messages.length > 0 ? (
                messages.map((message) => {
                  const isMe = message.userName === user

                  return (
                    <>
                      <Message
                        key={message.id}
                        className={isMe ? "justify-end" : "justify-start"}
                      >
                        {/* <MessageAvatar src="/avatars/ai.png" alt="AI" fallback="AI" /> */}
                        <MessageContent
                          className={
                            isMe
                              ? "max-w-xs rounded-2xl bg-primary text-primary-foreground"
                              : "max-w-xs rounded-2xl bg-muted text-foreground"
                          }
                        >
                          {message.message}
                        </MessageContent>

                      </Message>
                      <p className={`text-gray-400 font-serif text-xs ${isMe ? "text-right" : "text-left"}`}>
                        {message.userName}
                      </p>
                    </>
                  )
                })
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-4">
                  <h1 className="text-2xl font-semibold">No messages yet</h1>
                  <p className="text-muted-foreground">
                    Send a message to start a conversation
                  </p>
                </div>
              )
            }
          </ChatContainerContent>
        </ChatContainerRoot>

        {/* Input */}
        <div className="border-t bg-background p-4">
          <PromptInput
            value={input}
            onValueChange={setInput}
            onSubmit={handleSendMessage}
            className="w-full"
          >
            <PromptInputTextarea placeholder="Type a message..." />

            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip="Send"
              >
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSendMessage}
                >
                  <ArrowUp className="size-4" />
                </Button>
              </PromptInputAction>
            </PromptInputActions>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}

export default Page