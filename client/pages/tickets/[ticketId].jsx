import router from "next/router";
import useRequest from "../../hooks/useRequest";

const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({
    url: "/api/orders",
    method: "post",
    body: {
      ticketId: ticket.id,
    },
    onSuccess: (order) =>
      router.push("/orders/[orderId]", `/orders/${order.id}`),
  });

  return (
    <div className="card">
      <div className="card-body">
        <h1>{ticket.title}</h1>
        <h4>Price : ${ticket.price}</h4>
        {errors}
        <button className="btn btn-primary" onClick={doRequest}>
          Purchase
        </button>
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data };
};

export default TicketShow;
