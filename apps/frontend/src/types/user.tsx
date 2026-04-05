export interface UserInfo {
  _id: string;
  name: string;
}
export interface UserInfoWithConstituency {
  _id: string;
  name: string;
  constituency: { _id: string, area_name: string };
}
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
  role: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
export interface UserDataResponseType {
  message: string;
  user: User;
}