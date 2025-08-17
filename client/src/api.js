// Centralize API base URL (prod via VITE_API_BASE, dev fallback to local API)
const fallback = 'http://localhost:4000/api'
const envBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE)
	? import.meta.env.VITE_API_BASE
	: ''
// Normalize (no trailing slash)
export const API_BASE = (envBase || fallback).replace(/\/$/, '')
