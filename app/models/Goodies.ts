export type Goodies = {
  id: number;
  name: string;
  description?: string;
  price: number;
  buyLimit: number;
  imageId: string;
  stock: number;
  bought: number;
  createdAt: string; //But should be converted as Date
  AuteurId?: number;
  Auteur?: { id: number; pseudo: string };
};

export type GoodiesInfo = {
  name: string;
  description?: string;
  price: number;
  buyLimit: number;
  stock: number;
};

export type CreateGoodiesFormData = {
  fieldsError: {
    picture?: string;
    name?: string;
    description?: string;
    price?: string;
    buyLimit?: string;
    stock?: string;
  };
  fields: {
    picture: Blob;
    name: string;
    description?: string;
    price: number;
    buyLimit: number;
    stock: number;
  };
};

export type DeleteGoodiesFormData = {};
