import { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/useRequest";

const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: (payment) => console.log(payment),
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();

    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if (timeLeft < 0) {
    return (
      <div className="card">
        <div className="card-body">
          <h1>Order Expired</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-body">
        <h1>Time left to pay : {timeLeft} seconds</h1>
        <StripeCheckout
          token={({ id }) => doRequest({ token: id })}
          stripeKey="pk_test_06BDhe8bMV7PA0rrzkohxJYA00lD0Tteur"
          amount={order.ticket.price * 100}
          email={currentUser.email}
        />
        {errors}
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;

  const { data } = await client.get(`/api/orders/${orderId}`);

  return { order: data };
};

export default OrderShow;
