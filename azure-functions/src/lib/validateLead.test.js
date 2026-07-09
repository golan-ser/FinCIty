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

test("defaults product to tabarim and accepts vehicles", () => {
    const base = {
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: "חיפה"
    };

    assert.strictEqual(normalizeLead(base).lead.product, "tabarim");
    assert.strictEqual(normalizeLead({ ...base, product: "vehicles" }).lead.product, "vehicles");
    assert.strictEqual(normalizeLead({ ...base, product: "VEHICLES" }).lead.product, "vehicles");
    assert.strictEqual(normalizeLead({ ...base, product: "garbage" }).lead.product, "tabarim");
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

test("auto reply adapts content per product", () => {
    const { buildAutoReplyEmail } = require("../templates/autoReplyEmail");

    const tabarim = buildAutoReplyEmail({
        lead: { fullName: "דנה כהן", municipality: "חיפה", product: "tabarim" }
    });
    assert.match(tabarim.subject, /Fincity$/);
    assert.match(tabarim.text, /תב"רים/);
    assert.doesNotMatch(tabarim.text, /צי רכב/);

    const vehicles = buildAutoReplyEmail({
        lead: { fullName: "דנה כהן", municipality: "חיפה", product: "vehicles" }
    });
    assert.match(vehicles.subject, /Fincity Fleet/);
    assert.match(vehicles.text, /צי רכב/);
    assert.match(vehicles.html, /ניהול צי רכב/);
    assert.doesNotMatch(vehicles.text, /תקציבים ייעודיים/);
    assert.match(vehicles.text, /מנכ"ל Fincity/);
    assert.doesNotMatch(vehicles.html, /undefined/);
});

test("internal and ceo emails carry the product", () => {
    const { buildInternalEmail } = require("../templates/internalEmail");
    const { buildCeoNotificationEmail } = require("../templates/ceoNotificationEmail");
    const lead = {
        fullName: "דנה כהן",
        email: "dana@example.com",
        municipality: "חיפה",
        role: "",
        phone: "",
        product: "vehicles"
    };

    const internal = buildInternalEmail({ lead, submittedAt: "1.1.2026, 10:00" });
    assert.match(internal.subject, /צי רכב/);
    assert.match(internal.html, /ניהול צי רכב/);
    assert.match(internal.text, /מוצר: ניהול צי רכב/);

    const ceo = buildCeoNotificationEmail({ lead });
    assert.match(ceo.subject, /צי רכב/);
    assert.match(ceo.text, /מוצר: ניהול צי רכב/);

    const internalDefault = buildInternalEmail({
        lead: { ...lead, product: undefined },
        submittedAt: "1.1.2026, 10:00"
    });
    assert.match(internalDefault.subject, /תב"רים/);
});
