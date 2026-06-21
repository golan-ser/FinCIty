const { buildInternalEmail } = require("../templates/internalEmail");
const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");
const { buildCeoNotificationEmail } = require("../templates/ceoNotificationEmail");

async function sendLeadEmails({ mailConfig, lead, submittedAt, sendEmailFn, logFn = () => {} } = {}) {
    const internalEmail = buildInternalEmail({ lead, submittedAt });
    const autoReplyEmail = buildAutoReplyEmail({
        lead,
        replyToEmail: mailConfig.replyTo
    });
    const ceoEmail = buildCeoNotificationEmail({ lead });
    const ceoTo = mailConfig.ceoTo;

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
        replyToDisplayName: mailConfig.replyToDisplayName
    });

    let ceoNotified = false;

    if (!ceoTo) {
        logFn("CEO notification skipped: MAIL_CEO_TO is not configured.");
    } else {
        try {
            await sendEmailFn(mailConfig.client, mailConfig.senderAddress, {
                to: ceoTo,
                subject: ceoEmail.subject,
                text: ceoEmail.text,
                html: ceoEmail.html
            });
            ceoNotified = true;
        } catch (error) {
            logFn("CEO notification email failed.");
        }
    }

    return { ceoNotified, ceoTo: ceoTo || null };
}

module.exports = {
    sendLeadEmails
};
