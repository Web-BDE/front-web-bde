export type Purchase = {
  id: number;
  userId?: number;
  user?: { id: number; pseudo: string };
  goodiesId?: number;
  goodies?: { id: number; name: string; price: number };
  createdAt: string; //But should be converted as Date
};

export type PurchaseGoodiesFormData = {};

export type RefundGoodiesFormData = {};

export type DeliverGoodiesFormData = {};
