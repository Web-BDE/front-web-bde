export type Challenge = {
  id: number;
  name: string;
  description?: string;
  reward: number;
  createdAt: string; //But should be converted as Date
  creatorId: number;
};
