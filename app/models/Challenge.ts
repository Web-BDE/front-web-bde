export type Challenge = {
  id: number;
  name: string;
  description: string;
  reward: number;
  maxAtempts: number;
  createdAt: string; //But should be converted as Date
  creatorId: number;
};

export type ChallengeInfo = {
  name: string;
  description?: string;
  reward: number;
  maxAtempts: number;
};

export type CreateChallengeFormData = {
  fieldsError?: {
    name?: string;
    description?: string;
    reward?: string;
    maxAtempts?: string;
  };
  fields?: {
    name: string;
    description?: string;
    reward: number;
    maxAtempts: number;
  };
};

export type DeleteChallengeFormData = {};
