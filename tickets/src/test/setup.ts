import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jsonwebtoken from "jsonwebtoken";

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

/**
 * Create a cookie with jwt
 */
global.signin = () => {
  const jwt = jsonwebtoken.sign(
    {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
    },
    process.env.JWT_KEY!
  );

  const session = JSON.stringify({ jwt });

  const base64 = Buffer.from(session).toString("base64");

  return [`express:sess=${base64}`];
};
