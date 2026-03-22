// src/lib/api.js
import { baseUrl } from "./stores";
import { goto } from '$app/navigation';


export async function authFetch(endpoint, options = {}) {
  // 1. Get the current access token
  let token = localStorage.getItem('access_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // 2. Make the initial request
  let response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });

  // 3. Catch a 401 Error (Token Expired)
  // We explicitly check that the endpoint IS NOT the refresh endpoint to prevent an infinite loop!
  if (response.status === 401 && endpoint !== '/api/token/refresh/') {
    console.warn("Access token expired. Attempting to refresh...");
    
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        // 4. Ask Django's SimpleJWT for a new access token
        const refreshResponse = await fetch(`${baseUrl}/api/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken })
        });

        if (refreshResponse.ok) {
          const data = await refreshResponse.json();
          
          // 5. Success! Save the new token
          localStorage.setItem('access_token', data.access);
          
          // 6. Update our headers with the NEW token
          headers['Authorization'] = `Bearer ${data.access}`;
          
          console.log("Token refreshed. Retrying original request...");
          
          // 7. Retry the EXACT same original request the user was trying to make
          response = await fetch(`${baseUrl}${endpoint}`, {
            ...options,
            headers
          });
          
        } else {
          // If the refresh token is also expired, throw an error to trigger the catch block
          throw new Error("Refresh token invalid or expired");
        }
      } catch (error) {
        // 8. Complete Failure: Clear dead tokens and force a re-login
        console.error("Session completely expired. Logging out.");
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        goto('/login');
      }
    } else {
      // No refresh token existed in the first place
      localStorage.removeItem('access_token');
      goto('/login');
    }
  }

  // Return the response (either the successful first try, or the successful retry)
  return response;
}