import { useState,useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const AddNewListing = (p) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const [user, setUser] = useState({})

    let user = p.user;

    const [post, setPost] = useState({
        title: "",
        description: "",
        price: 0,
        posterEmail: user.email,
        quantity: 0
    });

    console.log(user)
    const {title, description, price, quantity} = post;

    const handleSubmit = async (e) =>{
        e.preventDefault();
        let posterEmail = user.email
        let imageSrc = {base64: image}
        console.log(title, description, price, quantity, posterEmail);
        let result = await fetch(`${process.env.REACT_APP_API_URL}/postListing`, {
            method: 'POST',
            crossDomain: true,
            body:JSON.stringify({title, description, price, posterEmail, quantity, imageSrc}),
            headers:{
                'Content-Type': 'application/json',
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
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

    const [image, setImage] = useState("");

    function convertToBase64(e){
        console.log(e);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            console.log(reader.result);
            setImage(reader.result);
        };
        reader.onerror = error => {
            console.log("Error: ", error);
        }
    }

    return (
        <div>
            <Button variant="primary" size="lg" onClick={handleShow}>CREATE LISTING</Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>   {/*Adapted from AddBranchPost by Ricky */}
            <Modal.Dialog>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new listing</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <input type='text' placeholder='Enter your Listing Ttile' onChange={handleChange}  name='title'/>   
                        <textarea placeholder='Enter your description' onChange={handleChange} name='description'rows={5}cols={40}/>
                        <input type='text' placeholder='Enter Price' onChange={handleChange} name="price"/>           
                        {/* <input type='text' placeholder='Enter Email' onChange={handleChange} name="posterEmail"/>            */}
                        <input type='text' placeholder='Enter Quantity of item' onChange={handleChange} name="quantity"/>
                        <input accept='image/+' type='file' onChange={convertToBase64}/>
                        {image === "" || image == null ? "": <img width={300} height={300} src={image} alt="Listing item"/> }
                        <p>Logged in as: {user.email || p.email}</p>
                        <button className="btn btn-blue" onClick={handleClose}>Create Listing</button>
                    </form>
                </Modal.Body>
            </Modal.Dialog>
            </Modal>
        </div>
    )
}

export default AddNewListing;