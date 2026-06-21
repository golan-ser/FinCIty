function getCorsHeaders(request) {
    const configured = process.env.CORS_ALLOWED_ORIGINS || "*";
    const allowedOrigins = configured.split(",").map((value) => value.trim()).filter(Boolean);
    const requestOrigin = request?.headers?.get?.("origin") || "";
    let allowOrigin = "*";

    if (allowedOrigins[0] === "*") {
        allowOrigin = "*";
    } else if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
        allowOrigin = requestOrigin;
    } else if (allowedOrigins.length > 0) {
        allowOrigin = allowedOrigins[0];
    }

    return {
        "Access-Control-Allow-Origin": allowOrigin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        Vary: "Origin"
    };
}

module.exports = {
    getCorsHeaders
};
