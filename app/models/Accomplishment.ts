export type Accomplishment = {
  id: number;
  userId: number;
  challengeId: number;
  createdAt: string; //But should be converted as Date
  proof: string;
  validation: 1 | -1 | null;
};
