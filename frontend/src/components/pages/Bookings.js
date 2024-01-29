import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ReactPaginate from 'react-js-pagination';
import MessageButton from '../messageButton';
import HireButton from '../hireButton';
import './Bookings.css';

function Bookings() {

    const [data, setData] = useState([]);
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




    useEffect(() => {
        if (cookieUser) {
            let apiUrl;
            if (cookieUser.role === 1) {
                apiUrl = `${process.env.REACT_APP_API_URL}/getEmployees`;
            } else if (cookieUser.role === 2) {
                apiUrl = `${process.env.REACT_APP_API_URL}/getCustomers`;
            }

            if (apiUrl) {
                fetch(apiUrl, {
                    method: "GET",
                })
                    .then((res) => res.json())
                    .then((data) => {
                        setData(data.data);
                    })
                    .catch((error) => {
                        console.error("Error fetching data:", error);
                    });
            }
        } else {
            // Fetch employees when cookieUser is invalid
            fetch(`${process.env.REACT_APP_API_URL}/getEmployees`, {
                method: "GET",
            })
                .then((res) => res.json())
                .then((data) => {
                    setData(data.data);
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
        }
    }, [cookieUser]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentPost = data.slice(indexOfFirstUser, indexOfLastUser);

    return (
        <div>
            <h1>HIRE A PLANT SITTER</h1>
            <br />
            <h5>Choose from a variety of our experienced plant sitters.</h5>
            <br />
            <div className="parent-container-bookings">
                <div className="left-container-bookings">
                    <Card>
                        <Card.Body>
                            <img src="/rose-165819_1280.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <img src="/tomoko-uji-Oq6Mdb4o6vA-unsplash.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }}
                            />
                        </Card.Body>
                    </Card>


                    <Card>
                        <Card.Body>
                            <img src="/uljana-borodina-NFj6pEUdmpY-unsplash.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }}
                            />
                        </Card.Body>
                    </Card>

                </div>
                <div className="right-container-bookings">
                    <div className="card-container-bookings">
                        {cookieUser && (
                            <div className="col-md-6">
                                <Card>
                                    <Card.Body className="card-body-bookings">
                                        {cookieUser.firstName && (
                                            <img
                                                src={cookieUser.profileImage ? cookieUser.profileImage: "https://www.w3schools.com/howto/img_avatar.png"}
                                                width={300}
                                                height={300}
                                                alt="Profile"
                                            />
                                        )}
                                        <Card.Text className="card-text-bookings">
                                            <br />
                                            {cookieUser.firstName && cookieUser.lastName ? (
                                                <p>{cookieUser.firstName + " " + cookieUser.lastName}</p>
                                            ) : <p>{cookieUser.email}</p>}
                                            <br />
                                            {cookieUser.bio && (
                                                <p>{cookieUser.bio}</p>
                                            )}
                                            <br />
                                            
                                            {cookieUser._id && (
                                                <div style={{marginLeft: '70px'}}>
                                                    <MessageButton userId={cookieUser._id} />
                                                </div>
                                            )}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                        {data.length > 0 &&
                            currentPost.map(user => (
                                <div key={user.id} className="col-md-6">
                                    <Card>
                                        <Card.Body className="card-body-bookings">
                                            <img
                                                src={user.profileImage || "https://www.w3schools.com/howto/img_avatar.png"}
                                                width={300}
                                                height={300}
                                                alt="Profile"
                                                style={{marginRight: '70px'}}
                                            />
                                            <Card.Text className="card-text-bookings">
                                                <br />
                                                {user.firstName && user.lastName ? (
                                                    <p>{user.firstName + " " + user.lastName}</p>
                                                ) : <p>{user.email}</p>}
                                                <br />
                                                {user.bio || "Hello! I am a plant sitter. Nice to meet you!"}
                                                <br />
                                                <br />
                                                {cookieUser && cookieUser._id === user._id || user.role === 1 ? (
                                                    <></>
                                                ) : (
                                                    <HireButton userId={user} />
                                                )}
                                                    <MessageButton userName={user.firstName + " " + user.lastName} userId={user._id} />
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <div className="bookings-pagination">
                <ReactPaginate
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={data.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText="Previous"
                    nextPageText="Next"
                />
            </div>
        </div>
    );
}

export default Bookings;