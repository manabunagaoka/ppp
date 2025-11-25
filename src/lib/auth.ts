// lib/auth.ts
// Helper utilities to access authenticated user information
// User data is injected by middleware.ts from SSO headers

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export interface ManaboodleUser {
  id: string;
  email: string;
  name: string;
  classCode: string;
}

/**
 * Get the authenticated user from request headers
 * Use this in Server Components and API Routes
 * 
 * @returns ManaboodleUser object or null if not authenticated
 */
export async function getUser(): Promise<ManaboodleUser | null> {
  const headersList = await headers();
  
  const id = headersList.get('x-user-id');
  const email = headersList.get('x-user-email');
  const name = headersList.get('x-user-name');
  const classCode = headersList.get('x-user-class');
  
  if (!id || !email) {
    return null;
  }
  
  return {
    id,
    email,
    name: name || '',
    classCode: classCode || ''
  };
}

/**
 * Require authentication or redirect to login
 * Use this in Server Components that need authentication
 * 
 * @param redirectTo - Where to redirect after login (optional)
 * @returns ManaboodleUser object
 */
export async function requireUser(redirectTo?: string): Promise<ManaboodleUser> {
  const user = await getUser();
  
  if (!user) {
    const loginPath = redirectTo 
      ? `/login?redirect_to=${encodeURIComponent(redirectTo)}`
      : '/login';
    redirect(loginPath);
  }
  
  return user;
}
