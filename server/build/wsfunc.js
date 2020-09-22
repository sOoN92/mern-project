"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = __importDefault(require("./models/messages"));
exports.clients = [];
function setClients(newClients) {
    exports.clients = newClients;
}
exports.setClients = setClients;
const date = new Date();
function broadcastMessage(message, ws) {
    const newMessage = new messages_1.default({
        email: ws.connectionID,
        message: message.message,
        date: Date.now()
    });
    newMessage.save(); // queue the task in bg
    // broadcast to all clients
    for (let index = 0; index < exports.clients.length; index++) {
        const client = exports.clients[index];
        client.send(JSON.stringify({
            message: message.message,
            user: ws.connectionID,
            intent: 'chat',
            date
        }));
    }
}
exports.broadcastMessage = broadcastMessage;
async function retrieveAndSendMessage(ws, count) {
    const messages = await messages_1.default.find({}, { email: 1, message: 1, date: 1 }).sort({ date: 1 }).limit(count).lean();
    ws.send(JSON.stringify({
        intent: 'old-messages',
        data: messages
    }));
}
exports.retrieveAndSendMessage = retrieveAndSendMessage;
