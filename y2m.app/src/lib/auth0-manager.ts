import dotenv from 'dotenv';
import axios from 'axios';
import { extractSubdomain } from '@/utils/subdomain-utils'; // Adjust the path as per your project structure
import { Request, Response } from 'express'; // Import the types for req and res

// Load environment variables
dotenv.config();

interface SessionData {
  accessToken: string;
  idToken: string;
  [key: string]: unknown; // Changed from any to unknown for better type safety
}

// Environment variables
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_M2M_CLIENT_ID = process.env.AUTH0_M2M_CLIENT_ID;
const AUTH0_M2M_CLIENT_SECRET = process.env.AUTH0_M2M_CLIENT_SECRET;
const AUTH0_CLIENT_IDENTIFIER = process.env.AUTH0_CLIENT_IDENTIFIER; // The Auth0 client (app) to update

// Ensure all necessary environment variables are present
if (!AUTH0_DOMAIN || !AUTH0_M2M_CLIENT_ID || !AUTH0_M2M_CLIENT_SECRET || !AUTH0_CLIENT_IDENTIFIER) {
  throw new Error('Missing required Auth0 environment variables.');
}

// Function to get an Auth0 management token
async function getAuth0Token(): Promise<string> {
  try {
    const response = await axios.post(`https://${AUTH0_DOMAIN}/oauth/token`, {
      client_id: AUTH0_M2M_CLIENT_ID,
      client_secret: AUTH0_M2M_CLIENT_SECRET,
      audience: `https://${AUTH0_DOMAIN}/api/v2/`,
      grant_type: 'client_credentials',
    });

    console.log('Successfully obtained Auth0 token');
    return response.data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error getting Auth0 token:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error getting Auth0 token:', error);
    }
    throw new Error('Failed to retrieve Auth0 management token.');
  }
}

// Function to get the Auth0 client and update its callback URLs if necessary
async function getClient(callbackURL: string): Promise<void> {
  const token = await getAuth0Token();

  try {
    const response = await axios.get(
      `https://${AUTH0_DOMAIN}/api/v2/clients/${AUTH0_CLIENT_IDENTIFIER}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const client = response.data;
    const currentCallbacks: string[] = client.callbacks || [];

    // Check if the callback URL already exists
    if (!currentCallbacks.includes(callbackURL)) {
      currentCallbacks.push(callbackURL);
      await updateClient(currentCallbacks);
    } else {
      console.log('Callback URL already exists.');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching Auth0 client details:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error fetching Auth0 client details:', error);
    }
    throw new Error('Failed to retrieve Auth0 client details.');
  }
}

// Function to update the Auth0 client with new callback URLs
async function updateClient(callbackURLs: string[]): Promise<void> {
  const token = await getAuth0Token();

  try {
    await axios.patch(
      `https://${AUTH0_DOMAIN}/api/v2/clients/${AUTH0_CLIENT_IDENTIFIER}`,
      { callbacks: callbackURLs },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('Callback URLs updated successfully.');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error updating Auth0 client:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error updating Auth0 client:', error);
    }
    throw new Error('Failed to update Auth0 client.');
  }
}

// Function to add a new callback URL for a subdomain
export async function addCallbackURL(subdomain: string): Promise<void> {
  const callbackURL = `http://${subdomain}.localhost:3000/api/auth/callback`;
  await getClient(callbackURL);
}

// Function to set a cookie with a subdomain-specific name
export const setCookieForSubdomain = (
  req: Request,
  res: Response,
  sessionData: SessionData
): void => {
  const subdomain = extractSubdomain(req.hostname); // Extract subdomain from the request hostname

  if (!subdomain) {
    throw new Error('Subdomain not found'); // Handle cases where no subdomain is present
  }

  // Serialize sessionData to a string
  const sessionDataString = JSON.stringify(sessionData);

  // Set a unique cookie name using the subdomain
  const cookieName = `auth-session-${subdomain}`;
  res.cookie(cookieName, sessionDataString, {
    domain: `.${subdomain}.yourmaindomain.com`, // Subdomain-specific domain
    path: '/', // Root path for the cookie
    httpOnly: true, // Ensure the cookie is only accessible via HTTP(S), not client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Enable secure cookies in production (only for HTTPS)
    sameSite: 'lax', // Restrict cross-origin requests (note: lowercase 'lax')
  });

  console.log(`Cookie set for subdomain: ${cookieName}`);
};
