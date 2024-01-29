import { useEffect, useState } from "react";
import { Link, useNavigate  } from "react-router-dom";
import ReactPaginate from 'react-js-pagination';
import {Card, Button, Modal, DropdownButton, Dropdown} from 'react-bootstrap'
import AddNewListing from '../addNewListing'

import "./Listings.css"

function Listings() {

    const navigate = useNavigate();
    const [posts, setPosts] = useState([])

    const fetchPostData = () =>
        fetch(`${process.env.REACT_APP_API_URL}/getListings`,{     // Retriving listings from database
            method: "GET",

        }).then((res) => {
            return res.json()
        }).then((response) => {
            console.log(response)
            setPosts(response.data)
        }).catch((err) => {
            console.error(err)
        })

    useEffect(() => {
        fetchPostData()
    }, [])


    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;     
    let currentListing = posts.slice(indexOfFirstUser, indexOfLastUser);

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
            console.log(data.user)
            setUser(data.user);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }, []); // empty dependency array means this effect runs once on mount



    // Cart stuff

    const [cart, setCart] = useState([{}])

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleCartChange = (e) => {
        // console.log(e.target.getAttribute('index'))
        const index = e.target.getAttribute('index')
        if (user) {
            
            let cartStorage = JSON.parse(localStorage.getItem('cart'));

            let type = "type"
            let value = "listing"
            let buyQuantity = 0;

            currentListing[index][type] = value;
            currentListing[index][buyQuantity] = 1;

            // delete currentListing[index].image

            cartStorage.push(currentListing[index])

            localStorage.setItem('cart', JSON.stringify(cartStorage))

            // if (window.confirm("1x " + currentListing[index].title + " added to cart!\n Continue Shopping?") === false)
            // {
            //     navigate('/cart')
            // }
        }
        else {
            alert("Please login to add items to your cart!")
            navigate('/login')
            window.location.reload(true);
        }
    }

    const handleAddingItem = (e) => {
        handleCartChange(e);
        handleShow();
    }

    const goToCart = () => navigate("/cart");

    // searching

    // search field
    const [query, setQuery] = useState("");

    let filteredPosts = posts.filter(post =>{
        return post.title.toLowerCase().includes(query.toLowerCase());
    })

    filteredPosts = filteredPosts.slice(indexOfFirstUser, indexOfLastUser);
    
    // Sorting

    const [filterOption, setFilterOption] = useState("");
    const [reversedArray, setReversedArray] = useState(false);

    const sortListings = (sortMethod) => {
        setFilterOption(sortMethod);

        if (sortMethod === "priceL") {
            setPosts(posts.sort((a, b) => a.price - b.price))
        }
        if (sortMethod === "priceH") {
            setPosts(posts.sort((a, b) => b.price - a.price))
        }
        if (sortMethod === "dateN") {
            if (reversedArray === false) {
                setPosts(posts.reverse());
                setReversedArray(true)
            }
        }
        if (sortMethod === "dateO") {
            if (reversedArray === true) {
                setPosts(posts.reverse());
                setReversedArray(false)
            }
        }
        if (sortMethod === "AD") {
            setPosts(posts.sort((a, b) => {
                if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
                if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
            }));
        }
        if (sortMethod === "AA") {
            setPosts(posts.sort((a, b) => {
                if (a.title.toLowerCase() < b.title.toLowerCase()) return 1;
                if (a.title.toLowerCase() > b.title.toLowerCase()) return -1;
            }));
        }

        currentListing = posts.slice(indexOfFirstUser, indexOfLastUser);
        console.log(sortMethod)

        // return filteredPosts.sort( (a, b) => a.price - b.price);
    }

    const postSortingMethod = () => {
        if (filterOption === "dateN"){
            return (<p>Sorting by: Newest to Oldest</p>)
        }
        
    }

    return (
        <div className="listing">
            <h1>SHOP PLANTS</h1>
            <p>Shop from a variety of our indoor and outdoor plants.</p>

            <Modal onHide={handleClose} show={show} size="lg" aria-labelledby="contained-modal-title-vcenter" centered >
                <Modal.Header closeButton>
                    <Modal.Title>Item added to cart!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Would you like to continue shopping?</Modal.Body>
                <Modal.Footer>
                <Button onClick={handleClose}>Continue Shopping</Button>
                <Button onClick={goToCart}>Go To Cart</Button>
                </Modal.Footer>
            </Modal>
              
            {user != null && <AddNewListing user={user}/>}
            <div className="listing-toolbar">
                <input value={query} onChange={e => setQuery(e.target.value)} type='search' placeholder='Search Listings' />
                <DropdownButton variant="secondary" title="Filter" onSelect={sortListings} onClick={postSortingMethod}>
                    <Dropdown.Item eventKey="dateN">Date added: Newest to Oldest</Dropdown.Item>
                    <Dropdown.Item eventKey="dateO">Date added: Oldest to Newest</Dropdown.Item>
                    <Dropdown.Item eventKey="priceH">Price: High to Low</Dropdown.Item>
                    <Dropdown.Item eventKey="priceL">Price: Low to High</Dropdown.Item>
                    <Dropdown.Item eventKey="AD">Alphabeticaly: Decending</Dropdown.Item>
                    <Dropdown.Item eventKey="AA">Alphabeticaly: Acending</Dropdown.Item>
                </DropdownButton>
                {filterOption && postSortingMethod}
            </div>
            <main className="listing-grid">
                {
                    filteredPosts.length > 0 ?
                    filteredPosts.map((post, index) => {
                        return (
                            <Card className="listing-item">
                                <Card.Img variant="top" src={post.image || "/PhotoSyntheSit_logo.PNG"} className=".listing-item-image" width={(300)} height={200}/>
                                <Card.Body className="card-body-bookings listing-item-content">
                                    <Card.Text className="card-text-bookings">
                                        <br />
                                        {post.posterEmail}
                                        <br />
                                        <br />
                                        <h2>{post.title}</h2>
                                        <br />
                                        <p>{post.description}</p>
                                        <h3>${post.price}</h3>
                                        <p>Current stock: {post.quantity || 0}</p>       
                                        <Button index={index} variant="primary" onClick={handleAddingItem}>Buy</Button>
                                        <Button variant="success" as={Link} to={'/listings/' + post._id} >View Details</Button>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        )
                    }) :
                    (
                        <div className="col-md-12">
                            <Card>
                                <Card.Body>
                                    <div>
                                        <img src="/PhotoSyntheSit_logo.PNG" width={200} height={200} alt="listings" className="branchesPhoto" />                          
                                    </div>
                                    <div>
                                        <p>Nothing was found. Please try a different search term.</p>
                                    </div>

                                </Card.Body>
                            </Card>
                        </div>
                    )
                }

            </main>
            {/* <div className="listing-side-images">
                <img src="/PhotoSyntheSit_logo_transparent.PNG" alt="Side plant images" />
            </div> */}
            <div className="branches-pagination">
                <ReactPaginate
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={posts.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText="Previous"
                    nextPageText="Next"
                />
            </div>
        </div>
    )
}

export default Listings;