export type Purchase = {
  id: number;
  userId: number;
  goodiesId: number;
  createdAt: string; //But should be converted as Date
};

export type PurchaseGoodiesFormData = {
  error?: string;
  success?: string;
};

export type RefundGoodiesFormData = {
  error?: string;
  success?: string;
};
