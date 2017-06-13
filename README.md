
Despite the name, this is not a command-line client for Signal. It is a very simple relay from your Signal account to a desktop machine. That is, it receives Signal messages and makes them available on a Mac/Win/Linux box, by way of an open (local) socket.

What does that mean? Once this is running, you can access your Signal account by typing:

    telnet localhost 8000

Received messages will show up in the telnet stream. To send a message, type

    +123456789 Hello!

If your message does not start with "+NUMBER", the message will go to whichever Signal address you last sent or received a message from.

It's more likely that you've written another program which is using this relay socket. If so, you should know:

- Messages are UTF-8-encoded.
- Messages (in both directions) are whitespace-stripped left and right.
- The socket is only accessible on localhost.

## Obvious warnings

This script is a bad idea and you shouldn't run it. If you do run it, keep it on a secure machine which nobody else has access to.

All of Signal's guarantees about privacy and security end here. Once the script is running and authorized, any software on the machine can read and write Signal messages using your identity.

If you're conversing with two Signal addresses at once, you'll probably get confused and accidentally send a message to the wrong one.

The [underlying client library][node-signal-client] is a "dirty port" (their words!) of the Signal Chrome App. Nobody's making any guarantees about it.

[node-signal-client]: https://github.com/matrix-hacks/node-signal-client

## Setting up

The first time you run the script, it will display a QR code. (Make sure you are running the script in a terminal which supports ANSI color!) In your mobile Signal app, select "Linked Devices", then "Link New Device", and scan this QR code. This will give the script access to your Signal account. It will appear as a linked device named "zarf-signal-cli".

You can unlink the script at any time in your mobile Signal app. This removes its permission to use your account.

The client library stores authentication data in the current working directory, in a `data` subdir and two `.sqlite` files. You probably want to `cd` to a private directory before running this.

