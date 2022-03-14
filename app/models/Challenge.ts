export type Challenge = {
  id: number;
  name: string;
  description: string;
  reward: number;
  maxAtempts: number;
  createdAt: string; //But should be converted as Date
  creatorId?: number;
  creator?: { id: number; pseudo: string };
};

export type ChallengeInfo = {
  name: string;
  description?: string;
  reward: number;
  maxAtempts: number;
};

export type CreateChallengeFormData = {
  fieldsError?: {
    picture?: string;
    name?: string;
    description?: string;
    reward?: string;
    maxAtempts?: string;
  };
  fields?: {
    picture: Blob;
    name: string;
    description?: string;
    reward: number;
    maxAtempts: number;
  };
};

export type DeleteChallengeFormData = {};
