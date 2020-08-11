import { model, Schema, Document } from "mongoose";

interface IUser {
  googleId: String,
  accessToken: String,
  refresherToken: String,
  scope: String
}

const UserSchema = new Schema({
  googleId: {
    type: String,
    required: true
  },
  accessToken: {
    type: String,
    required: true
  },
  refresherToken: {
    type: String,
    required: true
  }
})

const User =  model<IUser & Document>("User", UserSchema);

export default User;
