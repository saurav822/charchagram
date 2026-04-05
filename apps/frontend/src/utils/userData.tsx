import axios from 'axios';
import type { User } from '@/types/user';

/**
 * Fetches a user's full profile from the backend.
 *
 * Callers are responsible for error handling — this function does not swallow
 * axios errors so the UI can show the appropriate loading/error state.
 *
 * @param userId - MongoDB ObjectId string of the target user
 * @returns The full user profile document
 * @throws AxiosError if the request fails (e.g. 401 Unauthorized, 404 Not Found)
 */
export async function getUserData(userId: string): Promise<User> {
  const response = await axios.get<{ user: User }>(`/api/users/${userId}`);
  return response.data.user;
}
