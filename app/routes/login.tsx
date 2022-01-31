import { ActionFunction, json, redirect, useActionData, useSearchParams } from "remix";

type ActionData = {
  formError?: string;
  fieldsError?: {
    email?: string;
    password?: string
  };
  fields?:{
    email: string;
    password: string;
  }
}

function throwError(data: ActionData, code: number) {
  return json(data, code);
}

function validateEmail(email: string) {
  if (
    !new RegExp(
      process.env["EMAIL_REGEX"] || /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
    ).test(email)
  ) {
    return "User email must match your student email domain"
  }
}

function validatePassword(password: string){
  if(password.length < 8){
    return "Password is too small"
  }
}

export const action: ActionFunction = async ({request}) => {
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo")

  if(
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ){
    return throwError({formError: "You must fill all the form"}, 400);
  }

  const fields = {email, password};
  const fieldsError = {
    email: validateEmail(email),
    password: validatePassword(password)
  }

  if(Object.values(fieldsError).some(Boolean)){
    return throwError({fields, fieldsError}, 400)
  }

  return redirect(redirectTo)
}

export default function Login () {
  const actionData = useActionData<ActionData>()
  const [searchparams] = useSearchParams()
    return(
        <div>
            <h1>Login</h1>
            <form method="post">
              <p>{actionData?.formError}</p>
              <input type="hidden" name="redirectTo" value={searchparams.get("redirectTo") || "/"} />
              <div>
                <label htmlFor="email-input">Email</label>
                <input type="text" name="email" id="email-input" defaultValue={actionData?.fields?.email}/>
                <p>{actionData?.fieldsError?.email}</p>
              </div>
              <div>
                <label htmlFor="password-input">Password</label>
                <input type="password" name="password" id="password-input" defaultValue={actionData?.fields?.password} />
                <p>{actionData?.fieldsError?.password}</p>
              </div>
              <button type="submit">Submiut</button>
            </form>
        </div>
    )
}