import { useEffect, useState } from "react";

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState("");

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