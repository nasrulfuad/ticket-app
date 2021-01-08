import Link from "next/link";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>You are signed in as {currentUser?.email}</h1>
  ) : (
    <h1>You are not signed in</h1>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  return {};
};

export default LandingPage;
