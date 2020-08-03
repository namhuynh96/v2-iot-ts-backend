import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  cognitoUsername: string;
  email: string;
  username: string;
  isAccepted: boolean;
  isRequesting: boolean;
  cognitoIdentityId?: string;
}

const userShema = new Schema({
  cognitoUsername: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  username: {
    type: String
  },
  isAccepted: {
    type: Boolean,
    default: false
  },
  isRequesting: {
    type: Boolean,
    default: false
  },
  cognitoIdentityId: {
    type: String
  }
});

const User = model<IUser>("User", userShema);

export default User;
