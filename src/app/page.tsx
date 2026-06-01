"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label";
import { useUserStore } from "../../lib/store/user.store"

export default function Home() {


  const socket = useRef<any>(null);

  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { setUser } = useUserStore();

  useEffect(() => {
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.on("join_notification", (userName: string) => {
        // console.log(`user joined: ${userName} client message`);
        toast.info(`${userName} has joined the room`);
      })
    })



  }, [])




  const handleSubmit = (e: any) => {
    e.preventDefault();
    // console.log("data received", e.target.name.value);
    let name: string = e.target.name.value
    if (!name || name.trim() === "") return

    name = name.trim();

    socket.current.emit("join_room", name);
    setShowDialog(false);
    setUser(name);

    redirect("/mygroup");
  }




  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h2>
        Welcome to Socket.io Tutorial
      </h2>
      <Button onClick={() => setShowDialog(true)} className="mt-4">
        Join
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Enter Name</DialogTitle>
              <DialogDescription>
                Enter your name to join the room
              </DialogDescription>
            </DialogHeader>

            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input
                  id="name-1"
                  name="name"
                  defaultValue="John Doe"
                />
              </Field>
            </FieldGroup>

            <DialogFooter className={"my-3"}>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>

              <Button type="submit">
                Join Group
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
