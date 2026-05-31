# The web socket connection is a persistent connection between the client and the server. Unlike req-res cycle, the web socket connection is always open and can be used for real-time communication between the client and the server.

# The web socket connection is also bidirectional, which means that the client can send messages to the server and the server can send messages to the client in real time as the connection is always open.

# Socket.io: 
Advantages: 
- The connection will fall back to HTTP long-polling in case the WebSocket connection cannot be established.

# SERVER:

1. The web socket server relies on the http server for the connection initlizatio between the client and the server and also for the fallback.

2. In a web socket connection, the main part is an event. The sender (client/server) emits an event with some data and the receiver (client/server) can listen to the event and access the data.