"use client";

import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";


import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {


  const socket = useRef<any>(null);

  const [showDialog, setShowDialog] = useState<boolean>(true);

  useEffect(() => {
    socket.current = io();

    socket.current.on("connect", () => {
      socket.current.emit("join_room", "tushar")
    })
  }, [])

  




  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h2>
        Welcome to Socket.io Tutorial
      </h2>
      <Button onClick={() => setShowDialog(true)} className="mt-4">
        Join
      </Button>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <form>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Enter Name</DialogTitle>
              <DialogDescription>
                Enter your name to join the room
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Join Group</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </div>
  );
}
