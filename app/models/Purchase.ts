export type Purchase = {
  id: number;
  userId: number;
  goodiesId: number;
  createdAt: string; //But should be converted as Date
};

export type PurchaseGoodiesFormData = {};

export type RefundGoodiesFormData = {};

export type DeliverGoodiesFormData = {};
