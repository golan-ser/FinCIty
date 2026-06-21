const { app } = require("@azure/functions");
const { normalizeLead, formatTimestamp } = require("../lib/validateLead");
const { parseJsonBody } = require("../lib/parseBody");
const { getMailConfig, sendEmail } = require("../lib/mail");
const { sendLeadEmails } = require("../lib/sendLeadEmails");
const { getCorsHeaders } = require("../lib/cors");

function jsonResponse(request, status, body) {
    return {
        status,
        headers: {
            ...getCorsHeaders(request),
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
        const corsHeaders = getCorsHeaders(request);

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
            return jsonResponse(request, 400, { error: "Invalid request body." });
        }

        const validation = normalizeLead(body);
        if (validation.error) {
            return jsonResponse(request, 400, { error: validation.error });
        }

        const { lead } = validation;
        const submittedAt = formatTimestamp();

        try {
            const mailConfig = getMailConfig();

            await sendLeadEmails({
                mailConfig,
                lead,
                submittedAt,
                sendEmailFn: sendEmail,
                logFn: (message) => context.log(message)
            });

            context.log(`Lead emails sent. lead=${lead.email}, municipality=${lead.municipality}`);

            return jsonResponse(request, 200, { success: true });
        } catch (error) {
            context.log(`Failed to send lead emails: ${error?.message || error}`);
            return jsonResponse(request, 500, { error: "Failed to process lead submission." });
        }
    }
});
