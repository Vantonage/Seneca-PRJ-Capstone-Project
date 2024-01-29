import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./UserProfilePage.css";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isAuthFetched, setIsAuthFetched] = useState(false);

  const [user, setUser] = useState({});
  const [category, setCategory] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({});

  const [image, setImage] = useState("");
  const [posts, setPosts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    async function fetchAuthentication() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/isAuthenticated`,
        {
          method: "GET",
          credentials: "include",
        }
      ).catch((error) => {
        console.error("Error fetching authentication status", error);
      });
      const data = await response.json();
      console.log(data);
      if (data.user) {
        setIsAuthenticated(data.user._id);
      } else {
        setIsAuthenticated(null);
        navigate("/");
      }
      setIsAuthFetched(true); // Set isAuthFetched to true after the fetch is complete
    }
    fetchAuthentication();
  }, [navigate]);

  // If user is authenticated, fetch user data
  useEffect(() => {
    if (isAuthenticated && isAuthFetched) {
      fetch(
        `${process.env.REACT_APP_API_URL}/getUserById?id=${isAuthenticated}`,
        {
          method: "GET",
          credentials: "include",
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data); // REMOVE LATER
          if (data) {
            setUser(data.user);
            setUpdatedUser(data.user);
          } else {
            console.log("User not found");
            setUser({});
          }
        })
        .catch((error) => {
          console.error("Error fetching user data", error);
          setUser({});
        });
      setIsAuthFetched(false);
    } else if (!isAuthenticated && isAuthFetched) {
      setUser({});
      navigate("/");
      window.location.reload(true);
    }
  }, [isAuthenticated, isAuthFetched, user, navigate]);

  // const isDeleting = (
  //   <div className="flex h-full w-full flex-col items-center justify-center gap-4">
  //     <div className="text-gray-400">Deleting user account....</div>
  //   </div>
  // );

  const updateUser = async (e) => {
    e.preventDefault();
    try {
      console.log(updatedUser);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/updateUser`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        }
      );
      const data = await response.json();
      console.log(data); // REMOVE LATER
      setEditMode(false);
      setUpdatedUser({});
      window.location.reload(true);
    } catch (error) {
      console.error("Error:", error);
      setUpdatedUser({});
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/deleteUser`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: user._id }),
        }
      );
      const data = await response.json();
      console.log(data); // REMOVE LATER
      alert("Account Deleted");

      try {
        fetch(`${process.env.REACT_APP_API_URL}/logout`, {
          method: "POST",
          credentials: "include", // to send the cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            setUser({});
            navigate("/");
            window.location.reload(true);
          })
          .catch((error) => {
            alert("Unable to logout:", error);
          });
      } catch (error) {
        console.error("Error: unable to logout before deleting user. ", error);
      }
    } catch (error) {
      console.error("Error: Unable to delete user. ", error);
    }
  };

  // Delete if not needed
  // const deletePost = async (postId) => {
  //   try {
  //     const response = await fetch("/deletePost", {
  //       method: "DELETE",
  //       credentials: "include",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ id: postId }),
  //     });
  //     const data = await response.json();
  //     console.log(data);
  //     window.location.reload(); // Refresh the page
  //     setEditMode(false);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // Delete if not needed
  // const deleteOrder = async (postId) => {};

  // Convert image to base64
  function convertToBase64(e) {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setImage(reader.result);
      setUpdatedUser({
        ...updatedUser,
        profileImage: reader.result,
        id: user._id,
      });
    };
    reader.onerror = (error) => {
      console.log("Error: ", error);
    };
  }

  function resetEditModeOptions() {
    setEditMode(false);
    setConfirmDelete(false);
    setUpdatedUser(user);
  }

  useEffect(() => {
    const getUserPosts = async () => {
      setIsFetching(true);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getPostsByUserId?id=${isAuthenticated}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        console.log(data); // REMOVE LATER
        if (data) {
          setPosts(data.posts);
          setIsFetching(false);
        } else {
          console.log("Posts not found");
          setPosts({});
          setIsFetching(false);
        }
      } catch (error) {
        console.error("Error fetching posts", error);
        setPosts({});
        setIsFetching(false);
      }
    };

    if (category === 2) {
      getUserPosts();
    }
  }, [category, isAuthenticated]);

  const calculateTotalBooking = (item) => {
    const startDate = new Date(item.date.startDate);
    const endDate = new Date(item.date.endDate);
    const bookedTime = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

    return (item.userId.dailyRate * bookedTime * 2 * 1.13).toFixed(2);  }

  return (
    <main className="profile-page">
      <h1>My Profile</h1>
      <div>
        <div className="profile-section">
          <div className="profile-picture">
            {user.firstName && (
              <img
                src={
                  user.profileImage
                    ? user.profileImage
                    : "https://www.w3schools.com/howto/img_avatar.png"
                }
                alt="Avatar"
              />
            )}
          </div>
          <div className="profile-categories">
            <div className="categories"></div>
            <div
              className="categories"
              onClick={() => {
                setCategory(1);
                resetEditModeOptions();
              }}
              style={{
                backgroundColor: category === 1 ? "lightgray" : "transparent",
              }}
            >
              <h5>Personal Information</h5>
            </div>
            <div
              className="categories"
              onClick={() => {
                setCategory(2);
                resetEditModeOptions();
              }}
              style={{
                backgroundColor: category === 2 ? "lightgray" : "transparent",
              }}
            >
              <h5>Posts</h5>
            </div>
            <div
              className="categories"
              onClick={() => {
                setCategory(3);
                resetEditModeOptions();
              }}
              style={{
                backgroundColor: category === 3 ? "lightgray" : "transparent",
              }}
            >
              <h5>Orders</h5>
            </div>
            {/* <div className="categories" onClick={() => { setCategory(2); resetEditModeOptions(); }}>
              <h5>Payment Information</h5>
            </div> */}
            <div
              className="categories"
              onClick={() => {
                setCategory(5);
                resetEditModeOptions();
              }}
              style={{
                backgroundColor: category === 5 ? "lightgray" : "transparent",
              }}
            >
              <h5>Delete Account</h5>
            </div>
          </div>
          <div className="profile-details">
            {category === 1 && (
              <div className="profile-pi">
                <div className="details-title">
                  <h2>Personal Information</h2>
                </div>
                <div className="user-details">
                  <div className="profile-details">
                    {!editMode ? (
                      <>
                        <table>
                          <tbody>
                            <tr style={{ backgroundColor: "lightgray" }}>
                              <td>
                                <b>First Name:</b>
                              </td>
                              <td>{user.firstName}</td>
                            </tr>
                            <tr>
                              <td>
                                <b>Last Name:</b>
                              </td>
                              <td>{user.lastName}</td>
                            </tr>
                            <tr style={{ backgroundColor: "lightgray" }}>
                              <td>
                                <b>Email:</b>
                              </td>
                              <td>{user.email}</td>
                            </tr>
                            {user.role === 2 && (
                              <tr>
                                <td>
                                  <b>Employee ID:</b>
                                </td>
                                <td>{user.empId}</td>
                              </tr>
                            )}
                            {user.role === 2 && (
                              <tr style={{ backgroundColor: "lightgray" }}>
                                <td>
                                  <b>Daily Rate:</b>
                                </td>
                                <td>${user.dailyRate}</td>
                              </tr>
                            )}
                            <tr>
                              <td>
                                <b>Bio:</b>
                              </td>
                              <td>{user.bio}</td>
                            </tr>
                          </tbody>
                        </table>
                        <button
                          className="edit-pi-btn"
                          onClick={() => setEditMode(true)}
                        >
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <form onSubmit={updateUser}>
                          <label>
                            First Name:
                            <input
                              type="text"
                              value={updatedUser.firstName || ""}
                              onChange={(e) =>
                                setUpdatedUser({
                                  ...updatedUser,
                                  firstName: e.target.value,
                                  id: user._id,
                                })
                              }
                            />
                          </label>
                          <label>
                            Last Name:
                            <input
                              type="text"
                              value={updatedUser.lastName || ""}
                              onChange={(e) =>
                                setUpdatedUser({
                                  ...updatedUser,
                                  lastName: e.target.value,
                                  id: user._id,
                                })
                              }
                            />
                          </label>
                          {user.role === 2 && (
                            <label>
                              Daily Rate:
                              <input
                                type="number"
                                value={updatedUser.dailyRate || ""}
                                onChange={(e) =>
                                  setUpdatedUser({
                                    ...updatedUser,
                                    dailyRate: e.target.value,
                                    id: user._id,
                                  })
                                }
                              />
                            </label>
                          )}
                          <label>
                            Bio:
                            <textarea
                              rows="7"
                              value={updatedUser.bio || ""}
                              onChange={(e) =>
                                setUpdatedUser({
                                  ...updatedUser,
                                  bio: e.target.value,
                                  id: user._id,
                                })
                              }
                            />
                          </label>
                          <label>
                            Profile Image:
                            <input
                              accept="image/+"
                              type="file"
                              onChange={convertToBase64}
                            />
                            {image === "" || image === null ? (
                              ""
                            ) : (
                              <img
                                width={100}
                                height={100}
                                src={image}
                                alt="Profile"
                              />
                            )}
                          </label>
                          <div className="btn-group" role="group">
                            <button type="submit" className="btn btn-success">
                              Submit
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                setEditMode(false);
                                setUpdatedUser(user);
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            {category === 2 && (
              <div className="profile-posts">
                <div className="user-posts">
                  <div className="details-title">
                    <h2>Posts</h2>
                  </div>
                  {isFetching ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="post-list">
                      {posts && posts.length > 0 ? (
                        <table>
                          <thead>
                            <tr>
                              <th>
                                <h5>Name</h5>
                              </th>
                              <th>
                                <h5>Date Created</h5>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {posts.map((post, index) => (
                              <tr
                                className={`post ${
                                  index % 2 === 0 ? "even" : "odd"
                                }`}
                                key={index}
                              >
                                <td>
                                  <Link to={`/branches/${post._id}`}  style={{ color: 'black' }}>
                                    {post.name}
                                  </Link>
                                </td>
                                <td>
                                  {new Date(post.createdAt).toLocaleDateString(
                                    "en-GB",
                                    {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    }
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>No Posts found</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {category === 3 && (
              <div className="profile-orders">
                <div className="user-orders">
                  <div className="details-title">
                    <h2>Orders</h2>
                  </div>
                  <div className="orders-list">
                    {user.orders && user.orders.length > 0 ? (
                      user.orders.map((order, index) => (
                        <div
                          className="order"
                          key={index}
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          {order.map((item, i) => (
                            <div key={i}>
                              {i > 0 && <hr />}
                              <p>
                                <b>Product:</b>{" "}
                                {item.title
                                  ? item.title
                                  : `Plantsitter service (${item.userId.firstName} ${item.userId.lastName})`}
                              </p>
                              <p>
                                <b>Price:</b> ${item.price ? (item.price * 1.13).toFixed(2) : (calculateTotalBooking(item))}
                              </p>
                                {item.createdAt && (
                                  <p>
                                    <b>Date Ordered: </b>
                                    {new Date(
                                      item.createdAt
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                  </p>
                                )}
                                {item.date && (
                                  <p>
                                    <b>Start Date:</b> {new Date(
                                      item.date.startDate
                                    ).toLocaleDateString("en-GB", {
                                      day: "2-digit",
                                      month: "2-digit",
                                      year: "numeric",
                                    })}
                                    <br />
                                  <b>End Date:</b> {new Date(
                                    item.date.endDate
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  })}
                                </p>
                                )}
                            </div>
                          ))}
                        </div>
                      ))
                    ) : (
                      <p>No Orders found</p>
                    )}
                    {user.orders && user.orders.length > 0 && !editMode && (
                      <Link to="/orders">
                        <button className="edit-pi-btn">
                          View more information
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )}

            {category === 5 && (
              <div className="profile-delete">
                <div className="details-title">
                  <h2>Delete Account</h2>
                </div>
                <div className="delete-account">
                  {confirmDelete ? (
                    <div className="confirm-delete">
                      <p>Are you sure you want to delete your account?</p>
                      <p>
                        This is a permanent action and your account will be
                        deleted.
                      </p>
                      <button
                        className="confirm-delete-btn"
                        onClick={deleteUser}
                      >
                        Confirm Delete
                      </button>
                    </div>
                  ) : (
                    <button
                      className="delete-account-btn"
                      onClick={() => setConfirmDelete(true)}
                    >
                      Delete Account
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserProfilePage;
