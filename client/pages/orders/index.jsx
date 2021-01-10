import Link from "next/link";

const OrderIndex = ({ orders }) => {
  return (
    <div className="card">
      <div className="card-header">Orders</div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ticket</th>
              <th>Price</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders &&
              orders.map((order, i) => (
                <tr key={order.id}>
                  <td>{i + 1}</td>
                  <td>{order.ticket.title}</td>
                  <td>{order.ticket.price}</td>
                  <td>
                    {order.status === "cancelled" ? (
                      <span className="badge badge-danger">Expired</span>
                    ) : (
                      <span className="badge badge-success">
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td>
                    <Link href="/orders/[orderId]" as={`/orders/${order.id}`}>
                      show
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");

  return { orders: data };
};

export default OrderIndex;
