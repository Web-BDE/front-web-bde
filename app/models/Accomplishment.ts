export type Accomplishment = {
  id: number;
  userId: number;
  challengeId: number;
  createdAt: Date;
  proof: string;
  validation: 1 | -1 | null;
};
