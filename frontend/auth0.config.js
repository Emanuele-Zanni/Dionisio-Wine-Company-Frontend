import { WebAuth } from "@auth0/nextjs-auth0";

const { AUTH0_DOMAIN, AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, ISSUER_BASE_URL } =
  process.env;

export default WebAuth({
  domain: AUTH0_DOMAIN || "dev-de2xc48ju2qxy2fh.us.auth0.com",
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  scope: "openid profile email",
  issuerBaseURL: ISSUER_BASE_URL || "https://dev-de2xc48ju2qxy2fh.us.auth0.com",
  redirectUri: "/api/auth/callback",
});
