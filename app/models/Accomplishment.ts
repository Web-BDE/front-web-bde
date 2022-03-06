export type Accomplishment = {
  id: number;
  userId: number;
  challengeId: number;
  createdAt: string; //But should be converted as Date
  comment: string;
  validation: Validation;
};

export type AccomplishmentInfo = {
  comment?: string;
};

export type Validation = "ACCEPTED" | "PENDING" | "REFUSED";

export type CreateAccomplishmentFormData = {
  fieldsError?: {
    comment?: string;
    proof?: string;
  };
  fields?: {
    comment?: string;
    proof: Buffer;
  };
};

export type DeleteAccomplishmentFormData = {};

export type ValidateAccomplishmentFormData = {};
