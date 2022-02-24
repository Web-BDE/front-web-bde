export type Challenge = {
  id: number;
  name: string;
  description: string;
  reward: number;
  createdAt: string; //But should be converted as Date
  creatorId: number;
};

export type CreateChallengeFormData = {
  fieldsError?: {
    name?: string;
    description?: string;
    reward?: string;
  };
  fields?: {
    name: string;
    description?: string;
    reward: number;
  };
};

export type DeleteChallengeFormData = {};
