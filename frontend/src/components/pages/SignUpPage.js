import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignUpPage.css";

const SignUpPage = () => {
  const navigate = useNavigate();

  // Form States
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [empId, setEmpId] = useState("");

  const [errorFname, setErrorFname] = useState("");
  const [errorLname, setErrorLname] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errorEmpId, setErrorEmpId] = useState("");

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

  const validateForm = () => {
    let isValidated = true;

    if (fname === "") {
      setErrorFname("Please enter your first name");
      isValidated = false;
    } else {
      setErrorFname("");
    }

    if (lname === "") {
      setErrorLname("Please enter your last name");
      isValidated = false;
    } else {
      setErrorLname("");
    }

    if (email === "") {
      setErrorEmail("Please enter your email");
      isValidated = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorEmail("Please enter a valid email address");
      isValidated = false;
    } else {
      setErrorEmail("");
    }

    if (password === "") {
      setErrorPassword("Please enter your password");
      isValidated = false;
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}/.test(
        password
      )
    ) {
      setErrorPassword(
        "Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 symbol, and be at least 8 characters long"
      );
      isValidated = false;
    } else {
      setErrorPassword("");
    }

    if (!empId.startsWith("12") && empId !== "") {
      setErrorEmpId(
        "Invalid employee number. Please contact your manager."
      );
      isValidated = false;
    } else {
      setErrorEmpId("");
    }

    return isValidated;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (validateForm()) {
      // Temporary to view user inputs  -- REMOVE LATER
      console.log({
        email: email,
        password: password,
        firstName: fname,
        lastName: lname,
        empId: empId
      });

      const body = {
        email: email,
        firstName: fname,
        lastName: lname,
        password: password
      };
      
      if (empId !== "") {
        body.empId = empId;
      }

      // Fetch request to backend to create user
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        });

        const dataResponse = await response.json();

        if (dataResponse.status === "error-email") {
          alert(`Error: ${dataResponse.error}`);
          setErrorEmail(dataResponse.error);
        } else if (dataResponse.status === "error-empId") {
          alert(`Error: ${dataResponse.error}`);
          setErrorEmpId(dataResponse.error);
        } else {
          setErrorEmail("");
          navigate("/login");
        }
      } catch (err) {
        console.error(err);
        alert("Unable to create user due to server error.");
      }
    } else {
      alert("Unable to create user to do invalid inputs.");
    }
  };

  return (
    <div className="signup-page">
      <div className="row">
        <div className="column">
          <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
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
            {errorEmail && <div className="error">{errorEmail}</div>}
            <br />
            <input
              size={50}
              type="text"
              id="fname"
              name="fname"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              placeholder="First Name"
              required
            />
            {errorFname && <div className="error">{errorFname}</div>}
            <br />
            <input
              size={50}
              type="text"
              id="lname"
              name="lname"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              placeholder="Last Name"
              required
            />
            {errorLname && <div className="error">{errorLname}</div>}
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
            {errorPassword && <div className="error">{errorPassword}</div>}
            <br />
            <i>Leave empty if not an employee</i>
            <input
              type="text"
              name="empId"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="Employee Number"
            />
            {errorEmpId &&  <div className="error">{errorEmpId}</div>}
            <button className="button" type="submit">
              <h5>Register</h5>
            </button>
            <br />
            <br />
            <i>Already a user?</i>{" "}
            <Link className="login-link" to="/login">
              LOGIN
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

export default SignUpPage;
