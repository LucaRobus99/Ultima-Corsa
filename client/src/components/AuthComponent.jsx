import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

// Login form component
function LoginForm(props) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // update credentials on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles form submission to authenticate the user.

  const handleSubmit = async (e) => {
    e.preventDefault();
    const username = credentials.username.trim();
    const password = credentials.password;

    if (!username || !password) {
      setErrorMsg("Username and password are required.");
      return;
    }

    setIsPending(true);
    setErrorMsg(null);

    try {
      await props.login({ username, password });
    } catch (err) {
      if (!err || !err.error) {
        setErrorMsg("Unable to reach the server. Please try again later.");
      } else {
        setErrorMsg(err.error || "Incorrect username or password.");
      }
      setIsPending(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5 w-100">
      <Form
        onSubmit={handleSubmit}
        className="col-12 col-sm-8 col-md-6 col-lg-4 border p-4 rounded shadow-sm bg-light text-dark"
      >
        <h3 className="mb-4 text-center">Login</h3>

        {errorMsg && (
          <Alert variant="danger" className="py-2 small">
            {errorMsg}
          </Alert>
        )}

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Enter username"
            disabled={isPending}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Enter password"
            disabled={isPending}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100 mt-2"
          disabled={isPending}
        >
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </div>
  );
}

export default LoginForm;
