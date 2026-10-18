const env = {
  apiUrl: import.meta.env.VITE_API_URL,
};

if (!env.apiUrl) {
  throw new Error("VITE_API_URL is not configured.");
}

export default env;