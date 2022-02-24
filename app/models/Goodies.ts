export type Goodies = {
  id: number;
  name: string;
  description?: string;
  price: number;
  buyLimit: number;
  createdAt: string; //But should be converted as Date
  creatorId: number;
};

export type CreateGoodiesFormData = {
  fieldsError: {
    name?: string;
    description?: string;
    price?: string;
    buyLimit?: string;
  };
  fields: {
    name: string;
    description?: string;
    price: number;
    buyLimit: number;
  };
};

export type DeleteGoodiesFormData = {};
