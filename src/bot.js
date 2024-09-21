const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

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

    // Log the incoming message
    if (message.from.includes("[number]"))
    {
        console.log("recieved message from [number]")
        // message.reply(message.body)
    }

    console.log(`Received message: ${message.body} from ${message.from}`);

    // Example: Respond to a specific message
    if (message.body === 'Hello bot') {
        message.reply('Hello! How can I assist you?');
    }
});

client.initialize();

// some helpful logs to see the format of the messages:
// Received message: סקיבידי טוילט ריז סיגמה מה לעזאסיגמה ריז עם הגיאט של הבומבוקלאט גיגה ג'יגה ניגה סקיבידי from [number]@c.us   -   this is from a single person (c.us at the end)
// message from mom 
// Received message: אי from [number]-1469259523@g.us
// Received message:  from 120363338272329737@g.us
// Received message: ניסוי חברתי from 120363338272329737@g.us   -   this is from a group created by me   (g.us at the end)
// Received message: שמעו לי אם רוצים לעשות כסף צריך למכור משקפי טכנו from [number]-1476455280@g.us   -   this is from another group (g.us at the end)