// utils/subdomain-utils.ts
export const extractSubdomain = (hostname: string) => {
  const domainParts = hostname.split('.');
  if (domainParts.length >= 3) {
    return domainParts[0]; // Extract the subdomain part (e.g., 'org1' from 'org1.yourmaindomain.com')
  }
  return null; // Return null if there's no subdomain
};
