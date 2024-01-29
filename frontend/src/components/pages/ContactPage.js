import React, { useState, useRef } from "react";
import "./ContactPage.css";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [messageError, setMessageError] = useState("");

  const form = useRef();
  const [formSent, setFormSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (name.trim() === "") {
      setNameError("Please enter a valid name");
      setFormSent(false);
      setIsSubmitting(false);
    } else {
      setNameError("");
    }

    if (message.trim() === "") {
      setMessageError("Please enter a valid message");
      setFormSent(false);
      setIsSubmitting(false);
    } else {
      setMessageError("");
    }

    if (name.trim() !== "" && email && message.trim() !== "") {
      emailjs
        .sendForm(
          "service_kudp9jv",
          "template_7e2n0or",
          form.current,
          "QEAGFnMLHJhEEv9y0"
        )
        .then(
          (result) => {
            console.log(result.text);
            if (result.status === 200) {
              setFormSent(true);
              setIsSubmitting(false);
              setName("");
              setEmail("");
              setMessage("");
            }
          },
          (error) => {
            console.log(error.text);
          }
        );
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    setNameError("");
    setFormSent(false);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
    setFormSent(false);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    setMessageError("");
    setFormSent(false);
  };

  return (
    <div className="contact-page">
      <h1>Get In Touch!</h1>
      <br />
      <br />
      <div className="form-container">
        <form ref={form} onSubmit={handleSubmit} className="form-1">
          <div className="contact-form">
            <label htmlFor="name">Name:</label>
            <input
              size={50}
              type="text"
              name="name"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={handleNameChange}
              required
            />
            {nameError && <span className="error">{nameError}</span>}
          </div>

          <div className="contact-form">
            <label htmlFor="email">Email:</label>
            <input
              size={50}
              type="email"
              name="email"
              id="email"
              placeholder="Enter your email address"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <span className="error">{emailError}</span>}
          </div>

          <div className="contact-form">
            <label htmlFor="message">Message:</label>
            <textarea
              cols={75}
              rows={20}
              name="message"
              id="message"
              placeholder="Enter your message"
              value={message}
              onChange={handleMessageChange}
              required
            />
            {messageError && <span className="error">{messageError}</span>}
          </div>

          <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Submitting..." : "Submit"}</button>
        {formSent && <h3>
          <br/><br/>Form was successfully sent</h3>}
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
