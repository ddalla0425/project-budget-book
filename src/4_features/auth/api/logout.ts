import { signOut } from 'firebase/auth';
import { auth } from '@/6_shared/config';

export const logoutApi = async (): Promise<void> => {
  await signOut(auth);
};
