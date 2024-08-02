import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";

export const GET = handleAuth({
  login: handleLogin({
    returnTo: "/user-dashboard",
    
  }),
  signup: handleLogin({
    authorizationParams: {
      screen_hint: "signup",
    },
    returnTo: "/",
  }),
  
});


// VERSION SIN POST DE BACK
/*
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
*/