export type Accomplishment = {
  id: number;
  userId: number;
  challengeId: number;
  createdAt: string; //But should be converted as Date
  proof: string;
  validation: Validation;
};

export type Validation = "ACCEPTED" | "PENDING" | "REFUSED";

export type CreateAccomplishmentFormData = {
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

export type DeleteAccomplishmentFormData = {};

export type ValidateAccomplishmentFormData = {};
