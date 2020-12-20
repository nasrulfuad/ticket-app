import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserInterface {
  email: string;
  password: string;
}

interface UserModelInterface extends mongoose.Model<UserDocumentInterface> {
  build(attrs: UserInterface): UserDocumentInterface;
}

interface UserDocumentInterface extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));

    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (attrs: UserInterface) => new User(attrs);

export const User = mongoose.model<UserDocumentInterface, UserModelInterface>(
  "User",
  userSchema
);
