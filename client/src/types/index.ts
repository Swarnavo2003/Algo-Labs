export type AuthUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: "ADMIN" | "USER";
};
