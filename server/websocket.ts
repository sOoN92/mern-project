import WebSocket from 'ws';
import { processMessage, CustomWebSocket, JWT_SECRET_TOKEN } from './utilities';
import Message from './models/messages';
import http from 'http';
import jwt from 'jsonwebtoken';

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });

let clients: CustomWebSocket[] = [];
const date = new Date();

wss.on('connection', function connection(ws: CustomWebSocket) {
    // a single client has joined
    clients.push(ws);

    ws.on('close', () => {
        clients = clients.filter(genWs => genWs.connectionID !== ws.connectionID);
    });

    ws.on('message', function incoming(payload) {
        const message = processMessage(payload.toString());
        if (!message || message.intent !== 'chat') {
            return;
        }

        const newMessage = new Message({
            email: 'nicola@moramarco.com',
            message: message.message,
            date: Date.now()
        });

        newMessage.save(); // queue the task in bg

        // broadcast to all clients
        for (let index = 0; index < clients.length; index++) {
            const client = clients[index];
            client.send(JSON.stringify({
                message: message.message,
                user: ws.connectionID,
                intent: 'chat',
                date
            }));
        }
    });
});

server.on('upgrade', function upgrade(request, socket, head) {
    // This function is not defined on purpose. Implement it with your own logic.

    const token = request.url.slice(1); // / + jwt token

    let email: string = '';

    try {
        const payload: any = jwt.verify(token, JWT_SECRET_TOKEN);
        email = payload.email;
    } catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }

    wss.handleUpgrade(request, socket, head, function done(ws) {
        const _ws = ws as CustomWebSocket;
        _ws.connectionID = email;
        wss.emit('connection', ws, request);
    });

});

server.listen(1338);
