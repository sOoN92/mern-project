import WebSocket from 'ws';
import { processMessage, CustomWebSocket, JWT_SECRET_TOKEN } from './utilities';
import http from 'http';
import jwt from 'jsonwebtoken';
import { broadcastMessage, clients, setClients, retrieveAndSendMessage } from './wsfunc';

const server = http.createServer();
const wss = new WebSocket.Server({ noServer: true });


wss.on('connection', function connection(ws: CustomWebSocket) {
    // a single client has joined
    clients.push(ws);

    ws.on('close', () => {
        setClients(clients.filter(genWs => genWs.connectionID !== ws.connectionID));
    });

    ws.on('message', function incoming(payload) {
        const message = processMessage(payload.toString());
        if (!message) {
            return;
        }

        if (message.intent === 'chat') {
            broadcastMessage(message, ws);
        } else if (message.intent === 'old-messages') {
            const count = message.count;
            if (!count) return;
            retrieveAndSendMessage(ws, count);
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
