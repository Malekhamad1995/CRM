import { config } from '../config/config';

export const ProcessStatusMethod = 'ProcceseStatus';

const signalR = require('@microsoft/signalr');

export function ImportFileNotificationHub() {
// const connection = new signalR.HubConnectionBuilder()
// .withUrl(`${config.ws_address}/WsFileManager/ImportNotificationHub?userId=${JSON.parse(localStorage.getItem('session')).userId}`, {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
// }).build();

// connection.on('send', (data) => {
//     console.log(data);
// });

// connection.start()
//     .then(() => connection.invoke('send', 'Hello'));
}

// const signalR = require("@microsoft/signalr");

// let connection = new signalR.HubConnectionBuilder()
//     .withUrl("http://localhost:5001/hubs/chat", { transport: signalR.HttpTransportType.WebSockets })
//     .configureLogging(signalR.LogLevel.Debug)
//     .build();

// connection.start()
//     .then(() => console.log("Connection started"))
//     .catch(e => console.log(e));
