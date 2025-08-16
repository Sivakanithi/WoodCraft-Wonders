// Reusable email template with emojis and brand styling

const BRAND_NAME = process.env.BRAND_NAME || 'WoodCraft Wonders'
const BASE_FOR_ASSETS = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || ''
const DEFAULT_LOGO_URL = BASE_FOR_ASSETS
  ? `${BASE_FOR_ASSETS}/uploads/logo.jpg`
  : 'https://cdn-icons-png.flaticon.com/512/616/616494.png'
const LOGO_URL = process.env.EMAIL_LOGO_URL || DEFAULT_LOGO_URL

export function renderEmail({ subjectEmoji = '🪵', title = '', subtitle = '', contentHtml = '' } = {}) {
  const safeTitle = title || BRAND_NAME
  const safeSubtitle = subtitle ? `<div style="color:#ffe;opacity:0.95;font-size:14px;margin-top:6px">${subtitle}</div>` : ''
  return `
    <div style="background:#ece7df;padding:22px 14px;font-family:'Segoe UI',Arial,sans-serif;">
      <div style="max-width:640px;margin:auto;background:#f8f5f2;border-radius:18px;box-shadow:0 8px 32px #bfa77a44;overflow:hidden;">
        <div style="background:linear-gradient(90deg,#9c6b3b 0%,#b07d45 45%,#deb887 100%);padding:26px 14px;text-align:center;">
          <img src='${LOGO_URL}' alt='${BRAND_NAME} logo' style='width:60px;height:60px;margin-bottom:10px;border-radius:14px;border:2px solid #fff;box-shadow:0 2px 10px #8d552433;' />
          <h2 style="margin:0;color:#fff;letter-spacing:1.2px;font-size:1.85rem;text-shadow:1px 1px 4px #6d4924;">${subjectEmoji} ${safeTitle}</h2>
          ${safeSubtitle}
        </div>
        <div style="padding:26px 26px 10px 26px">${contentHtml}</div>
        <div style="background:#b07d45;text-align:center;padding:12px 0;color:#fff;font-size:13px;letter-spacing:1px;">&copy; ${new Date().getFullYear()} ${BRAND_NAME}</div>
      </div>
    </div>
  `
}

export function infoTable(rows = []) {
  const tr = rows
    .filter(Boolean)
    .map(([label, value]) => `<tr><td style=\"padding:8px 0;color:#8d5524;white-space:nowrap;vertical-align:top\"><b>${label}</b></td><td style=\"padding:8px 0;color:#3a2a19\">${value ?? '-'}</td></tr>`) 
    .join('')
  return `
    <div style=\"background:#fff;border-radius:14px;padding:18px 20px;border:1px solid #e8d9c3;box-shadow:0 2px 10px #deb88733;\">
      <table style=\"width:100%;border-collapse:collapse;font-size:1rem;\">${tr}</table>
    </div>
  `
}

export function pill(text, color = '#8d5524', bg = '#f1e1c3') {
  return `<span style=\"display:inline-block;padding:4px 10px;border-radius:999px;color:${color};background:${bg};font-size:12px;border:1px solid #deb88777\">${text}</span>`
}

export function button(label, href = '#', color = '#ffffff', bg = '#8d5524') {
  return `<div style=\"text-align:center;margin:18px 0\"><a href=\"${href}\" style=\"display:inline-block;padding:12px 20px;border-radius:10px;color:${color};background:${bg};text-decoration:none;font-weight:600;border:1px solid #6f4520;box-shadow:0 2px 8px #8d552433\">${label}</a></div>`
}

export function sectionCard({ title, subtitle = '', bodyHtml = '' } = {}) {
  const safeSubtitle = subtitle ? `<div style=\"color:#7a5a36;font-size:13px;margin-top:4px\">${subtitle}</div>` : ''
  return `
    <div style=\"background:#fffdf8;border:1px solid #eadbc4;border-radius:16px;padding:18px 20px;margin:10px 0 16px;box-shadow:0 4px 14px #bfa77a2a\">
      ${title ? `<div style=\"font-weight:700;color:#5c4326;margin-bottom:10px;font-size:16px\">${title}${safeSubtitle}</div>` : ''}
      ${bodyHtml}
    </div>
  `
}

export function orderSummaryCard({ product = {}, booking = {}, imageUrl }) {
  let img = imageUrl || product.imageUrl
  if (img && typeof img === 'string' && img.startsWith('/')) {
    const base = process.env.PUBLIC_BASE_URL || process.env.BASE_URL || ''
    img = `${base}${img}`
  }
  const header = `
    <div style=\"display:flex;gap:14px;align-items:center\">
      ${img ? `<img src=\"${img}\" alt=\"${product.title || 'Product'}\" style=\"width:72px;height:72px;border-radius:12px;object-fit:cover;border:1px solid #e4d5be\"/>` : ''}
      <div>
        <div style=\"font-size:16px;color:#3a2a19;font-weight:700\">${product.title || 'Custom Product'}</div>
        <div style=\"color:#7a5a36;font-size:13px\">${product.category || ''}</div>
      </div>
    </div>`
  const table = infoTable([
    ['🧾 Order ID:', booking._id],
    ['📅 Date:', booking.createdAt ? new Date(booking.createdAt).toLocaleString() : new Date().toLocaleString()],
    ['💰 Price:', product.price ? `₹${product.price}` : '-'],
    ['👤 Name:', booking.name],
    ['📧 Email:', booking.email],
    ['📞 Phone:', booking.phone],
    ['💬 Notes:', booking.message || '-'],
  ])
  return sectionCard({ title: 'Order Summary', bodyHtml: `${header}<div style=\"height:10px\"></div>${table}` })
}
