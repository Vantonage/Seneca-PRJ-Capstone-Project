import './DetailedPost.css'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { useEffect, useState } from "react";
import { Button } from 'react-bootstrap';
import Comment from '../comments';


import UpdateBranch from '../updatePost'

const DetailedPost = () => {
  const navigate = useNavigate();

  const [PostDetails, setPostDetails] = useState({});

  let params = useParams()
  let name = params.postId
  console.log("para" + params.postId)
  const fetchPostData = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/getPostById`, {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setPostDetails(data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

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
        console.log(data.user);
        setCookieUser(data.user);
      })
      .catch((error) => {
        console.error("Error:", error);
      });


    fetchPostData()
  }, []); // empty dependency array means this effect runs once on mount

  //console.log("POST ID" + PostDetails.userId)
  //console.log("User:" + cookieUser._id);
  console.log(PostDetails)

  const handleDelete = async () => {

    if (window.confirm("Are you sure you want to delete this posting?") === true) {
      await fetch(`${process.env.REACT_APP_API_URL}/deletePost`, {
        method: "DELETE",
        body: JSON.stringify({ postId: params.postId }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      )
        .then((res) => {
          return res.json()
        }).then((data) => {                        // Saving correct index to state variable
          console.log(data)
        }).catch((err) => { console.log(err) })       // Error catching

      navigate('/branches')
      // window.location.reload(false)
    }
  }

  return (
    <div className='detail-posting'>
      <NavLink to='../branches'><h3>Go back</h3></NavLink>
      <div className='detailed-posting-area'>
      <div className='postDetailTitle'>
        <h1>{PostDetails.name}</h1>
      </div>
        <div className='post-box'>
          <div className='post-box-left'>
            <div className='post-box-name'>
              <p>{PostDetails.posterName}</p>
            </div>
            <div className='post-box-image'>
              {PostDetails.image ? (
                <img width={300} height={300} src={PostDetails.image} alt="User Image" />
              ) : (
                <img src="/PhotoSyntheSit_logo.PNG" width={300} height={300} alt="branches" className="branchesPhoto" />
              )}
            </div>

          </div>
          <div className='post-box-description'>
            <p>{PostDetails.description}</p>
          </div>
        </div>
        <Comment detailedPostId={name} />

        {PostDetails.userId && cookieUser && cookieUser._id && PostDetails.userId === cookieUser._id && (
          <div className='crud-btns'>

            <UpdateBranch user={PostDetails} />
            <Button variant="danger" onClick={handleDelete}>DELETE POST</Button>

          </div>

        )}

      </div>
    </div>
  )
}

export default DetailedPost;