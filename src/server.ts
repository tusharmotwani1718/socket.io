// this file contains the endpoint to start socket.io server
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const ROOM_ID = "realtime_group_chat";

const app = next({
    dev,
    hostname,
    port,
});
const handler = app.getRequestHandler();

;(async () => {
    await app.prepare();

    const httpServer = createServer(handler);

    const io = new Server(httpServer);

    io.on("connection", (socket) => {
        console.log(`user connected: ${socket.id}`);

        // receive join room event:
        socket.on("join_room", async (userName: string) => {
            console.log(`user: ${userName} joined the room`);

            await socket.join(ROOM_ID);

            // send to all (this event is listened by all users including the sender):
            // io.to(ROOM_ID).emit("EVENT_NAME", data);

            // broadcast the event to all other users in the room (this event is listened by other users)
            socket.to(ROOM_ID).emit("join_notification", userName);            
        })
    });

    httpServer
        .once("error", (err) => {
            console.error(err);
            process.exit(1);
        })
        .listen(port, () => {
            console.log(`> Ready on http://${hostname}:${port}`);
        });

})()