import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function UpdateBranch(user) {
    const [show, setShow] = useState(false);

    const handleClose = () => {

        setShow(false);
    };

    const handleShow = async () => {
        setShow(true);
        console.log(user.user._id);
        console.log("IDDDD" + id);
    };

    const [post, setPost] = useState({
        name: user.user.name,
        description: user.user.description,
        userId: "",
        id: "",
    });


    const { name, description, userId, id } = post;

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        // Update postId in the state when detailedPostId changes
        setPost((prevState) => ({
            ...prevState,
            userId: user.user,
            id: user.user._id,
        }));
    }, [user.user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, description);

        let result = await fetch(`${process.env.REACT_APP_API_URL}/updateBranch`, {
            method: 'PUT',
            crossDomain: true,
            body: JSON.stringify({ name, description, image: { base64: image }, id }),
            headers: {
                'Content-Type': 'application/json',
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            }
        });
        result = await result.json();
        window.location.reload();
    }


    const [image, setImage] = useState("");


    function convertToBase64(e) {
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
            <Button variant="primary" className="create-post" onClick={handleShow}>UPDATE POST
            </Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}

            >
                <Modal.Header closeButton>
                    <Modal.Title>Update the post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <p>
                            <strong>Previous title : </strong> {user.user.name}
                        </p>
                        <input type='text'
                            placeholder='Enter your post title'
                            onChange={handleChange}
                            name='name' />

                        <p><strong>Previous description:</strong></p>
                        <p>
                            {user.user.description}
                        </p>
                        <textarea
                            placeholder='Enter your description'
                            onChange={handleChange}
                            name='description'
                            rows={5}
                            cols={40}
                        />

                        Upload Post Image
                        <p><strong>Previous image:</strong></p>

                        {user.user.image && <img src={user.user.image}
                            alt="Previous Image"
                            style={{ width: '100px', height: '100px', paddingBottom: '10px' }} />}

                        <input
                            accept='image/+'
                            type='file'
                            onChange={convertToBase64}
                        />
                        {image == "" || image == null ? "" : <img width={100} height={100} src={image} />}

                        <button className="btn btn-blue" onClick={handleClose}>Update</button>
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

export default UpdateBranch;