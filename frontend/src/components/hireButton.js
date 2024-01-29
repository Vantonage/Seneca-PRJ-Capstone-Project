import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { DateRange } from 'react-date-range'
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css'
import './hireButton.css'
import { format } from 'date-fns';

function HireButton(userId) {
    const navigate = useNavigate();
    const [show, setShow] = useState(false);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     window.location.reload(false);
    // }


    const [user, setUser] = useState({})

    useEffect(() => {                                                   // Setting user info from local storage
        fetch(`${process.env.REACT_APP_API_URL}/isAuthenticated`, {
            method: "GET",
            credentials: "include", // to send the cookies with the request
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                //console.log(data.user)
                setUser(data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []); // empty dependency array means this effect runs once on mount

    const [hireOrder, setHireOrder] = useState({
        userId: userId.userId,
        date: null,
    });

    const handleCartChange = (e) => {
        // console.log(e.target.getAttribute('index'))
        const index = e.target.getAttribute('index')
        if (user) {

            let cartStorage = JSON.parse(localStorage.getItem('cart'));

            console.log(hireOrder)
            cartStorage.push(hireOrder)

            localStorage.setItem('cart', JSON.stringify(cartStorage))

        }
        else {
            alert("Please login to add items to your cart!")
            navigate('/login')
            window.location.reload(true);
        }
    }


    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
    }



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
                //console.log(data.user);
                setCookieUser(data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []); // empty dependency array means this effect runs once on mount



    const [date, setDate] = useState({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',

    });

    const handleChange = (ranges) => {
        setDate(prevDate => ({
            ...prevDate,
            startDate: ranges.selection.startDate,
            endDate: ranges.selection.endDate,
        }));
    }

    useEffect(() => {
        // Update postId in the state when detailedPostId changes
        setHireOrder({
            userId: userId.userId,
            date: date,
        });
    }, [userId.userId, date]);


    const [openDate, setOpenDate] = useState(false);
    const handleClick = () => {
        setOpenDate((prev) => !prev);

    }
    console.log(userId.userId)


    return (
        <>
            <Button variant="primary" className="hire-button" onClick={handleShow}>Hire</Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Hire plant sitter</Modal.Title>
                </Modal.Header>
                {cookieUser && cookieUser._id ? (
                    <Modal.Body>
                        <div className='hireUser'>
                            
                            <div className='hireLabels'>
                            <p className="text-center">
                                    <img src={userId.userId.profileImage} alt="Profile" className="centered-image" />
                                </p>
                                <p>
                                    First Name:
                                </p>
                                <p>
                                    Last Name:
                                </p>
                                <p>
                                    Description:
                                </p>
                            </div>
                            <div className='hireUserProperties'>

                                <p>
                                    {userId.userId.firstName}
                                </p>
                                <p>
                                    {userId.userId.lastName}
                                </p>
                                <p>
                                    {userId.userId.bio}
                                </p>
                            </div>

                        </div>
                        <form onSubmit={handleCartChange}>
                            <p>Would you like to hire this plant sitter?</p>
                            <p>My daily rate is: ${userId.userId.dailyRate}</p>
                            <span className='calender' onClick={handleClick}>
                                {`${format(date.startDate, "MMM, dd, yyyy")} to ${format(date.endDate, "MMM, dd, yyyy")}`}
                            </span>
                            {openDate && <DateRange className='dateRange'
                                ranges={[date]}
                                onChange={handleChange}
                                minDate={new Date()}


                            />}
                            <button className="btn btn-blue" onClick={handleClose}>Hire</button>
                        </form>

                    </Modal.Body>
                ) : (
                    <Modal.Body>
                        <p>Please log in to hire a plant sitter.</p>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Don't hire
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default HireButton;