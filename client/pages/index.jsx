import Link from "next/link";
import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser?.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context);

  const { data } = await client.get("/api/users/current-user");
  return data;
};

export default LandingPage;