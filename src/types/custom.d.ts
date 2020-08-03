declare namespace Express {
  export interface Request {
    user: { cognitoUsername: string; email: string };
  }
}
