"use client"

import { useState, useEffect } from "react"
import { ArrowUp, Square } from "lucide-react"
import { redirect } from "next/navigation";
import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container"

import {
  Message,
  MessageContent,
} from "@/components/ui/message"

import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"

import { Button } from "@/components/ui/button";

import { useUserStore } from "../../../lib/store/user.store"

function Page() {
  const [messages] = useState([
    {
      id: 1,
      userName: "tushar",
      message: "Hey there",
    },
    {
      id: 2,
      userName: "Rohit",
      message: "Hello!",
    },
    {
      id: 3,
      userName: "tushar",
      message: "How are you doing?",
    },
    {
      id: 4,
      userName: "Shubham",
      message: "Hi everyone!",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useUserStore();

  const handleSubmit = () => {
    if (!input.trim()) return

    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      setInput("")
    }, 1000)
  }


  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

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
            {messages.map((message) => {
              const isMe = message.userName === "tushar"

              return (
                <Message
                  key={message.id}
                  className={isMe ? "justify-end" : "justify-start"}
                >
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
              )
            })}
          </ChatContainerContent>
        </ChatContainerRoot>

        {/* Input */}
        <div className="border-t bg-background p-4">
          <PromptInput
            value={input}
            onValueChange={setInput}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full"
          >
            <PromptInputTextarea placeholder="Type a message..." />

            <PromptInputActions className="justify-end pt-2">
              <PromptInputAction
                tooltip={isLoading ? "Stop" : "Send"}
              >
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={handleSubmit}
                >
                  {isLoading ? (
                    <Square className="size-4 fill-current" />
                  ) : (
                    <ArrowUp className="size-4" />
                  )}
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