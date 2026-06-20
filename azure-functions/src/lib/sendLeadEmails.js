const { buildInternalEmail } = require("../templates/internalEmail");
const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");
const { buildCeoNotificationEmail } = require("../templates/ceoNotificationEmail");

const DEFAULT_CEO_TO = "shalevroz4@gmail.com";

async function sendLeadEmails({ mailConfig, lead, submittedAt, sendEmailFn, logFn = () => {} } = {}) {
    const internalEmail = buildInternalEmail({ lead, submittedAt });
    const autoReplyEmail = buildAutoReplyEmail({
        lead,
        replyToEmail: mailConfig.replyTo
    });
    const ceoEmail = buildCeoNotificationEmail({ lead });
    const ceoTo = mailConfig.ceoTo || DEFAULT_CEO_TO;

    await sendEmailFn(mailConfig.client, mailConfig.senderAddress, {
        to: mailConfig.internalTo,
        subject: internalEmail.subject,
        text: internalEmail.text,
        html: internalEmail.html,
        replyTo: lead.email,
        replyToDisplayName: lead.fullName
    });

    await sendEmailFn(mailConfig.client, mailConfig.senderAddress, {
        to: lead.email,
        subject: autoReplyEmail.subject,
        text: autoReplyEmail.text,
        html: autoReplyEmail.html,
        replyTo: mailConfig.replyTo,
        replyToDisplayName: autoReplyEmail.senderDisplayName || "שלו | Fincity",
        senderDisplayName: autoReplyEmail.senderDisplayName || "שלו | Fincity"
    });

    let ceoNotified = false;

    try {
        await sendEmailFn(mailConfig.client, mailConfig.senderAddress, {
            to: ceoTo,
            subject: ceoEmail.subject,
            text: ceoEmail.text,
            html: ceoEmail.html,
            senderDisplayName: ceoEmail.senderDisplayName
        });
        ceoNotified = true;
    } catch (error) {
        logFn("CEO notification email failed.");
    }

    return { ceoNotified, ceoTo };
}

module.exports = {
    DEFAULT_CEO_TO,
    sendLeadEmails
};
