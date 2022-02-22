import { json } from "remix";
import { Validation } from "~/models/Accomplishment";
import {
  createAccomplishment,
  deleteAccomplishment,
  getManyAccomplishment,
  updateAccomplishment,
} from "~/services/accomplishment";
import { APIError } from "~/utils/axios";

export async function loadAccomplishments(token: string) {
  //Try to get accomplishments
  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(token);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the component instead
    if (err instanceof APIError) {
      return {
        accomplishmenError: err.error.message,
      };
    }
    throw err;
  }
  return { accomplishments };
}

export async function handleValidateAccomplishment(
  token: string,
  validation: Validation,
  accomplishmentId: number
) {
  //Validator for validation input
  function validateValidation(validation: number | null) {
    if (validation !== -1 && validation !== 1) {
      return "Validation has invalid value";
    }
  }

  //Check for an error in the validation format
  const validationError = validateValidation(validation);

  if (validationError) {
    return json(
      {
        validateChallenge: { validationError: validationError },
      },
      400
    );
  }

  //Try to validate challenge
  try {
    await updateAccomplishment(token, accomplishmentId, undefined, validation);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          validateChallenge: { validationError: err.error.message },
        },
        err.code
      );
    }
    throw err;
  }

  return json({
    validateChallenge: { validationSuccess: "Challenge Validated" },
  });
}





