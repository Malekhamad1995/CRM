import { config } from '../config/config';

export const ProcessStatusMethod = 'ProcceseStatus';

const signalR = require('@microsoft/signalr');

export const NotificationListener = 'NotificationListener';
export function CrmDfmNotificationHub() {
const connection = new signalR.HubConnectionBuilder()

.withUrl(`${config.ws_address}/WsCrmDfm/NotificationHub?source=${config.source}`, {
    accessTokenFactory: () => `Bearer ${JSON.parse(localStorage.getItem('session')).token}`,
    skipNegotiation: true,
    transport: signalR.HttpTransportType.WebSockets
}).build();
console.log('connection: ', connection);
connection.on('send', (data) => {
    console.log(data);
});

connection.start()
    .then(() => connection.invoke('send', 'Hello'));
}
