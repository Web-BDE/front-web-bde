export type User = {
  id: number;
  pseudo: string;
  name: string;
  surname: string;
  wallet: number;
  privilege: number;
};

export type LoginFormData = {
  error?: string;
  success?: string;
  fieldsError?: {
    email?: string;
    password?: string;
  };
  fields?: {
    email: string;
  };
};

export type RegisterFormData = {
  error?: string;
  success?: string;
  fieldsError?: {
    email?: string;
    password?: string;
    confirm?: string;
    pseudo?: string;
    name?: string;
    surname?: string;
  };
  fields?: {
    email: string;
    pseudo: string;
    name?: string;
    surname?: string;
  };
};