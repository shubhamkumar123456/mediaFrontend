const API_URL = import.meta.env.VITE_mode==="production"? import.meta.env.VITE_PRODUCTION_API :import.meta.env.VITE_TRIAL_API
console.log(API_URL)

export default API_URL