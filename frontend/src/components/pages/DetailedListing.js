import './DetailedListing.css'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState  } from "react";

import { Button } from 'react-bootstrap';

import UpdateListing from '../updateListing'

const DetailedListing = () => {

    const navigate = useNavigate();
    const [listingDetails, setListingDetails] = useState({});

    let params = useParams()
    let id = params.postId
    // console.log(params.postId)

    const fetchPostData = async () => 
        await fetch(`${process.env.REACT_APP_API_URL}/getListingById`, {
            method: "POST", 
            body: JSON.stringify({id}),
            headers:{
                'Content-Type': 'application/json'
            }
        }
        )            
        .then((res) => {    
            return res.json()
        }).then((data) => {                        // Saving correct index to state variable
            setListingDetails(data.data)
        }).catch((err) => {console.log(err)})       // Error catching

    useEffect(() => {
        fetchPostData()
    }, [])


    const handleDelete = async() => {

        if (window.confirm("Are you sure you want to delete this listing?") === true){
            await fetch(`${process.env.REACT_APP_API_URL}/deleteListing`, {
                method: "DELETE", 
                body: JSON.stringify({id}),
                headers:{
                    'Content-Type': 'application/json'
                }
            }
            )            
            .then((res) => {    
                return res.json()
            }).then((data) => {                        // Saving correct index to state variable
                console.log(data)
            }).catch((err) => {console.log(err)})       // Error catching

            navigate('/listings')
            // window.location.reload(false)
        }
    }

    const [user, setUser] = useState({})

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
                // console.log(data.user)
                setUser(data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
                // setUser(null)
            });
    },[])
                                                     
    const userListing = () => {
        if (user != null && user.email != null) {
            if (user.email === listingDetails.posterEmail) {
                return (
                    <>
                    <hr/>
                    <p>Welcome back {user.firstName} {user.lastName}! Post tools unlocked</p>
                    <p>Listing made with id: {user.email} </p>
                        <div className='crud-btns'>
                            <UpdateListing listing={listingDetails}/>
                            <Button variant="danger" onClick={handleDelete}>DELETE LISTING</Button>
                        </div>
                    </>
                )
            }
        }
    }

    const [cart, setCart] = useState([{}])

    const handleCartChange = (e) => {
        if (user) {
            // const storedCart = localStorage.getItem('cart')  
        }

        console.log(e)
    }

    return (
        <>
            <NavLink to='../listings/'><h3>Go back</h3></NavLink>
            <div className='detail-listing'>
                <div className='detailed-listing-area'>
                    <h1>{listingDetails.title}</h1>
                    <div>
                        <img src={listingDetails.image || "/PhotoSyntheSit_logo.PNG"} alt="Main detailed product indicated by title" width={1200} height={800}/>
                    </div>
                    {userListing()}         
                </div>
                <div className='detailed-side-area'>
                    <div className='detailed-side-info'>
                        <p>Post created by: {listingDetails.posterEmail}</p>

                    </div>
                    <p>{listingDetails.description}</p>
                    <p className='side-price'>${listingDetails.price}</p>
                    <button onClick={handleCartChange}>ADD TO CART</button>
                    <p>Quantity Available: {listingDetails.quantity}</p>
                </div>
            </div>
        </>
    )
}

export default DetailedListing;