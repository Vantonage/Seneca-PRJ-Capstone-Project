import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ReactPaginate from 'react-js-pagination';
import AddBranchPosting from '../addBranchPost';
import ShareButton from '../shareButton';
import CommentButton from '../commentButton';
import { Form, Link } from "react-router-dom";

import './Branches.css';

function Branches() {

    const [cookieUser, setCookieUser] = useState({});
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 7;
    const [comments, setComments] = useState([]);
    const [query, setQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/isAuthenticated`, {
            method: "GET",
            credentials: "include",
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
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/postBranch`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setData(data.data);
                setFilteredData(data.data); // Initialize filtered data with all posts
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getComments`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setComments(data.data);
            })
            .catch((error) => {
                console.error('Error fetching comments:', error);
            });

    }, []);

    useEffect(() => {
        setFilteredData(data.filter(post => post.name.toLowerCase().includes(query.toLowerCase())));
        setCurrentPage(1); // Reset current page to 1 when filtering
    }, [data, query]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);


    return (
        <div>
            <h1>BRANCHES</h1>
            <br />
            <h5>Branch Out. Make Post, Share Your Thoughts. Engage With the Community.</h5>
            <br />
            <div className="parent-container-branches">
                <div className="left-container-branches">

                    <Card>
                        <Card.Body>
                            <img src="/annie-spratt-7SXNxz8UIw4-unsplash.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>

                    <Card>
                        <Card.Body>
                            <img src="/joanna-kosinska-ToV0rS9nTYs-unsplash.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>


                    <Card>
                        <Card.Body>
                            <img src="/annie-spratt-4CQ3sEkV-TE-unsplash.jpg" alt="Profile"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        </Card.Body>
                    </Card>




                </div>
                <div className="middle-container-branches">
                    <input value={query} onChange={e => setQuery(e.target.value)} type='search' placeholder='Search through posts' />

                    <div className="card-container-branches">
                        {currentUsers.length > 0 ? (
                            currentUsers.map((user, index) => (

                                <div key={user.id} className="col-md-12">
                                    <Card>
                                        <Card.Body className="card-body-branches">
                                            <div className="image-container-branches">

                                                {user.image ? (
                                                    <img width={100} height={100} src={user.image} alt="User Image" />
                                                ) : (
                                                    <img src="/PhotoSyntheSit_logo.PNG" width={200} height={200} alt="branches" className="branchesPhoto" />
                                                )}
                                            </div>
                                            <div className="text-container-branches">
                                                <Link to={'/branches/' + user._id} className="no-underline">
                                                    <p>{user.name}</p>
                                                </Link>
                                                <p>{user.description}</p>
                                                <div className="comment-share">
                                                    <CommentButton detailedPostId={user._id} />
                                                    {(() => {
                                                        const userComments = comments.filter(c => c.postId === user._id);
                                                        const commentCount = userComments.length;
                                                        return (
                                                            <p>{commentCount} comment</p>
                                                        );
                                                    })()}
                                                    <ShareButton detailedPostId={user._id} />
                                                    Share
                                                </div>
                                            </div>

                                        </Card.Body>
                                    </Card>
                                </div>
                            ))

                        ) : (
                            <div className="col-md-12">

                                <Card>
                                    <Card.Body className="card-body-branches">
                                        <div className="image-container-branches">
                                            <img src="/PhotoSyntheSit_logo.PNG" width={200} height={200} alt="branches" className="branchesPhoto" />
                                        </div>
                                        <div className="text-container-branches">
                                            <p>Nothing was found. Please try a different search term.</p>
                                        </div>

                                    </Card.Body>
                                </Card>
                            </div>
                        )}
                    </div>

                </div>

                <div className='right-container-branches'>
                    <div className='right-container-branches-top'>
                        {cookieUser && (
                            <div>
                                <Card.Body className='branches-profile-card'>
                                    <div className="branches-bio-profile">
                                        {cookieUser.firstName && (
                                            <img
                                                src={cookieUser.profileImage ? cookieUser.profileImage : "https://www.w3schools.com/howto/img_avatar.png"}
                                                width={200}
                                                height={200}
                                                alt="branches"
                                                className="branches-profile-photo"
                                            />
                                        )}

                                        {cookieUser.firstName && (
                                            <h3>{cookieUser.firstName}</h3>
                                        )}
                                        {cookieUser.lastName && (
                                            <h3>{cookieUser.lastName}</h3>
                                        )}
                                    </div>
                                    <div className="branches-bio-description">
                                        <h1>BIO</h1>
                                        <br />
                                        {cookieUser.bio && (
                                            <p>
                                                {cookieUser.bio}
                                            </p>
                                        )}
                                    </div>
                                </Card.Body>
                                {cookieUser._id && (
                                    <AddBranchPosting user={cookieUser._id} />
                                )}
                            </div>
                        )}
                    </div>
                    <div className='right-container-branches-bottom'>

                        <Card>
                            <Card.Body>
                                <img src="/ethan-robertson-P86-JPbDnPY-unsplash.jpg" alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }}
                                />
                            </Card.Body>
                        </Card>


                        <Card>
                            <Card.Body>
                                <img src="/tomoko-uji-kxvn1ogpTtE-unsplash.jpg" alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }}
                                />
                            </Card.Body>
                        </Card>


                        <Card>
                            <Card.Body>
                                <img src="/rikonavt-oEWdQsbRVZk-unsplash.jpg" alt="Profile"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '400px' }}
                                />
                            </Card.Body>
                        </Card>

                    </div>
                </div>
            </div>
            <div className="branches-pagination">
                <ReactPaginate
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={filteredData.length}
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

export default Branches;