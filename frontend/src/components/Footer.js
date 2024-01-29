import React from 'react';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button';
import './Footer.css'

function Footer() {
    return (
        <footer className="footer">
            <div className="parent-footer-container">
                <div className="footer-left-container">
                    <h3>Logo</h3> <br />
                    <p>&copy; {new Date().getFullYear() - 3} - {new Date().getFullYear()}</p>
                </div>
                <div className="footer-middle-container">
                    <h3>OUR SERVICES</h3><br />
                    <div className="service-links">
                        <Link className='footer-hire' to='bookings/'>Hire a Plant Sitter</Link> <br />
                        <Link className='footer-shop' to='listings/'>Shop Plants</Link> <br />
                        <Link className='footer-care' to='plant-tips/'>Plant Care Tips</Link>
                    </div>
                </div>
                <div className="footer-right-container">
                    <h3>SOCIALS</h3><br />
                    <Button variant="primary" className="twitter"><i class="fa-brands fa-square-twitter fa-2xl"></i></Button>
                    <Button variant="primary" className="instagram"><i class="fa-brands fa-square-instagram fa-2xl"></i></Button>
                    <Button variant="primary" className="facebook"><i class="fa-brands fa-square-facebook fa-2xl"></i></Button>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
