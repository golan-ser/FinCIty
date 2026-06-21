const { EmailClient } = require("@azure/communication-email");

function getMailConfig() {
    const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;
    const senderAddress = process.env.MAIL_FROM;
    const internalTo = process.env.MAIL_INTERNAL_TO;
    const replyTo = process.env.MAIL_REPLY_TO || internalTo;
    const ceoTo = process.env.MAIL_CEO_TO || "";
    const replyToDisplayName = process.env.MAIL_REPLY_TO_DISPLAY || "שלו | Fincity";

    if (!connectionString || !internalTo || !senderAddress) {
        throw new Error("Mail configuration is incomplete.");
    }

    return {
        client: new EmailClient(connectionString),
        senderAddress,
        internalTo,
        replyTo,
        ceoTo,
        replyToDisplayName
    };
}

async function sendEmail(client, senderAddress, { to, subject, text, html, replyTo, replyToDisplayName } = {}) {
    const message = {
        senderAddress,
        content: {
            subject,
            plainText: text,
            html
        },
        recipients: {
            to: [{ address: to }]
        }
    };

    if (replyTo) {
        message.replyTo = [{
            address: replyTo,
            displayName: replyToDisplayName || undefined
        }];
    }

    const poller = await client.beginSend(message);
    await poller.pollUntilDone();
}

module.exports = {
    getMailConfig,
    sendEmail
};
