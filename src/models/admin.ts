import { Schema, model, Document } from "mongoose";

export interface IAdmin extends Document {
  cognitoUsername: string;
  email: string;
}

const adminSchema = new Schema({
  cognitoUsername: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
});

const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
