/**
 * User domain types — shared between API responses and frontend state.
 *
 * The backend serialises Mongoose documents into these shapes before
 * sending; the frontend consumes them directly without transformation.
 */

/** Minimal user reference embedded inside other documents (e.g. post.author). */
export interface UserInfo {
  _id: string;
  name: string;
}

/** User reference that also carries constituency data, used in comment threads. */
export interface UserInfoWithConstituency {
  _id: string;
  name: string;
  constituency: { _id: string; area_name: string };
}

/** Full user profile returned by GET /api/users/:id and the auth ping. */
export interface User {
  _id: string;
  name: string;
  phoneNumber: string;
  constituency: {
    _id: string;
    area_name: string;
  };
  ageBracket: string;
  gender: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
  updatedAt: string;
  __v: number;
}

/** Wrapper returned by the user-data fetch endpoint. */
export interface UserDataResponseType {
  message: string;
  user: User;
}

/** Request body for POST /api/users/create */
export interface CreateUserRequest {
  name: string;
  phoneNumber: string;
  constituency?: string;
  role?: string;
  email?: string | null;
  ageBracket?: string;
  gender?: string;
}

/** Response from POST /login */
export interface LoginResponse {
  message: string;
  token: string;
  user: Pick<User, '_id' | 'name' | 'phoneNumber' | 'role'>;
}
