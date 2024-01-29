import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LogInPage.css";

const LogInPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/isAuthenticated`, {
      method: "GET",
      credentials: "include",
    }).then((res) => {
      if (res.status === 202) {
        navigate(`/`, { replace: true });
        window.location.reload(true);
      }
    });
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    // Temporary to view user inputs  - REMOVE LATER
    console.log(`Email received: ${email}\nPassword received: ${password}`);

    // Fetch request to backend to check if user exists
    const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log(data); // REMOVE LATER

    if (data.status === "ok") {
      localStorage.setItem("userSignedIn", true);
      let cart = [];
      localStorage.setItem("cart", JSON.stringify(cart));
      navigate(`/`, { replace: true });
      window.location.reload(true); // Refresh the window once redirected
    } else {
      alert("Login failed. Please check email and password.");
    }
  }

  return (
    <div className="login-page">
      <div className="row">
        <div className="column">
          <form onSubmit={handleSubmit}>
            <h2>
              <b>Log In</b>
            </h2>
            <br />
            <h3>Welcome Back!</h3>
            <br />
            <br />
            <input
              size={50}
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            <br />
            <input
              size={50}
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
            <br />
            {/* Will update link after user information storing features are implemented */}
            {/* <div className="form-group">
              <Link to="">
                <i>Forgot your password?</i>
              </Link>
            </div><br /> */}
            <button type="submit">Log In</button>
            <br />
            <i>Don't have an account?</i>
            <Link className="signup-link" to="/signup">
              SIGN UP
            </Link>
          </form>
        </div>
        <div className="column-right">
          <img
            className="blurred-img"
            src="../../blur_image.jpeg"
            alt="placeholder"
          />
          <div class="text">
            If you believed that standard green hues are the extent of diversity
            among most houseplants, think again. Numerous low-maintenance
            houseplants not only thrive in low-light conditions, like African
            violets, hoyas, and peace lilies, but they also blossom with vibrant
            flowers.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
