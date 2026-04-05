export interface User {
  _id: string;
  name: string;
  phoneNumber?: string;
  gender?: string;
  ageBracket?: string;
  constituency?: {
    area_name: string;
    _id: string;
  };
}