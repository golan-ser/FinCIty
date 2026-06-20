const { app } = require("@azure/functions");
const { normalizeLead, formatTimestamp } = require("../lib/validateLead");
const { parseJsonBody } = require("../lib/parseBody");
const { getMailConfig, sendEmail } = require("../lib/mail");
const { buildInternalEmail } = require("../templates/internalEmail");
const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
};

function jsonResponse(status, body) {
    return {
        status,
        headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8"
        },
        jsonBody: body
    };
}

app.http("sendLead", {
    methods: ["POST", "OPTIONS"],
    authLevel: "anonymous",
    route: "sendlead",
    handler: async (request, context) => {
        if (request.method === "OPTIONS") {
            return {
                status: 204,
                headers: corsHeaders
            };
        }

        let body;
        try {
            body = await parseJsonBody(request);
        } catch (error) {
            context.log("Invalid JSON payload received.");
            return jsonResponse(400, { error: "Invalid request body." });
        }

        const validation = normalizeLead(body);
        if (validation.error) {
            return jsonResponse(400, { error: validation.error });
        }

        const { lead } = validation;
        const submittedAt = formatTimestamp();

        try {
            const mailConfig = getMailConfig();
            const internalEmail = buildInternalEmail({ lead, submittedAt });
            const autoReplyEmail = buildAutoReplyEmail({
                lead,
                replyToEmail: mailConfig.replyTo
            });

            await sendEmail(mailConfig.client, mailConfig.senderAddress, {
                to: mailConfig.internalTo,
                subject: internalEmail.subject,
                text: internalEmail.text,
                html: internalEmail.html,
                replyTo: lead.email,
                replyToDisplayName: lead.fullName
            });

            await sendEmail(mailConfig.client, mailConfig.senderAddress, {
                to: lead.email,
                subject: autoReplyEmail.subject,
                text: autoReplyEmail.text,
                html: autoReplyEmail.html,
                replyTo: mailConfig.replyTo,
                replyToDisplayName: "צוות Fincity"
            });

            context.log(`Lead submitted for municipality: ${lead.municipality}`);

            return jsonResponse(200, { success: true });
        } catch (error) {
            context.log("Failed to send lead emails.");
            return jsonResponse(500, { error: "Failed to process lead submission." });
        }
    }
});
