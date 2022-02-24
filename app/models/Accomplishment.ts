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
  formError?: string;
  formSuccess?: string;
  fieldsError?: {
    proof?: string;
  };
  fields?: {
    proof: string;
  };
};

export type DeleteAccomplishmentFormData = {
  formError?: string;
  formSuccess?: string;
};
