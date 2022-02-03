import { json, redirect } from "remix";
import {
  createGoodies,
  deleteGoodies,
  getManyGoodies,
  updateGoodies,
} from "~/services/goodies";
import { APIError } from "~/utils/axios";

//Validator for price fiels
function validatePrice(price: number) {
  if (price < 0) {
    return "Price must be positive";
  }
}

//Validator for buy limit field
function validateBuyLimit(buyLimit: number) {
  if (buyLimit < 1) {
    return "Buy limit must be more than 1";
  }
}

export async function loadGoodies(request: Request) {
  let goodies;
  try {
    goodies = await getManyGoodies(request);
  } catch (err) {
    if (err instanceof APIError) {
      throw json(err.error.message, err.code);
    }
    throw err;
  }

  return { goodies: goodies };
}

export async function handleCreateGoodies(
  request: Request,
  name: string,
  description: string,
  price: number,
  buyLimit: number,
  redirectTo: string
) {
  const fields = {
    name,
    description,
    price: price,
    buyLimit: buyLimit,
  };
  const fieldsError = {
    reward: validatePrice(price),
    buyLimit: validateBuyLimit(buyLimit),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ fields, fieldsError }, 400);
  }

  try {
    await createGoodies(request, fields);
  } catch (err) {
    if (err instanceof APIError) {
      return json({ formError: err.error.message, fields }, err.code);
    }
  }

  return redirect(redirectTo);
}

export async function handleUpdateGoodies(
  request: Request,
  name: string,
  description: string,
  price: number,
  buyLimit: number,
  goodiesId: number
) {
  const fields = {
    name,
    description,
    price: price,
    buyLimit: buyLimit,
  };
  const fieldsError = {
    reward: validatePrice(price),
    buyLimit: validateBuyLimit(buyLimit),
  };

  if (Object.values(fieldsError).some(Boolean)) {
    return json({ updateGoodies: { fields, fieldsError } }, 400);
  }

  try {
    await updateGoodies(request, fields, goodiesId);
  } catch (err) {
    if (err instanceof APIError) {
      return json(
        {
          updateGoodies: { formError: err.error.message, fields },
        },
        err.code
      );
    }
  }

  return json({ updateGoodies: { formSuccess: "Goodies updated" } }, 200);
}

export async function handleDeleteGoodies(request: Request, goodiesId: number) {
  //Try to delete accomplishment
  try {
    await deleteGoodies(request, goodiesId);
  } catch (err) {
    //We don't want to throw API errors, we will show the in the form instead
    if (err instanceof APIError) {
      return json(
        {
          deleteGoodies: { formError: err.error.message },
        },
        err.code
      );
    }
  }

  return redirect("/shop");
}
