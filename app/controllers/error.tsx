import { Link, ThrownResponse } from "remix";

export function generateExpectedError(caught: ThrownResponse) {
  console.log(caught);
  switch (caught.status) {
    case 401:
      return (
        <div className="container">
          <h3>
            You must be <Link to="/login">logged in</Link> to see this data
          </h3>
        </div>
      );
    case 403:
      return (
        <div className="container">
          <h3>Sorry, you don't have the rights to see this</h3>
        </div>
      );
    case 404:
      return (
        <div className="container">
          <h3>There is nothing to see here</h3>
        </div>
      );
    default:
      return (
        <div className="container">
          <h1>
            {caught.status} {caught.statusText}
          </h1>
          <p>{caught.data}</p>
        </div>
      );
  }
}

export function generateUnexpectedError(error: Error) {
  return (
    <div className="container">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
