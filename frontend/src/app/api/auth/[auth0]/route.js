

// import { handleAuth } from '@auth0/nextjs-auth0';

// export const GET = handleAuth();

// ver cual es la que va 

import { handleAuth, handleLogin } from "@auth0/nextjs-auth0";


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

// export const GET = handleAuth();


// VERSION SIN POST DE BACK
/*
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
*/