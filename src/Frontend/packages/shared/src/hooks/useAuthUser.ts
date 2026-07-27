import { useEffect, useState } from 'react';
import { authService } from '../services/auth-service';
import { User } from '../types/auth.types';

export const useAuthUser = (): User | null => {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());

  useEffect(
    () => authService.subscribe(() => setUser(authService.getStoredUser())),
    []
  );

  return user;
};
