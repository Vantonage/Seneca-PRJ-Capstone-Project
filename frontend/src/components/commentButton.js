import { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './commentButton.css'

import { clean } from 'profanity-cleaner';

function CommentButton(detailedPostId) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = async () => {
    setShow(true);
    //console.log(detailedPostId.detailedPostId);
    //getCommentById();
    //console.log("POSTID" + postId)
    //console.log(userName);
  };



  const [commentPost, setComment] = useState({
    comment: "",
    postId: "",
    name: "",
  });

  const { comment, postId, name } = commentPost;

  const handleChange = (e) => {
    setComment({ ...commentPost, comment: clean(e.target.value) });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(comment);


    let result = await fetch(`${process.env.REACT_APP_API_URL}/postComment`, {
      method: 'POST',
      body: JSON.stringify({ comment, postId, name }), // Send the comment as a direct field
      headers: {
        'Content-Type': 'application/json'
      }
    });

    result = await result.json();
    //console.log(result);
  }


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
    setComment((prevState) => ({
      ...prevState,
      postId: detailedPostId.detailedPostId,
      name: userName,
    }));
  }, [detailedPostId.detailedPostId, userName]);



  const [comments, setComments] = useState([]);

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


  const getCommentById = () => {
    console.log(comments);

  };

  return (
    <>
      <Button variant="primary" className="comment-link"><i className="fa-solid fa-message" onClick={handleShow}></i></Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Comments</Modal.Title>
        </Modal.Header>
        {/* Render comments */}

        {cookieUser && cookieUser._id ? (
          <Modal.Body>
            <p className="name">{cookieUser.firstName} {cookieUser.lastName}</p>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col sm={8}>
                  <textarea style={{ backgroundColor: '#d9d9d9' }}
                    placeholder='Type a comment here'
                    onChange={handleChange}
                    name='comment'
                    rows={5}
                    cols={40}
                  />
                </Col>
                <Col sm={4}>
                </Col>
              </Row>
              <button className="btn btn-blue" onClick={handleClose}>Comment</button>
            </form>

          </Modal.Body>

        ) : (
          <Modal.Body>
            <p>Please log in to post comments.</p>
          </Modal.Body>
        )}

        <div className="comment-box-container">
          {comments.map((comment) => (
            <div key={comment.id}>
              {comment.postId === postId && (
                <div className="comment-box">
                  <p className="comment-name">{comment.name}</p>
                  <p className="comment-text">{comment.comment}</p>
                </div>


              )}
            </div>
          ))}
        </div>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CommentButton;