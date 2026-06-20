const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeLead(body) {
    if (!body || typeof body !== "object") {
        return { error: "גוף הבקשה אינו תקין." };
    }

    const fullName = String(body.fullName || body.name || "").trim();
    const email = String(body.email || "").trim();
    const municipality = String(body.municipality || body.authority || "").trim();
    const role = String(body.role || body.title || "").trim();
    const phone = String(body.phone || body.telephone || "").trim();

    if (!fullName) {
        return { error: "שם מלא הוא שדה חובה." };
    }

    if (!email || !EMAIL_PATTERN.test(email)) {
        return { error: "כתובת מייל אינה תקינה." };
    }

    if (!municipality) {
        return { error: "שם הרשות הוא שדה חובה." };
    }

    return {
        lead: {
            fullName,
            email,
            municipality,
            role,
            phone
        }
    };
}

function formatTimestamp(date = new Date()) {
    return date.toLocaleString("he-IL", {
        timeZone: "Asia/Jerusalem",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

module.exports = {
    normalizeLead,
    formatTimestamp
};
