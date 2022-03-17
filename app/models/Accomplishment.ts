export type Accomplishment = {
  id: number;
  user?: { id: number; pseudo: string };
  userId?: number;
  challengeId?: number;
  challenge?: { id: number; name: string; reward: number };
  proofId: string,
  createdAt: string; //But should be converted as Date
  comment: string;
  refusedComment: string;
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
    proof: Blob;
  };
};

export type DeleteAccomplishmentFormData = {};

export type ValidateAccomplishmentFormData = {
  fieldsError?: {
    refusedComment?: string;
  };
  fields?: {
    refusedComment: string;
  };
};
