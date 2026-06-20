const test = require("node:test");
const assert = require("node:assert/strict");
const { normalizeLead } = require("../lib/validateLead");

test("accepts required fields only", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: "עיריית דוגמה"
    });

    assert.equal(result.error, undefined);
    assert.equal(result.lead.fullName, "ישראל ישראלי");
    assert.equal(result.lead.role, "");
    assert.equal(result.lead.phone, "");
});

test("accepts optional fields when provided", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "test@example.com",
        municipality: "עיריית דוגמה",
        role: "גזבר",
        phone: "050-0000000"
    });

    assert.equal(result.lead.role, "גזבר");
    assert.equal(result.lead.phone, "050-0000000");
});

test("rejects invalid email", () => {
    const result = normalizeLead({
        fullName: "ישראל ישראלי",
        email: "not-an-email",
        municipality: "עיריית דוגמה"
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

    assert.equal(result.lead.fullName, "Legacy Name");
    assert.equal(result.lead.municipality, "Legacy City");
});
