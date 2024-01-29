import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './messageButton.css'
import ReplyButton from './replyMessage';

function MessageButton(props) {

    const [userName, setUserName] = useState("");
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
                setUserName(data.user.firstName + " " + data.user.lastName);
                //console.log(data.user);
                setCookieUser(data.user);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }, []); // empty dependency array means this effect runs once on mount

    useEffect(() => {
        // Update postId in the state when detailedPostId changes
        setMessage((prevState) => ({
            ...prevState,
            receiverId: props.userId,
            senderId: cookieUser._id,
            name: userName,
        }));
    }, [props.userId, cookieUser._id, userName]);


    const [show, setShow] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        //console.log(message);

        let result = await fetch(`${process.env.REACT_APP_API_URL}/postMessage`, {
            method: 'POST',
            body: JSON.stringify({ message, receiverId, senderId, name }), // Send the comment as a direct field
            headers: {
                'Content-Type': 'application/json'
            }
        });

        result = await result.json();
        //console.log(result);
    }

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        //console.log(cookieUser)
        //console.log("Receiver Id: " + userId.userId)
        // if (cookieUser) {

        //     console.log("Sender Id: " + cookieUser._id);
        // }
        //console.log("Message Receiver Id: " + fetchedMessages[0].receiverId)

        // fetchedMessages.forEach((message) => {
        //     if (message.receiverId === props.userId) {
        //         console.log("Message:", message);
        //     }
        // });
    }

    const [messagePost, setMessage] = useState({
        message: "",
        receiverId: "",
        senderId: "",
        name: "",
    });

    const { message, receiverId, senderId, name } = messagePost;

    const handleChange = (e) => {
        setMessage({ ...messagePost, message: e.target.value });
    }

    const [fetchedMessages, setFetchedMessages] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/getMessages`, {
            method: 'GET',
        })
            .then((res) => res.json())
            .then((data) => {
                setFetchedMessages(data.data);
            })
            .catch((error) => {
                console.error('Error fetching messages:', error);
            });

    }, []);

    const [showReplyButton, setShowReplyButton] = useState(false);
    const [replyUserId, setReplyUserId] = useState(null);

    const handleReply = (replyId) => {
        setReplyUserId(replyId);
        setShowReplyButton(true);
    }

    const handleCloseReplyButton = () => {
        setShowReplyButton(false);
    }


    return (
        <>
            <Button variant="primary" className="message-button" onClick={handleShow}>Message</Button>

            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>

                    <Modal.Title>
                        {receiverId === senderId ? (
                            <>
                                This is your message box
                            </>
                        ) : (
                            <>
                                Send a message to <br />
                                {props.userName}
                            </>
                        )}
                    </Modal.Title>
                </Modal.Header>
                {cookieUser && cookieUser._id ? (
                    <Modal.Body>
                        <div className="message-box-container">

                            {fetchedMessages.map((message) => (
                                <div key={message.id}>
                                    {(message.receiverId === props.userId && message.senderId === cookieUser._id) ||
                                        (message.receiverId === cookieUser._id && message.receiverId === props.userId) ? (
                                        <div className="message-box">
                                            <div className='message-name'>
                                                <p>{message.name}</p>
                                            </div>

                                            <div className='message-body' style={{ whiteSpace: 'pre-line' }}>
                                                <p>{message.message}</p>
                                            </div>

                                            {cookieUser._id === message.receiverId ? (
                                                <ReplyButton userId={message.senderId} repliedMessage={message.message} onClose={handleCloseReplyButton} />

                                            ) : null}

                                        </div>
                                    ) : null}
                                </div>
                            ))}

                            {cookieUser._id !== props.userId && (
                                <form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col sm={8}>
                                            <textarea
                                                placeholder='Send a message'
                                                onChange={handleChange}
                                                name='description'
                                                rows={5}
                                                cols={40}
                                            />

                                        </Col>
                                        <Col sm={4}>
                                        </Col>
                                    </Row>
                                    <button className="btn btn-blue" onClick={handleClose}>Send</button>
                                </form>
                            )}
                        </div>
                    </Modal.Body>

                ) : (
                    <Modal.Body>
                        <p>Please log in to send a message.</p>
                    </Modal.Body>
                )}
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default MessageButton;