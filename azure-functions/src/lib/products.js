const PRODUCTS = {
    tabarim: {
        key: "tabarim",
        brand: "Fincity",
        label: "ניהול תב\"רים",
        shortLabel: "תב\"רים",
        tagline: "AI לניהול תב\"רים לרשויות מקומיות",
        orgLabel: "רשות",
        autoReplyDescription:
            "Fincity היא מערכת AI לניהול תב\"רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים."
    },
    vehicles: {
        key: "vehicles",
        brand: "Fincity Fleet",
        label: "ניהול צי רכב",
        shortLabel: "צי רכב",
        tagline: "ניהול צי רכב פשוט וחכם",
        orgLabel: "ארגון",
        autoReplyDescription:
            "Fincity Fleet היא מערכת פשוטה לניהול צי רכב — רכבים, נהגים, טסטים, ביטוחים וטיפולים במקום אחד, עם התראות לפני כל מועד חשוב ועדכון ק\"מ בהודעה — כדי שתפעול הצי יהיה מסודר, צפוי ופשוט."
    }
};

function normalizeProductKey(value) {
    const key = String(value || "").trim().toLowerCase();
    return Object.prototype.hasOwnProperty.call(PRODUCTS, key) ? key : "tabarim";
}

function getProduct(key) {
    return PRODUCTS[normalizeProductKey(key)];
}

module.exports = {
    PRODUCTS,
    normalizeProductKey,
    getProduct
};
