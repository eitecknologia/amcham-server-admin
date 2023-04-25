declare namespace Express {
  export interface Request {
    user: {
      user_id: number;
      name: string;
      last_name: string;
      is_admin: boolean;
      is_active: boolean;
    };
  }
}
