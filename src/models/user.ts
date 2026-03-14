export interface User {
  id?: string;
  email: string;
  full_name: string;
  plan_type: 'family' | 'business';
  avatar_url?: string;
  password?: string;
  created_at?: string;
}

export interface familyMember {
    id: string;
    account_owner_id: number;
    name: string;
    email: string;
    relationship: string;
    avatar_url: string;
    is_active: boolean;
    created_at: string;
}