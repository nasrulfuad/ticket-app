import { useState } from "react";
import router from "next/router";
import useRequest from "../../hooks/useRequest";

const NewTicket = () => {
  const [fields, setFields] = useState({
    title: "",
    price: "",
  });

  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: fields,
    onSuccess: () => router.push("/"),
  });

  const onFieldChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const onPriceBlur = (e) => {
    const value = parseFloat(fields.price);

    if (isNaN(value)) return;

    setFields({ ...fields, price: value.toFixed(2) });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    doRequest();
  };

  return (
    <div className="card">
      <div className="card-header">
        <h1>Create a Ticket</h1>
      </div>
      <div className="card-body">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Title..."
              value={fields.title}
              onChange={onFieldChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>

            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text" id="price-desc">
                  $
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                name="price"
                placeholder="Price..."
                aria-label="Price"
                aria-describedby="price-desc"
                value={fields.price}
                onChange={onFieldChange}
                onBlur={onPriceBlur}
              />
            </div>
          </div>
          {errors}
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTicket;
