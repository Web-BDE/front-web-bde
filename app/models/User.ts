export type User = {
  id: number;
  pseudo: string;
  name: string;
  surname: string;
  avatarId: string;
  wallet: number;
  privilege: number;
  totalEarnedPoints: number;
};

export type UpdateUserFormData = {
  fieldsError: {
    pseudo?: string;
    name?: string;
    surname?: string;
    wallet?: string;
    privilege?: string;
  };
  fields: {
    pseudo: string;
    name: string;
    surname: string;
    wallet: number;
    privilege: number;
  };
};

export type LoginFormData = {
  fieldsError: {
    email?: string;
    password?: string;
  };
  fields: {
    email: string;
  };
};

export type RegisterFormData = {
  fieldsError: {
    email?: string;
    password?: string;
    confirm?: string;
    pseudo?: string;
    name?: string;
    surname?: string;
  };
  fields: {
    email: string;
    pseudo: string;
    name?: string;
    surname?: string;
  };
};
