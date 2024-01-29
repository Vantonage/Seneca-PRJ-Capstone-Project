import { useState,useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const UpdateListing = (props) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [user, setUser] = useState({})

    const [post, setPost] = useState({
        title: "",
        description: "",
        price: 0,
        posterEmail: user.email,
        quantity: 0
    });

    // useEffect(() => {                                                   // Setting user info from local storage
    //     const storedUser = localStorage.getItem('user');
    //     storedUser ? setUser(JSON.parse(storedUser)) : setUser(null);
    // },[])

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
                console.log(data.user)
                setUser(data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
                // setUser(null)
            });
    },[])

    let {title, description, price, quantity} = post;

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let id = props.listing._id;

        if (title.length === 0) title = props.listing.title;
        if (description.length === 0) description = props.listing.description;
        if (price === 0) price = props.listing.price;
        if (quantity === 0) quantity = props.listing.price;

        console.log(title, props.title, description, price);
        let result = await fetch(`${process.env.REACT_APP_API_URL}/updateListing`, {
            method: 'PUT',
            body:JSON.stringify({id, title, description, price, quantity}),
            headers:{
                'Content-Type': 'application/json'
            }
        });
        result = await result.json();
        console.log(result);
        
        window.location.reload(false);
    }

    const handleChange = (e) =>{
        console.log(e.target.value)
        setPost({...post,[e.target.name]:e.target.value})
    }

    // const handleUser = () => {
    //     setPost({...post, posterEmail: user.email})
    // }

    return (
        <div>
            <Button variant="primary" size="lg" onClick={handleShow}>UPDATE LISTING</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>   {/*Adapted from AddBranchPost by Ricky */}
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Update listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <p>Update Listing: (Leaving values empty retains default value)</p>  
                        <p>Current Title: {props.listing.title}</p>
                        <input type='text' placeholder='Enter new Title' onChange={handleChange} name="title"/>      
                        <p>Current Description: {props.listing.description}</p>
                        <textarea placeholder='Enter new description' onChange={handleChange} name='description'rows={5}cols={40}/>
                        <p>Current Price: {props.listing.price}</p>
                        <input type='text' placeholder='Enter new Price' onChange={handleChange} name="price"/>           
                        {/* <input type='text' placeholder='Enter Email' onChange={handleChange} name="posterEmail"/>            */}
                        <p>Current Quantity: {props.listing.quantity}</p>
                        <input type='text' placeholder='Enter new Quantity of item' onChange={handleChange} name="quantity"/>
                        <p>Logged in as: {user.email}</p>
                        <button className="btn btn-blue" onClick={handleClose}>Update Listing</button>
                    </form>
                </Modal.Body>
            </Modal.Dialog>
            </Modal>
        </div>
    )
}

export default UpdateListing;