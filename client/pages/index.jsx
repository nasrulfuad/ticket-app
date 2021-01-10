import Link from "next/link";

const LandingPage = ({ tickets }) => {
  const ticketList = !tickets ? (
    <tr>
      <td colSpan="3" className="text-center">
        <h3>Not Found</h3>
      </td>
    </tr>
  ) : (
    tickets.map((ticket) => (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a>Show</a>
          </Link>
        </td>
      </tr>
    ))
  );

  return (
    <div className="card">
      <div className="card-header">
        <h1>Tickets</h1>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Link</th>
            </tr>
          </thead>
          <tbody>{ticketList}</tbody>
        </table>
      </div>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client) => {
  try {
    const { data } = await client.get("/api/tickets");
    return { tickets: data };
  } catch (err) {
    console.log(err);
  }
  // const data = [{}];
};

export default LandingPage;
