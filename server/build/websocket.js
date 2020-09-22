"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const utilities_1 = require("./utilities");
const messages_1 = __importDefault(require("./models/messages"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server = http_1.default.createServer();
const wss = new ws_1.default.Server({ noServer: true });
let clients = [];
const date = new Date();
wss.on('connection', function connection(ws) {
    // a single client has joined
    clients.push(ws);
    ws.on('close', () => {
        clients = clients.filter(genWs => genWs.connectionID !== ws.connectionID);
    });
    ws.on('message', function incoming(payload) {
        const message = utilities_1.processMessage(payload.toString());
        if (!message || message.intent !== 'chat') {
            return;
        }
        const newMessage = new messages_1.default({
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
    let email = '';
    try {
        const payload = jsonwebtoken_1.default.verify(token, utilities_1.JWT_SECRET_TOKEN);
        email = payload.email;
    }
    catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
    }
    wss.handleUpgrade(request, socket, head, function done(ws) {
        const _ws = ws;
        _ws.connectionID = email;
        wss.emit('connection', ws, request);
    });
});
server.listen(1338);
