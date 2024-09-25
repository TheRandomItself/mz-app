const { Client, LocalAuth } = require('whatsapp-web.js');
const BTree = require('sorted-btree').default;
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
const PORT = 3000;
const HOST = 'localhost'

var messages = new BTree(undefined, (a, b) => {
    if (a > b)
      return 1; 
    else
      return -1; 
  });

///////////////////////////////////////////////////////////////////////////////////////////
//                        Initializing just for testing
//                              DELETE THIS LATER
///////////////////////////////////////////////////////////////////////////////////////////
messages.set(3, { from: 'Alice', body: 'Hello', timestamp: 3 });
messages.set(2, { from: 'Bob', body: 'Hi', timestamp: 2 });
messages.set(1, { from: 'Charlie', body: 'Hey', timestamp: 1 });
messages.set(4, { from: 'Charlie', body: 'Hey', timestamp: 4 });
messages.set(10, { from: 'Charlie', body: 'Hey', timestamp: 10 });
messages.set(20, { from: 'Charlie', body: 'Hey', timestamp: 20 });
console.log("created messages and the messages are: ")
console.log(messages)
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    // Generate and display QR code for authentication
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('Authenticated successfully!');
});

client.on('message', message => {

    const newMessage = {
        from: message.from,
        body: message.body,
        timestamp: message.timestamp
    };

    messages.set(newMessage.timestamp, newMessage);


    //TODO: just for testing DELETE LATER
    if (message.from.includes("[number]]"))
    {
        console.log("recieved message from [number]")
    }

    console.log(`Received message: ${message.body} from ${message.from}`);
});

client.initialize();


app.get('/:unixTime', (req, res) => {
    const unixTime = req.params.unixTime;
 
    const timestamp = parseInt(unixTime, 10);

    if (!isNaN(timestamp)) {
        const date = new Date(timestamp);
        const currentTimeMilliseconds = new Date().getTime()
        let messageRange = messages.getRange(timestamp, currentTimeMilliseconds)
        res.status(200).send(messageRange)
        // res.status(200).send(`Unix Time: ${unixTime} corresponds to ${date.toISOString()}`);
    } else {
        res.status(400).send('Invalid unixTime parameter.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://${HOST}:${PORT}`);
});

// some helpful logs to see the format of the messages:
// Received message: סקיבידי טוילט ריז סיגמה מה לעזאסיגמה ריז עם הגיאט של הבומבוקלאט גיגה ג'יגה ניגה סקיבידי from [number]@c.us   -   this is from a single person (c.us at the end)
// message from mom 
// Received message: אי from [number]-1469259523@g.us
// Received message:  from 120363338272329737@g.us
// Received message: ניסוי חברתי from 120363338272329737@g.us   -   this is from a group created by me   (g.us at the end)
// Received message: שמעו לי אם רוצים לעשות כסף צריך למכור משקפי טכנו from [number]-1476455280@g.us   -   this is from another group (g.us at the end)