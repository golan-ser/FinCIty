const LOGO_ICON_URL = process.env.MAIL_LOGO_ICON_URL || "https://www.fincity.co.il/finCity-logo_only.png";
const LOGO_TEXT_URL = process.env.MAIL_LOGO_TEXT_URL || "https://www.fincity.co.il/finCity-logotext.png";

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function ltr(text) {
    return `<span dir="ltr" style="unicode-bidi:isolate;">${text}</span>`;
}

function rtlLine(content, marginBottom = "16px") {
    return `<p dir="rtl" style="margin:0 0 ${marginBottom};font-size:16px;line-height:1.9;color:#334155;text-align:right;direction:rtl;">${content}</p>`;
}

function endPunct(content, mark) {
    return `${content}&#8206;${mark}`;
}

function buildAutoReplyEmail({ lead, replyToEmail = "" } = {}) {
    const fullNameRaw = String(lead?.fullName || "").trim();
    const municipalityRaw = String(lead?.municipality || "").trim();
    const fullName = fullNameRaw ? escapeHtml(fullNameRaw) : null;
    const municipality = municipalityRaw ? escapeHtml(municipalityRaw) : null;
    const subject = "קיבלנו את פנייתך ל־Fincity";
    const fincity = ltr("Fincity");

    const greeting = fullName
        ? `<p dir="rtl" style="margin:0 0 22px;font-size:20px;line-height:1.6;font-weight:800;color:#0F172A;text-align:right;direction:rtl;">שלום ${fullName}&#8206;,</p>`
        : `<p dir="rtl" style="margin:0 0 22px;font-size:20px;line-height:1.6;font-weight:800;color:#0F172A;text-align:right;direction:rtl;">שלום,</p>`;

    const municipalityLine = municipality
        ? rtlLine(endPunct(`קיבלנו את פנייתך עבור <strong style="color:#0F172A;">${municipality}</strong>`, ", ונבחן את ההתאמה לצרכים שעלו."))
        : rtlLine(endPunct("קיבלנו את פנייתך, ונבחן את ההתאמה לצרכים שעלו", "."));

    const detailsRows = [
        fullName
            ? `<tr>
                <td dir="rtl" style="padding:6px 0;font-size:14px;line-height:1.7;color:#64748B;text-align:right;width:120px;vertical-align:top;">שם הפונה</td>
                <td dir="rtl" style="padding:6px 0;font-size:15px;line-height:1.7;color:#0F172A;font-weight:700;text-align:right;vertical-align:top;">${fullName}</td>
              </tr>`
            : "",
        municipality
            ? `<tr>
                <td dir="rtl" style="padding:6px 0;font-size:14px;line-height:1.7;color:#64748B;text-align:right;width:120px;vertical-align:top;">רשות</td>
                <td dir="rtl" style="padding:6px 0;font-size:15px;line-height:1.7;color:#0F172A;font-weight:700;text-align:right;vertical-align:top;">${municipality}</td>
              </tr>`
            : ""
    ].filter(Boolean).join("");

    const detailsBlock = detailsRows
        ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 28px;background-color:#F8FAFC;border:1px solid #E2E8F0;border-radius:14px;">
      <tr>
        <td dir="rtl" style="padding:20px 22px;text-align:right;">
          <p dir="rtl" style="margin:0 0 12px;font-size:13px;line-height:1.4;font-weight:800;color:#2563EB;text-align:right;letter-spacing:0.2px;">פרטי הפנייה</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            ${detailsRows}
          </table>
        </td>
      </tr>
    </table>`
        : "";

    const html = `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#F8FAFC;font-family:'Segoe UI',Tahoma,Arial,Helvetica,sans-serif;color:#0F172A;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#F8FAFC;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background-color:#FFFFFF;border:1px solid #E2E8F0;border-radius:20px;overflow:hidden;box-shadow:0 10px 28px rgba(15,23,42,0.05);">
          <tr>
            <td style="height:4px;background-color:#2563EB;font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td dir="rtl" style="padding:28px 36px 22px;text-align:center;background-color:#FFFFFF;border-bottom:1px solid #EEF2F7;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding-left:10px;vertical-align:middle;">
                    <img src="${LOGO_ICON_URL}" alt="Fincity" width="42" height="42" style="display:block;border:0;outline:none;width:42px;height:42px;">
                  </td>
                  <td style="vertical-align:middle;">
                    <img src="${LOGO_TEXT_URL}" alt="Fincity" width="118" height="30" style="display:block;border:0;outline:none;width:118px;max-width:118px;height:auto;">
                  </td>
                </tr>
              </table>
              <p dir="rtl" style="margin:12px 0 0;font-size:12px;line-height:1.5;font-weight:700;color:#64748B;text-align:center;">AI לניהול תב&quot;רים לרשויות מקומיות</p>
            </td>
          </tr>
          <tr>
            <td dir="rtl" style="padding:32px 36px 28px;text-align:right;direction:rtl;">
              <h1 dir="rtl" style="margin:0 0 8px;font-size:26px;line-height:1.35;font-weight:900;color:#0F172A;text-align:right;">הפנייה התקבלה</h1>
              <p dir="rtl" style="margin:0 0 26px;font-size:15px;line-height:1.7;color:#64748B;font-weight:600;text-align:right;">נבחן את הפנייה וניצור קשר בהתאם</p>

              ${greeting}

              ${rtlLine(endPunct(`תודה שפנית אלינו בנוגע ל־${fincity}`, "."))}
              ${municipalityLine}
              ${rtlLine(endPunct(`${fincity} היא מערכת AI לניהול תב&quot;רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים`, "."))}
              ${rtlLine(endPunct("לאחר בחינת הפנייה, ניצור קשר במידת הצורך לצורך היכרות קצרה, הבנת הצרכים והצגת האפשרויות הרלוונטיות עבורכם", "."), "24px")}

              ${detailsBlock}

              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #E2E8F0;">
                <tr>
                  <td dir="rtl" style="padding-top:24px;text-align:right;">
                    <p dir="rtl" style="margin:0 0 8px;font-size:16px;line-height:1.7;color:#334155;text-align:right;">בברכה,</p>
                    <p dir="rtl" style="margin:0 0 4px;font-size:17px;line-height:1.6;font-weight:800;color:#0F172A;text-align:right;">שלו</p>
                    <p dir="rtl" style="margin:0;font-size:15px;line-height:1.6;color:#64748B;text-align:right;direction:rtl;">מנכ&quot;ל&#8206; ${fincity}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td dir="rtl" style="padding:18px 36px 24px;background-color:#FAFBFC;border-top:1px solid #EEF2F7;text-align:center;">
              <p dir="rtl" style="margin:0;font-size:12px;line-height:1.7;color:#94A3B8;text-align:center;">${fincity} · מערכת AI לניהול תב&quot;רים לרשויות מקומיות</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const textMunicipalityLine = municipalityRaw
        ? `קיבלנו את פנייתך עבור ${municipalityRaw}, ונבחן את ההתאמה לצרכים שעלו.`
        : "קיבלנו את פנייתך, ונבחן את ההתאמה לצרכים שעלו.";

    const text = [
        fullNameRaw ? `שלום ${fullNameRaw},` : "שלום,",
        "",
        "תודה שפנית אלינו בנוגע ל-Fincity.",
        "",
        textMunicipalityLine,
        "",
        "Fincity היא מערכת AI לניהול תב\"רים, הרשאות, מסמכים, דיווחים ומעקב תקציבי — במטרה לעזור לרשויות לעבוד בצורה פשוטה, מסודרת וחכמה יותר, ולרכז במקום אחד את המידע, המסמכים והמשימות הקשורות לתקציבים ייעודיים.",
        "",
        "לאחר בחינת הפנייה, ניצור קשר במידת הצורך לצורך היכרות קצרה, הבנת הצרכים והצגת האפשרויות הרלוונטיות עבורכם.",
        "",
        "פרטי הפנייה:",
        fullNameRaw ? `שם הפונה: ${fullNameRaw}` : null,
        municipalityRaw ? `רשות: ${municipalityRaw}` : null,
        "",
        "בברכה,",
        "שלו",
        "מנכ\"ל Fincity"
    ].filter((line) => line !== null).join("\n");

    return {
        subject,
        html,
        text,
        senderDisplayName: "שלו | Fincity"
    };
}

module.exports = {
    buildAutoReplyEmail
};
