export interface User {
  id?: string;
  email: string;
  full_name: string;
  plan_type: 'family' | 'business';
  avatar_url?: string;
  password?: string;
  created_at?: string;
}