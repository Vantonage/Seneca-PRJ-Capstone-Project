import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

function Navbar1() {
  // User Information state variable
  const [user, setUser] = useState({});
  const [cookieUser, setCookieUser] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/isAuthenticated`, {
      method: "GET",
      credentials: "include", // to send the cookies with the request
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCookieUser(data.user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []); // empty dependency array means this effect runs once on mount

  useEffect(() => {
    // Setting user info from local storage
    const storedUser = localStorage.getItem("user");
    storedUser ? setUser(JSON.parse(storedUser)) : setUser(null);
  }, []);

  const loggedInNav = () => {
    // Navbar for a logged in user
    // if (user != null) {
    if (cookieUser != null) {
      return (
        <Nav className="nav-user justify-content-end">
          <NavDropdown
            title={
              <img
                src="/abstract-user-flat-1.svg"
                width={53}
                height={53}
                alt="User Logo"
              />
            }
            id="basic-nav-dropdown"
          >
            {/* <p>Logged in as: {user.email}</p> */}
            <p>Logged in as: {cookieUser.email}</p>
            <NavDropdown.Item as={Link} to="/profile">
              My Profile
            </NavDropdown.Item>
            {/* <NavDropdown.Item as={Link} to="/orders">
              My Orders
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/profile/edit">
              Edit Profile
            </NavDropdown.Item> */}
            <NavDropdown.Item onClick={logOut}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      );
    }
  };

  const isLoggedIn = () => {
    // Checks if user is logged in and renders appropiate element

    // if (user == null) {
    if (cookieUser == null) {
      return (
        <>
          <Nav.Link as={Link} to="/login">
            <button className="nav-buttons">Log In</button>
          </Nav.Link>
          <Nav.Link as={Link} to="/signup">
            <button className="nav-buttons">Sign Up</button>
          </Nav.Link>
        </>
      );
    } else {
      return <div className="nav-filler"></div>;
    }
  };

  const logOut = () => {
    // "Logs out" the user by removing local storage items
    // if (user != null) {
    if (cookieUser != null) {

    //   setUser(null);
    //   localStorage.removeItem("userSignedIn");
    //   localStorage.removeItem("user");
    //   window.location.reload();

    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: "POST",
        credentials: "include", // to send the cookies with the request
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => response.json())
        .then((data) => {
            alert("Logout successful");
            setCookieUser(null);
            window.location.reload();
        })
        .catch((error) => {
            alert("Unable to logout:", error);
        });
    }
  };

  return (
    <Navbar expand="lg" className="navbar-txt">
      <Container fluid>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar-left">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              About
            </Nav.Link>
            <NavDropdown title="Our Services" id="basic-nav-dropdown">
              <NavDropdown.Item as={Link} to="/bookings">
                Hire a Plant sitter
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/listings">
                Shop Plants
              </NavDropdown.Item>
              {/* <NavDropdown.Item as={Link} to="/plant-tips">
                Plant Care Tips
              </NavDropdown.Item> */}
            </NavDropdown>
            <Nav.Link as={Link} to="/branches">
              Branches
            </Nav.Link>
          </Nav>
          <Navbar.Brand className="navbar-center">
            <img
              src="../../PhotoSyntheSit_logo_transparent.PNG"
              width={106}
              height={100}
              className="d-inline-block align-top"
              alt="Website logo"
            />
          </Navbar.Brand>
          <Nav className="navbar-right">
            {/* { user == null && <Nav.Link as={Link} to='/login'><button className="nav-buttons">Log In</button></Nav.Link>}
                        { user == null && <Nav.Link as={Link} to='/signup'><button className="nav-buttons">Sign Up</button></Nav.Link>}        */}
            {isLoggedIn()}
          </Nav>
          <Navbar.Brand className="navbar-right nav-cart" as={Link} to="cart/">
            <img
              src="../../Shopping_Cart_Icon.png"
              width={53}
              height={53}
              className="d-inline-block align-end"
              alt="Website logo"
            />
          </Navbar.Brand>
          {loggedInNav()}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navbar1;
