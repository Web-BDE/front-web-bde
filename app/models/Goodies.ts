export type Goodies = {
  id: number;
  name: string;
  description: string;
  price: number;
  buyLimit: number;
  createdAt: string; //But should be converted as Date
  creatorId: number;
};
