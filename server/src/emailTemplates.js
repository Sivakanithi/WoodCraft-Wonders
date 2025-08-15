// Reusable email template with emojis and brand styling

const BRAND_NAME = process.env.BRAND_NAME || 'WoodCraft Wonders'
const LOGO_URL = process.env.EMAIL_LOGO_URL || 'https://cdn-icons-png.flaticon.com/512/616/616494.png'

export function renderEmail({ subjectEmoji = '🪵', title = '', subtitle = '', contentHtml = '' } = {}) {
  const safeTitle = title || BRAND_NAME
  const safeSubtitle = subtitle ? `<div style="color:#7a5a36;font-size:14px;margin-top:6px">${subtitle}</div>` : ''
  return `
    <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:auto;background:#f8f5f2;border-radius:18px;box-shadow:0 6px 28px #bfa77a44;padding:0;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#b07d45 0%,#deb887 100%);padding:24px 0;text-align:center;">
        <img src='${LOGO_URL}' alt='${BRAND_NAME} logo' style='width:56px;height:56px;margin-bottom:10px;border-radius:12px;border:2px solid #fff;box-shadow:0 2px 8px #b07d4533;' />
        <h2 style="margin:0;color:#fff;letter-spacing:1.5px;font-size:1.9rem;text-shadow:1px 1px 4px #8d5524;">${subjectEmoji} ${safeTitle}</h2>
        ${safeSubtitle}
      </div>
      <div style="padding:26px 26px 10px 26px">${contentHtml}</div>
      <div style="background:#b07d45;text-align:center;padding:12px 0;color:#fff;font-size:13px;letter-spacing:1px;">&copy; ${new Date().getFullYear()} ${BRAND_NAME}</div>
    </div>
  `
}

export function infoTable(rows = []) {
  const tr = rows
    .filter(Boolean)
    .map(([label, value]) => `<tr><td style=\"padding:8px 0;color:#8d5524;white-space:nowrap\"><b>${label}</b></td><td style=\"padding:8px 0;color:#3a2a19\">${value ?? '-'}</td></tr>`) 
    .join('')
  return `
    <div style=\"background:#fffbe9;border-radius:12px;padding:18px 20px;box-shadow:0 2px 8px #deb88733;\">
      <table style=\"width:100%;border-collapse:collapse;font-size:1rem;\">${tr}</table>
    </div>
  `
}

export function pill(text, color = '#8d5524', bg = '#f1e1c3') {
  return `<span style=\"display:inline-block;padding:4px 10px;border-radius:999px;color:${color};background:${bg};font-size:12px;border:1px solid #deb88777\">${text}</span>`
}
