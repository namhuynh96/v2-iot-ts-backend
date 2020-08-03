import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import jwkToPem from "jwk-to-pem";
import jwks from "../config/jwks";
import keys from "../config/keys";

const auth: RequestHandler = async (req, res, next) => {
  try {
    const token = req.header("Authorization")!.replace("Bearer ", "");
    const decoded = jwt.decode(token, { complete: true })! as {
      header: { kid: string };
    };
    const jwk = jwks.find(jwk => jwk.kid === decoded.header.kid)!;
    const pem = jwkToPem({ kty: "RSA", n: jwk.n, e: jwk.e });
    jwt.verify(
      token,
      pem,
      { algorithms: ["RS256"] },
      async (err, decodedToken) => {
        if (err) {
          throw new Error();
        }
        const { exp, aud, iss, token_use, email } = decodedToken as {
          exp: number;
          aud: string;
          iss: string;
          token_use: string;
          email: string;
        };
        if (
          exp * 1000 > Date.now() &&
          aud === keys.webClientId &&
          iss === keys.userPoolIssuer &&
          token_use === "id"
        ) {
          const cognitoUsernameDecoded = decodedToken as {"cognito:username": string}
          const user = {
            cognitoUsername: cognitoUsernameDecoded["cognito:username"],
            email
          };
          req.user = user;
          next();
        }
      }
    );
  } catch (e) {
    res.status(401).send({ error: "Authorization is not valid" });
  }
};

export default auth;
