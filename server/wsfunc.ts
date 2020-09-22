import { CustomWebSocket } from "./utilities";
import Message from './models/messages';

export let clients: CustomWebSocket[] = [];

export function setClients(newClients: CustomWebSocket[]) {
    clients = newClients;
}

const date = new Date();

export function broadcastMessage(message: any, ws: CustomWebSocket) {
    const newMessage = new Message({
        email: ws.connectionID,
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
}

export async function retrieveAndSendMessage(ws: CustomWebSocket, count: number) {
    const messages = await Message.find({}, {email: 1, message: 1, date: 1}).sort({date: 1}).limit(count).lean();

    ws.send(JSON.stringify({
        intent: 'old-messages',
        data: messages
    }));
}