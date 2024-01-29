import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function AddBranchPosting(user) {
    const [show, setShow] = useState(false);

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

    const handleClose = () => setShow(false);
    const handleShow = async () => {
        setShow(true);
        console.log(user.user);
      };

    const [post, setPost] = useState({
        name: "",
        description: "",
        userId: "",
        posterName: "",
    });

    

    const {name, description, userId, posterName} = post;

    const handleChange = (e) =>{
        setPost({...post,[e.target.name]:e.target.value})
    }

    useEffect(() => {
        // Update postId in the state when detailedPostId changes
        setPost((prevState) => ({
          ...prevState,
          userId: user.user,
          posterName: `${cookieUser.firstName} ${cookieUser.lastName}`
          
        }));
      }, [user.user, cookieUser]);

    const handleSubmit = async (e) =>{
        e.preventDefault();
        console.log(name, description, userId);

        let result = await fetch(`${process.env.REACT_APP_API_URL}/postBranch`, {
            method: 'POST',
            crossDomain: true,
            body:JSON.stringify({name, description, image: { base64: image }, userId, posterName}),
            headers:{
                'Content-Type': 'application/json',
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        });
        result = await result.json();
        console.log(result);
        window.location.reload(true);
    }


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
        <>
            <Button variant="primary" className="create-post" onClick={handleShow}>CREATE POST
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Add a post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <input type='text' placeholder='Enter your post title' onChange={handleChange} name='name'/>
        
                        <textarea 
                        placeholder='Enter your description' 
                        onChange={handleChange} 
                        name='description'
                        rows={5}
                        cols={40}
                        />

                        Upload Post Image
                        <input
                        accept='image/+'
                        type='file'
                        onChange={convertToBase64}
                        />
                        {image=="" || image==null ? "": <img width={100} height={100} src={image}/> }
                        
                    <button className="btn btn-blue" onClick={handleClose}>Post</button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddBranchPosting;