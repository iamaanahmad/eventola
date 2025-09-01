import { account } from '@/lib/appwrite';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function logout() {
  try {
    await account.deleteSession('current');
    redirect('/login');
  } catch (error) {
    console.error('Logout failed:', error);
    // Force redirect even if logout fails
    redirect('/login');
  }
}
