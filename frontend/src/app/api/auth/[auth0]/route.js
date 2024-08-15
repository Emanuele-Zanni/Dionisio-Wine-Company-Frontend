import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";
import * as info from "../../../../.env";
import * as info2 from "../../../../.env.local";

export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/",
  }),

  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
    },
    returnTo: "/",
  }),
});
