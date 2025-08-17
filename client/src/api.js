// Centralize API base URL (prod via VITE_API_BASE, dev fallback to local API)
const fallback = 'http://localhost:4000/api'
let base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
	? String(import.meta.env.VITE_API_BASE)
	: fallback
// Normalize (trim trailing slashes)
base = base.replace(/\/+$/, '')
// Ensure '/api' suffix exists exactly once
if (!/\/(api)(?:$|\?)/.test(base)) {
	base = base + '/api'
}
export const API_BASE = base
