import "./HomePage.css";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";

const HomePage = () => {
  const [posts, setPosts] = useState([]);

  const randomPosts = [];

  const fetchPostData = () =>
    fetch(`${process.env.REACT_APP_API_URL}/getListings`, {
      // Retriving listings from database
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response);
        setPosts(response.data);
      })
      .catch((err) => {
        console.error(err);
      });

  useEffect(() => {
    fetchPostData();
  }, []);

  const generateRandomNum = () => {
    return Math.random() * (0 - posts.length) + 0;
  };

  const getRandomPosts = () => {
    randomPosts[0] = posts[generateRandomNum];
    randomPosts[1] = posts[generateRandomNum];
    randomPosts[2] = posts[generateRandomNum];
  };

  return (
    <div className="home-page">
      {/* <h1>PhotoSyntheSit</h1> */}
      <section className="home-section-1">
        <article>
          <h1>You Plant It</h1>
          <h1>We Plant Sit It</h1>
          <p>
            Experience worry-free plant care with PhotoSyntheSit – where passion
            meets expertise, ensuring your green companions thrive, even when
            life keeps you busy.
          </p>
          <Link to="bookings/">
            <button className="home-find-sitters">FIND SITTERS</button>
          </Link>
        </article>
        <img
          className="home-hero-1"
          src="home-3.webp"
          alt="Arrangement of plants"
        />
      </section>
      <section className="home-section-2">
        <h1>MISSION</h1>
        <p>
          Our mission at PhotoSyntheSit is to bridge the gap between plant
          enthusiasts and skilled caretakers, fostering a community dedicated to
          the well-being of your green family members during your absence.
          Through a commitment to trust, transparency, and sustainable
          practices, we aim to redefine plant-sitting by providing customized
          care that not only meets the unique needs of each plant but also
          nurtures a growing community of plant lovers.
        </p>
      </section>
      <main className="home-grid-section">
        <img
          className="home-grid-image"
          src="home-5.png"
          alt="Assortment of plants"
        />
        <section className="home-grid-content-1">
          <h3>We Connect You with Experienced Sitters</h3>
          <p>
            We connect you with experienced plant sitters who share a genuine
            passion for green life. Our carefully vetted team is equipped with
            the knowledge and dedication needed to ensure your plants receive
            expert care, allowing you to entrust their well-being to skilled
            hands.
          </p>
          <Link to="bookings/">
            <button>GET CONNECTED</button>
          </Link>
        </section>
        <section className="home-grid-content-2">
          <h3>Get Plant-Care Advice</h3>
          <p>
          <b>Coming soon:</b> Dive into a wealth of plant-care knowledge and tips under our 'Get Plant-Care Advice' section, where we'll answer your frequently asked questions and provide expert guidance to help you nurture your plants with confidence.
          </p>
          <Link to="plant-tips/">
            <button className="home-find-sitters" disabled>GET TIPS</button>
          </Link>
        </section>
        <img
          className="home-grid-image"
          src="home-1.jpg"
          alt="Guy holding plants"
        />
        <img
          className="home-grid-image"
          src="home-2.jpg"
          alt="Scenic view of flowers"
        />
        <section className="home-grid-content-1">
          <h3>Branch Out with the Plant Community</h3>
          <p>
            Branch out with the plant community on our social platform, where
            you can showcase your vibrant plant collection through images and
            engage in lively discussions with fellow enthusiasts. Share your
            green triumphs, seek advice, and connect with like-minded plant
            lovers to cultivate a thriving online community that celebrates the
            beauty and diversity of plants.
          </p>
          <Link to="branches/">
            <button className="home-find-sitters">BRANCH OUT</button>
          </Link>
        </section>
      </main>
      <section className="home-section-3">
        <h1>OUR EXPERIENCED PLANT SITTERS</h1>
        <p>
        Experience peace of mind with our dedicated team of skilled plant sitters, where passion, expertise, and a genuine love for plants converge to ensure your green companions receive the exceptional care they deserve.
        </p>
        <article className="home-section-sitters"></article>
      </section>
      <section className="home-section-4"></section>
      <section className="home-section-5"></section>
    </div>
  );
};

export default HomePage;
