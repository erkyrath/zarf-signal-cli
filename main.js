const net = require('net');
const child_process = require('child_process');
const SignalClient = require('signal-client');

var localport = 8000;
if (process.argv.length >= 3)
    localport = 1 * process.argv[2];

const client = new SignalClient('zarf-signal-cli');
var connections = [];

function accept_connection(conn) {
    console.log('client connected');
    connections.push(conn);

    var inbuf = Buffer.alloc(0);

    conn.on('end', () => {
        console.log('client disconnected');
        connections = connections.filter(val => (val !== conn));
    });

    conn.on('data', (buf) => {
        inbuf = Buffer.concat([ inbuf, buf ]);

        while (inbuf.length) {
            var pos = inbuf.indexOf(10);
            if (pos < 0)
                break;
            var str = inbuf.toString('utf8', 0, pos+1);
            str = str.trim();
            if (str.length)
                sendmessage(str);
            inbuf = inbuf.slice(pos+1);
        }
    });
}

function sendmessage(str) {
    var address = null;

    var match = str.match('^([+][0-9]+)(.*)$');
    if (match) {
        address = match[1].trim();
        str = match[2].trim();
    }
    else {
        address = lastaddress;
    }

    if (!address) {
        gotmessage('no current address', null);
        return;
    }

    client.sendMessage(address, str);
}

function gotmessage(str, sender) {
    var line;

    if (sender) {
        lastaddress = sender;
        line = sender + ' ' + str + '\n';
    }
    else {
        sender = '';
        line = '[' + str + ']\n';
    }

    if (!connections.length) {
        var proc = child_process.execFile('terminal-notifier', [ '-title', 'Signal', '-subtitle', sender ]);
        proc.stdin.write(line);
        proc.stdin.end();
    }
    else {
        for (var conn of connections) {
            conn.write(line);
        }
    }
}

var server = net.createServer(accept_connection);

server.on('error', (err) => {
    throw err;
});

server.listen({ host:'localhost', port:localport }, () => {
    console.log('server listening on port ' + localport + '...');
});


client.on('message', (ev) => {
    console.log('received message from', ev.data.source, ev.data);
    gotmessage(ev.data.message.body, ev.data.source);
    //### ev.data.attachments?
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
