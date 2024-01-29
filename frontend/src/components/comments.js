import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './comments.css'

import { clean } from 'profanity-cleaner';

function Comments({ detailedPostId }) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = async () => {
      setShow(true);
      //console.log(detailedPostId.detailedPostId);
      //getCommentById();
      //console.log("POSTID" + postId)
      //console.log(userName);
    };
  
  console.log(detailedPostId)
  
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
      window.location.reload(true) 

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
        postId: detailedPostId,
        name: userName,
      }));
    }, [name, userName]);
  
  
  
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
    <div className="comment-section">
      {cookieUser && cookieUser._id ? (
        <div className='addCommentBox'>
          <p className="name">{cookieUser.firstName} {cookieUser.lastName}</p>
          <div className='textAreaCommentBox'>
            <textarea
                placeholder="Type a comment here"
                value={comment}
                onChange={handleChange}
                rows={5}
                cols={100}
            />
        </div>
        <div className='commentButton'>
          <button onClick={handleSubmit}>
            Comment
          </button>
          </div>
        </div>
      ) : (
        <p>Please log in to post comments.</p>
      )}

      {comments
        .filter((comment) => comment.postId === detailedPostId)
        .map((comment) => (
          <div key={comment.id} className="comment-box">
            <p className="comment-name">{comment.name}</p>
            <p className="comment-text">{comment.comment}</p>
          </div>
        ))}
    </div>
  );
}

export default Comments;
