import axios from "axios";
import { getToken } from "./authentication";

export async function getManyChallenge(request: Request) {
  const challenges = axios.get("/challenge", {
    headers: { Authorization: `Bearer ${getToken(request)}` },
  });

  return challenges;
}
