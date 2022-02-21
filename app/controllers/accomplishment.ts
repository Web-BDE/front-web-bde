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

export async function handleAccomplishmentCreation(
  token: string,
  proof: string,
  challengeId: number
) {
  try {
    await createAccomplishment(
      token,
      {
        proof,
      },
      challengeId
    );
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          creacteAccomplishment: { formError: err.error.message },
        },
        err.code
      );
    }
    throw err;
  }

  return json(
    { createAccomplishment: { formSuccess: "Accomplishment created" } },
    201
  );
}

export async function handleAccomplishmentUpdate(
  token: string,
  proof: string,
  accomplishmentId: number
) {
  try {
    await updateAccomplishment(token, accomplishmentId, { proof });
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          updateAccomplishment: { formError: err.error.message },
        },
        err.code
      );
    }
    throw err;
  }

  return json(
    { updateAccomplishment: { formSuccess: "Accomplishment updated" } },
    201
  );
}

export async function handleDeleteAccomplishment(
  token: string,
  accomplishmentId: number
) {
  //Try to delete accomplishment
  try {
    await deleteAccomplishment(token, accomplishmentId);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          deleteAccomplishment: { formError: err.error.message },
        },
        err.code
      );
    }
  }

  return json(
    { updateChallenge: { formSuccess: "Accomplishment deleted" } },
    201
  );
}
