import { Link } from "react-router-dom";
import "./AboutPage.css";
import { Button } from "react-bootstrap";

const AboutPage = () => {
  return (
    <main className="about-page">
      <h1>
        <b>
          <i>PhotoSyntheSit</i>
        </b>
        : Your Trusted Plant Care Partner
      </h1>
      <br />
      <section className="about-section">
        <div className="about-col">
          <p>
            Welcome to PhotoSyntheSit, where we bring life to your plants and
            peace of mind to your life. We understand that your green companions
            are more than just decorations; they are a part of your home, your
            history, and your heart. Our mission is to ensure they thrive, even
            when you can't be there to care for them.
          </p>
          <br />

          <h2>
            <b>Our Story</b>
          </h2>

          <p>
            PhotoSyntheSit was born out of a deep passion for plants and a
            desire to solve a common problem faced by plant enthusiasts: the
            challenge of plant care during extended absences. We realized that
            many people, whether due to travel, work, or other commitments,
            struggle to provide the consistent care their plants need. That's
            when we decided to create a solution that would connect plant lovers
            with skilled caretakers who share our commitment to nurturing green
            life.
          </p>
          <br />

          <h2>
            <b>What We Do</b>
          </h2>

          <p>
            At PhotoSyntheSit, we specialize in plant-sitting services that go
            beyond mere maintenance. Our dedicated team of plant caretakers,
            each with a green thumb and a genuine love for plants, is ready to
            step in and provide the care your plants deserve. From watering and
            fertilizing to ensuring the right light conditions, we tailor our
            services to meet the unique needs of your plant family.
          </p>
          <br />
          <h2>
            <b>Why Choose Us</b>
          </h2>
          <p>
            Expert Caretakers: Our team is comprised of experienced plant
            enthusiasts who understand the diverse requirements of different
            plant species. We treat every plant as if it were our own.
            <br />
            Convenience: Booking our services is easy and hassle-free. Whether
            you're heading on a vacation or managing a busy schedule, we've got
            your plant care needs covered.
            <br />
            Trust and Transparency: We take the trust you place in us seriously.
            Our caretakers are thoroughly vetted, insured, and committed to
            providing the highest level of care. We maintain open communication
            throughout the plant-sitting process, sending updates and ensuring
            peace of mind.
            <br />
            Customized Care: Your plants are unique, and so is our approach. We
            work closely with you to understand your plant's specific
            requirements, ensuring they receive the care they need to flourish.
            <br />
            Sustainability: We are dedicated to sustainable and eco-friendly
            plant care practices. From using organic fertilizers to water
            conservation, we prioritize the well-being of your plants and the
            environment.
          </p>
          <br />

          <h2>
            <b>Join Our Growing Plant-Loving Community</b>
          </h2>

          <p>
            Whether you have a collection of rare succulents, towering
            houseplants, or a garden full of green wonders, PhotoSyntheSit is
            here to help you keep your plants thriving. Join our community of
            plant lovers who share a passion for greenery and a commitment to
            nurturing it.
          </p>

          <p>
            Thank you for considering PhotoSyntheSit as your trusted plant care
            partner. We look forward to serving you and your cherished plants.
            Let's grow together!
          </p>

          <br />
          <br />
          <Link to="/contact/">
            <Button variant="success" size="lg">
              Contact Us
            </Button>
          </Link>
        </div>
        <div className="about-col">
          <img src="../../about_me.jpg" alt="Side plant images" />
          {/* Could add multiple images here */}
          {/* <img src="../../about_me_2.jpg" alt="Side plant images"/>
          <img src="../../about_me_3.jpg" alt="Side plant images"/> */}
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
