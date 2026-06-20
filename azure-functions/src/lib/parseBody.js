async function parseJsonBody(request) {
    const raw = await request.text();
    if (!raw || !raw.trim()) {
        return null;
    }

    return JSON.parse(raw);
}

module.exports = {
    parseJsonBody
};
