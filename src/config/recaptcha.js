// Google's published test key: always validates, safe fallback for local dev
// when no real site key is configured (see .env.example).
const TEST_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || TEST_SITE_KEY
