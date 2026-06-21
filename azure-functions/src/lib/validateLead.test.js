const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeLead } = require("./validateLead");

test("accepts required fields only", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: " עיריית דוגמה"
    });

    assert.strictEqual(result.error, undefined);
    assert.strictEqual(result.lead.fullName, "ישראל ישראלי");
    assert.strictEqual(result.lead.role, "");
    assert.strictEqual(result.lead.phone, "");
});

test("accepts optional fields when provided", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: " עיריית דוגמה",
        role: "גזבר",
        phone: "050-0000000"
    });

    assert.strictEqual(result.lead.role, "גזבר");
    assert.strictEqual(result.lead.phone, "050-0000000");
});

test("rejects invalid email", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "not-an-email",
        municipality: " עיריית דוגמה"
    });

    assert.match(result.error, /מייל/);
});

test("rejects empty required fields", () => {
    assert.ok(normalizeLead({ email: "a@b.com", municipality: "x" }).error);
    assert.ok(normalizeLead({ fullName: "x", municipality: "x" }).error);
    assert.ok(normalizeLead({ fullName: "x", email: "a@b.com" }).error);
});

test("supports legacy payload keys", () => {
    const result = normalizeLead({
        name: "Legacy Name",
        email: "legacy@example.com",
        authority: "Legacy City"
    });

    assert.strictEqual(result.lead.fullName, "Legacy Name");
    assert.strictEqual(result.lead.municipality, "Legacy City");
});

test("accepts submission without phone", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: "חיפה",
        role: "",
        phone: ""
    });

    assert.strictEqual(result.error, undefined);
    assert.strictEqual(result.lead.phone, "");
});

test("auto reply template uses updated copy", () => {
    const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");
    const email = buildAutoReplyEmail({
        lead: { fullName: "דנה כהן", municipality: "חיפה" },
        replyToEmail: "team@example.com"
    });

    assert.match(email.html, /שלום דנה כהן/);
    assert.match(email.html, /max-width:640px/);
    assert.match(email.html, /finCity-logotext\.png/);
    assert.match(email.html, /פרטי הפנייה/);
    assert.match(email.html, /עבור <strong[^>]*>חיפה<\/strong>/);
    assert.match(email.html, /מנכ&quot;ל&#8206;/);
    assert.doesNotMatch(email.html, /מטעם/);
    assert.doesNotMatch(email.html, /להשלמת פרטים/);
    assert.doesNotMatch(email.html, /undefined/);
    assert.strictEqual(email.senderDisplayName, "שלו | Fincity");
    assert.match(email.text, /מנכ"ל Fincity/);
    assert.match(email.text, /עבור חיפה/);
});

test("auto reply template handles missing optional lead fields", () => {
    const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");
    const email = buildAutoReplyEmail({
        lead: { fullName: "", municipality: "" }
    });

    assert.match(email.html, /שלום,/);
    assert.doesNotMatch(email.html, /undefined/);
    assert.doesNotMatch(email.text, /undefined/);
});
