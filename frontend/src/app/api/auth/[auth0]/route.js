import { handleAuth, handleCallback } from '@auth0/nextjs-auth0';
import axios from 'axios';

const afterCallback = async (req, res, session) => {
  try {
    if (session && session.user) {
      const { user } = session;

      // Enviar los datos del usuario a tu backend
      await axios.post('api-vinos/users', {
        id: user.sub,
        name: user.name,
        email: user.email
      });
    }
  } catch (error) {
    console.error('Error during afterCallback:', error);
  }
  return session;
};

export const GET = handleAuth({
  callback: handleCallback(afterCallback)
});





// VERSION SIN POST DE BACK
/*
import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = handleAuth();
*/