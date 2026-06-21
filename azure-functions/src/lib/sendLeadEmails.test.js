const test = require("node:test");
const assert = require("node:assert/strict");
const { sendLeadEmails } = require("./sendLeadEmails");

const lead = {
    fullName: "ישראל ישראלי",
    email: "lead@example.com",
    municipality: "חיפה",
    role: "גזבר",
    phone: "050-0000000"
};

const mailConfig = {
    client: {},
    senderAddress: "noreply@fincity.co.il",
    internalTo: "team@example.com",
    replyTo: "team@example.com",
    replyToDisplayName: "שלו | Fincity",
    ceoTo: "ceo@example.com"
};

function createRecorder(overrides = {}) {
    const calls = [];
    const sendEmailFn = async (_client, _sender, message) => {
        if (overrides.failFor === message.to) {
            throw new Error(`Failed to send to ${message.to}`);
        }
        calls.push(message);
    };

    return { calls, sendEmailFn };
}

test("sends internal, lead auto-reply, and ceo emails", async () => {
    const { calls, sendEmailFn } = createRecorder();

    const result = await sendLeadEmails({
        mailConfig,
        lead,
        submittedAt: "21.6.2026, 12:00:00",
        sendEmailFn
    });

    assert.strictEqual(calls.length, 3);
    assert.strictEqual(calls[0].to, "team@example.com");
    assert.strictEqual(calls[1].to, "lead@example.com");
    assert.match(calls[1].html, /שלום ישראל ישראלי/);
    assert.strictEqual(calls[1].replyToDisplayName, "שלו | Fincity");
    assert.strictEqual(calls[2].to, "ceo@example.com");
    assert.match(calls[2].subject, /Fincity/);
    assert.strictEqual(result.ceoNotified, true);
});

test("skips ceo email when MAIL_CEO_TO is missing", async () => {
    const { calls, sendEmailFn } = createRecorder();
    const logs = [];

    const result = await sendLeadEmails({
        mailConfig: { ...mailConfig, ceoTo: "" },
        lead,
        submittedAt: "21.6.2026, 12:00:00",
        sendEmailFn,
        logFn: (message) => logs.push(message)
    });

    assert.strictEqual(calls.length, 2);
    assert.strictEqual(result.ceoNotified, false);
    assert.match(logs.join(" "), /MAIL_CEO_TO is not configured/);
});

test("returns success when only ceo email fails", async () => {
    const { sendEmailFn } = createRecorder({ failFor: "ceo@example.com" });
    const logs = [];
    let threw = false;

    try {
        const result = await sendLeadEmails({
            mailConfig,
            lead,
            submittedAt: "21.6.2026, 12:00:00",
            sendEmailFn,
            logFn: (message) => logs.push(message)
        });

        assert.strictEqual(result.ceoNotified, false);
    } catch (error) {
        threw = true;
    }

    assert.strictEqual(threw, false);
    assert.match(logs.join(" "), /CEO notification email failed/);
});

test("throws when internal email fails", async () => {
    const { sendEmailFn } = createRecorder({ failFor: "team@example.com" });

    await assert.rejects(
        () => sendLeadEmails({
            mailConfig,
            lead,
            submittedAt: "21.6.2026, 12:00:00",
            sendEmailFn
        }),
        /Failed to send to team@example.com/
    );
});

test("throws when lead auto-reply fails", async () => {
    const { sendEmailFn } = createRecorder({ failFor: "lead@example.com" });

    await assert.rejects(
        () => sendLeadEmails({
            mailConfig,
            lead,
            submittedAt: "21.6.2026, 12:00:00",
            sendEmailFn
        }),
        /Failed to send to lead@example.com/
    );
});
