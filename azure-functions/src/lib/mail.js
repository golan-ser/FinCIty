const { EmailClient } = require("@azure/communication-email");

const DEFAULT_CEO_TO = "shalevroz4@gmail.com";

function getMailConfig() {
    const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;
    const senderAddress = process.env.MAIL_FROM || "DoNotReply@fincity.co.il";
    const internalTo = process.env.MAIL_INTERNAL_TO;
    const replyTo = process.env.MAIL_REPLY_TO || internalTo;
    const ceoTo = process.env.MAIL_CEO_TO || DEFAULT_CEO_TO;

    if (!connectionString || !internalTo) {
        throw new Error("Mail configuration is incomplete.");
    }

    return {
        client: new EmailClient(connectionString),
        senderAddress,
        internalTo,
        replyTo,
        ceoTo
    };
}

async function sendEmail(client, senderAddress, { to, subject, text, html, replyTo, replyToDisplayName, senderDisplayName } = {}) {
    const message = {
        senderAddress: senderDisplayName
            ? { address: senderAddress, displayName: senderDisplayName }
            : senderAddress,
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
    DEFAULT_CEO_TO,
    getMailConfig,
    sendEmail
};
