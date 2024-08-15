import { handleAuth } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
    // Configura el issuerBaseURL aquí si es necesario
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    secret: process.env.AUTH0_SECRET,
    baseURL: process.env.AUTH0_BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
  });
