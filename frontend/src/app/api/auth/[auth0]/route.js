
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

<<<<<<< HEAD
// export const GET = handleAuth();


// VERSION SIN POST DE BACK
/*
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
*/
=======
>>>>>>> 48506edc389647d28b30931ea0661892a705905d
