import { json } from "remix";
import {
  createAccomplishment,
  deleteAccomplishment,
  getManyAccomplishment,
  updateAccomplishment,
  validateAccomplishment,
} from "~/services/accomplishment";
import { APIError } from "~/utils/axios";

export async function loadAccomplishments(request: Request) {
  //Try to get accomplishments
  let accomplishments;
  try {
    accomplishments = await getManyAccomplishment(request);
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
  request: Request,
  validation: string,
  accomplishmentId: number
) {
  //Validator for validation input
  function validateValidation(validation: number) {
    if (validation !== -1 && validation !== 1) {
      return "Validation has invalid value";
    }
  }

  //Check for an error in the validation format
  const validationError = validateValidation(parseInt(validation));

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
    await validateAccomplishment(
      request,
      validation === "1" ? 1 : -1,
      accomplishmentId
    );
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

  return "Accomplishment Validated";
}

export async function handleAccomplishmentCreation(
  request: Request,
  proof: string,
  challengeId: number
) {
  try {
    await createAccomplishment(
      request,
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

  return "Accomplishment Created";
}

export async function handleAccomplishmentUpdate(
  request: Request,
  proof: string,
  accomplishmentId: number
) {
  try {
    await updateAccomplishment(
      request,
      {
        proof,
      },
      accomplishmentId
    );
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
}

export async function handleDeleteAccomplishment(
  request: Request,
  accomplishmentId: number
) {
  //Try to delete accomplishment
  try {
    await deleteAccomplishment(request, accomplishmentId);
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
}
