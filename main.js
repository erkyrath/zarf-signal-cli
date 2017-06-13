const SignalClient = require('signal-client');

const client = new SignalClient('zarf-signal-cli');

client.on('message', (ev) => {
    console.log('received message from', ev.data.source, ev.data);
});
 
client.on('sent', (ev) => {
    console.log('sent a message to', ev.data.destination, ev.data);
});
 
client.on('receipt', (ev) => {
    var message = ev.proto;
    // message.timestamp, message.source, message.sourceDevice
});
 
 
client.on('contact', (ev) => {
    // console.log('contact received', ev.contactDetails);
});
 
client.on('group', (ev) => {
    // console.log('group received', ev.groupDetails);
});
 
client.on('read', (ev) => {
    var read_at   = ev.timestamp;
    var timestamp = ev.read.timestamp;
    var sender    = ev.read.sender;
    // console.log('read receipt', sender, timestamp);
});
 
client.on('error', (ev) => {
    console.log('error', ev.error, ev.error.stack);
});

client.start();
