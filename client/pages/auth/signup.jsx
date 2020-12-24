import { useState } from "react";
import router from "next/router";
import useRequest from "../../hooks/useRequest";

const SignUp = () => {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: fields,
    onSuccess: () => router.push("/"),
  });

  const onFieldChange = (e) =>
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    await doRequest();
  };

  return (
    <div className="container py-5">
      <div className="card">
        <h3 className="card-header">Sign Up</h3>
        <div className="card-body">
          <form autoComplete="off" onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={fields.email}
                onChange={onFieldChange}
                placeholder="Enter email here"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                placeholder="Enter password here"
                className="form-control"
                name="password"
                value={fields.password}
                onChange={onFieldChange}
              />
            </div>
            {errors}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
