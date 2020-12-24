import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [fields, setFields] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const onFieldChange = (e) =>
    setFields({
      ...fields,
      [e.target.name]: e.target.value,
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/users/signup", fields);
      console.log(response.data);
    } catch (error) {
      setErrors(error.response.data.errors);
    }
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

            {errors.length > 0 && (
              <div className="alert alert-danger">
                <h4>Oopss...</h4>
                <ul className="my-0">
                  {errors.map((error) => (
                    <li key={error.message}>{error.message}</li>
                  ))}
                </ul>
              </div>
            )}

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
