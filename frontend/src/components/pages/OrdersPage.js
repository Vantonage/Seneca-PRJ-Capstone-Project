import './OrdersPage.css'
import { useEffect, useState } from "react";
import { Link, useNavigate, useResolvedPath  } from "react-router-dom";

const OrdersPage = () => {

    const [orders, setOrders] = useState([])
    const [user, setUser] = useState({})

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
            setOrders(data.orders)
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    }, []); // empty dependency array means this effect runs once on mount

    

    return (
        <>
            <h1>My Orders</h1> 
            <div className='orders-list'>           
                {
                    user?.orders?.map((arr, index) => {
                        let sum = 0;
                        return (
                            <div className='order'>
                            <h4>Order {index + 1}</h4>
                            {                              
                                arr.map((item, index) => {
                                    if (item.title){
                                        sum += item.price
                                        return(
                                        <div>
                                            <p>{item.title} | ${item.price}</p>
                                        </div>
                                        )
                                    }
                                    else if (item.date) {
                                        const startDate = new Date(item.date.startDate);
                                        const endDate = new Date(item.date.endDate);
                                        const bookedTime = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
                                        const bookingCost = (item.userId.dailyRate * bookedTime) 
                                        sum += bookingCost      
                                        return(
                                        <div>
                                            <p>Plantsitter Service</p>
                                            <p>Period: {bookedTime} days | ${bookingCost}</p>
                                        </div>
                                        )
                                    }
                                })
                            }
                            <hr/>
                            <p>Total: ${(sum * 1.13).toFixed(2)}</p>
                            </div>
                        )
                    })
                }
            </div>
            {!user ? <p>Please log in to view orders!</p>: ""}
        </>
    )
}

export default OrdersPage;