import './CartPage.css'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { Link, useNavigate  } from "react-router-dom";

function CartPage() {

    const [cart, setCart] = useState([{}]);
    const navigate = useNavigate();

    // setCart(JSON.parse(localStorage.getItem('cart')))

    useEffect(() => {
        const cartStorage = localStorage.getItem('cart')
        console.log(cartStorage)
        cartStorage ? setCart(JSON.parse(cartStorage)) : setCart(null)
    }, []);

    const removeCart = () => {
        if (window.confirm("Are you sure you want to remove the contents of this cart?") === true)
        {
            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));
        }     
    }


    const removeItem = (e) => {   
        const index = e.target.getAttribute('index')
        console.log(index)
        if (user) {   
            const cartStorage = JSON.parse(localStorage.getItem('cart'))
            console.log(cartStorage)
            cartStorage.splice(index, 1);
            setCart(cartStorage)
            localStorage.setItem('cart', JSON.stringify(cartStorage)) 
            // setCart(cartStorage)
        }
    }      

    const [user, setUser] = useState({})

    useEffect(() => {                                                   // Setting user info from local storage
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
        });
    }, []); // empty dependency array means this effect runs once on mount

    const placeOrder = async() => {
        if (user) {

            // for (let i=0; i < cart.length; i++) {
            //     let quantityUpdate = await fetch("http://localhost:3001/updateListingQuantity", {
            //         method: "PUT",
            //         credentials: "include",
            //         headers: {
            //             "Content-Type": "application/json",                    
            //         },
            //         body: JSON.stringify({title: cart[i].title, count: 1})
            //     })

            //     quantityUpdate = await quantityUpdate.json();
            //     console.log(quantityUpdate)
            // }

            // Removing images from cart object before saving to reduce size
            for (let i = 0; i < cart.length; i++) {
                delete cart[i].image;
            }
            
            

            let result = await fetch(`${process.env.REACT_APP_API_URL}/addOrder`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({cart: cart, userId: user._id})
            })

            result = await result.json();
            console.log(result)

            setCart([]);
            localStorage.setItem('cart', JSON.stringify([]));

            //Navigate to user orders
            navigate('/orders')
            window.location.reload(true) 
        }
    }

    // Pricing

    const [total, setTotal] = useState(0.0);

    useEffect(() => {
        if (cart.length > 0) {
            const sum = cart.reduce((acc, item) => {
            if (item != null){
                if (item.title != null && item.title) {
                    const listingPrice = item.price;
                    if (!isNaN(listingPrice)) {
                        return acc + listingPrice;
                    }
                }
                else if (item.date != null) {
                    const startDate = new Date(item.date.startDate);
                    const endDate = new Date(item.date.endDate);
                    const bookedTime = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);    
                    const bookingPrice = item.userId.dailyRate
                    console.log(bookingPrice)

                    if (!isNaN(bookingPrice)) {
                        return acc + (bookingPrice * bookedTime);
                    }
                } 
            }
            return acc
          }, 0);
          console.log(sum);
          setTotal(sum);
        } else {
          setTotal(0.0);
        }
      }, [cart]);

    // Quantity

    // const incOne = (item) => {
    //     item.buyQuantity += 1;
    // }
    // const decOne = (item) => {
    //     item.buyQuantity = 1;
    // }

    return (
        <div className='shopping-cart'>
            <h2>Shopping Cart</h2>
            <Container>
                <Row>
                    <Col className='shopping-cart-items'>   
                        {
                            cart.map((item, index) => {
                                if (item && item != null ){
                                    if (item.date) {

                                        const startDate = new Date(item.date.startDate);
                                        const endDate = new Date(item.date.endDate);

                                        const bookedTime = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24) + 1);

                                        return (
                                            <>
                                            <Card key={index} className='cart-cards'>
                                                <strong>Service</strong>
                                                <p>{item.title || (item.userId.firstName + " " + item.userId.lastName)} - plantsitter</p>
                                                {bookedTime && (
                                                    <>
                                                        <strong>{"Booked for"}</strong>
                                                        <p>{bookedTime + " days"}</p>
                                                        <p>Rate: ${item.userId.dailyRate} per day</p>
                                                    </>

                                                )}
                                                <p className="booking-price">Total Price: ${item.userId.dailyRate * bookedTime}</p>
                                                <Button variant="warning" index={index} onClick={removeItem}>Remove</Button>          
                                            </Card>
                                            </>
                                        );
                                    }
                                    else {
                                        return (
                                            <Card className='cart-cards'>
                                                <strong>Product</strong>
                                                <Card.Img variant="side" src={item.image || "/PhotoSyntheSit_logo.PNG"} height={100} width={100}/>
                                                <p>{item.title}</p>                                             
                                                <p> {item.description}</p>
                                                <p>${item.price}</p>
                                                {/* <div>
                                                    <button onClick={decOne(item)}>-</button>
                                                    <input type="text" value={item.buyQuantity || 1} readonly/>
                                                    <button onClick={incOne(item)}>+</button>
                                                </div>                        */}
                                                <Button variant="danger" index={index} onClick={removeItem}>Remove</Button>
                                            </Card>
                                        )
                                    }
                                }
                            })
                        }
                        {/* <strong>Product</strong> */}
                    </Col>
                    <Col className='shopping-cart-sum' >
                        <div>
                            <p>Subtotal: ${total}</p>
                            <p>Tax: ${(total * 0.13).toFixed(2)}</p>
                            <p>Total: ${(total * 1.13).toFixed(2)}</p>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button variant='primary' onClick={placeOrder}>Purchase</Button>
                        <Button variant='danger' onClick={removeCart}>Clear cart</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default CartPage;