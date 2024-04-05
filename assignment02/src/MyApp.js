import React, {useState, useEffect} from "react";
import {useForm} from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./shop.css";
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import items from "./products.json";

function App(){

    // state used for form input at checkout
    const {register, handleSubmit, formState: {errors}} = useForm();

    // state used for items in cart
    const [dataF,setDataF] = useState([]);

    // state used to figure out what page to display
    const [viewer,setViewer] = useState(0);

    // state to store the subtotal of the user's cart
    const [subTotal,setSubTotal] = useState(0);

    // state used to control opacity of arrow on the shop page
    const [isVisible, setIsVisible] = useState(1);

    // Tells page to listen to user scroll and dynamically changes
    // isVisible's value for the arrow to use in its style
    useEffect(() => {
      const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const scrollThreshold = 300;
        setIsVisible((scrollThreshold - scrollPosition)/100);
      };
      window.addEventListener('scroll', handleScroll);
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);

    // sets page view to the shop
    const shopView = () => {
        setViewer(0);
    }

    // sets page view to the cart
    const cartView = () => {
        setViewer(1);
    }

    // sets page view to the checkout
    const checkoutView = () => {
        setViewer(2);
    }

    // converts decimal into a string representing its monetary value
    const numToPrice = (num) => {
        return "$"+num.toFixed(2);
    }

    // returns the total cost of the items in the cart
    const totalCost = () => {
        let total = 0;
        for(let data of dataF) {
            total += data.price * data.quantity;
        }
        return total;
    }

    // returns quantity of items for fixed "View Cart" button
    // in the top right of the shop page
    const totalItemsInCart = () => {
        let total = 0;
        for(let item of dataF){
            total += item.quantity;
        }
        return total;
    }

    function Browse(){

        // style for fixed "View Cart" button
        const buttonStyle = {
            position: 'fixed',
            top: '20px', 
            right: '20px', 
            zIndex: "999"
        };

        // adds an item to the cart if it doesn't already exist
        // if it does exist, increment its quantity by one
        const addToCart = (el) => {
            let alreadyInCart = 0;
            const updatedDataF = dataF.map(data => {
                if(data.id === el.id){
                    alreadyInCart = 1;
                    return {...data, quantity: data.quantity+1}
                }else{
                    return data;
                }
            });

            if(alreadyInCart){
                setDataF(updatedDataF);
            }else{
                el.quantity = 1;
                setDataF([...updatedDataF, el])
            }
        }

        // removes item from list if its quantity is one
        // otherwise decrease quantity by one if it is in the cart
        const removeFromCart = (el) => {
            let hardCopy = [...dataF];
            hardCopy = hardCopy.filter((cartItem) => cartItem.id !== el.id || cartItem.quantity-- > 1);
            setDataF(hardCopy);
        }

        // returns quantity of specified item in the cart
        const quantityInCart = (el) => {
            for(let item of dataF){
                if(item.id === el.id){
                    return item.quantity;
                }
            }
            return 0;
        }

        // lists the elements from the json file
        const listItems = items.map((el) => (
            <Col key={el.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card style={{ width: "15rem", height: "100%", backgroundColor:"#505050", color:"#000000" }}>
                    <Card.Img className="card-img-top" src={el.image} alt="Card image cap" style={{ scale: "85%", minHeight: "250px", maxHeight:"250px", width: "auto", objectFit: "cover" }}/>            
                    <Card.Body className="d-flex flex-column card-content" style={{ height: "100%" }}>
                        <Card.Title className="card-title" style={{ height: "50%" }}>{el.title}</Card.Title>
                        <Card.Text className="card-text" style={{ height: "10%" }}>{el.category}</Card.Text>
                        <Card.Text className="card-text">{numToPrice(el.price)}</Card.Text>
                        <Card.Text className="card-text">In Cart: {quantityInCart(el)}</Card.Text>
                        <div className="mt-auto">
                            <button onClick={() => removeFromCart(el)} style={{minWidth:"40px", borderRadius:"20px"}} type="button" className="btn btn-secondary btn-circle btn-sm">-</button> 
                            <button onClick={() => addToCart(el)} style={{minWidth:"40px", borderRadius:"20px"}} type="button" className="btn btn-secondary btn-circle btn-sm">+</button> 
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));

        // trigger an alert if there are no items in cart
        // otherwise, continue to the cart page
        const cartOrAlert = () => {
            if(dataF.length === 0){
                alert("Must add items to cart first.");
            }else{
                // calculate total for order and set value
                setSubTotal(totalCost());
                cartView();
            }
        }

        // style for arrow
        // dynamically changing visibility based on how far
        // the user has scrolled down
        const arrowStyle = {
            opacity:isVisible,
            scale:"3"
        }

        return(
            <div style={{minHeight:"300vh"}}>
                <div style={{ display: "inline", marginRight:"20px"}}>
                    <Button style={buttonStyle} onClick={() => cartOrAlert()} variant="light">
                        <p style={{display:"inline", marginRight:"5px"}}>View Cart ({totalItemsInCart()})</p>
                        <i className="bi bi-cart"></i>
                    </Button>
                </div>
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height: "80vh"}}>
                    <h1>Drew and Kyle's Shop</h1>
                </div>
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height: "20vh"}}>
                    <i style={arrowStyle} className="bi bi-arrow-down"></i>
                </div>
                <Container>
                    <Row>
                        {listItems}
                    </Row>
                </Container>
            </div>
        );
    }

    function Cart(){

        // Lists elements in user cart
        const listCart = dataF.map((el) => (
            <Row key={el.id} className="mb-3">
                <Col xs={12}>
                    <div className="d-flex align-items-center">
                        <div>
                            <img src={el.image} alt={el.title} style={{ maxWidth: "100px", marginRight: "20px" }} />
                        </div>
                        <div className="ml-3" style={{maxWidth:"40vh"}}>
                            <h5>{el.title}</h5>
                            <p>Price: {numToPrice(el.price)} | Quantity: {el.quantity}</p>
                            <p>Total: {numToPrice(el.price * el.quantity)}</p>
                        </div>
                    </div>
                </Col>
            </Row>
        ));

        // style for order summary
        // creates an outlined box in the top right with a fixed position
        const summaryBox = {
            position:"fixed",
            top: "100px",
            right: "20px",
            zIndex: "999",
            whiteSpace: "pre",
            paddingLeft: "5px",
            paddingBottom: "5px",
            border: "2px solid gray"
        }

        return(
            <div>
                <div style={summaryBox}>
                    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <h3>Summary</h3>
                    </div>
                    <h5>Subtotal:    {numToPrice(subTotal)}</h5>
                    <h5>Tax Rate:      7.5%</h5>
                    <h5>Tax:            {numToPrice(subTotal * 0.075)}</h5>
                    <h5>Total Cost: {numToPrice(subTotal * 1.075)}</h5>
                    <div style={{ display: "inline", marginRight:"20px"}}>
                        <Button onClick={() => checkoutView()} variant="light">
                            <p style={{display:"inline", marginRight:"5px"}}>Proceed to Checkout</p>
                            <i className="bi bi-arrow-right-circle"></i>
                        </Button>
                    </div>
                </div>
                <div style={{ display: "inline", marginLeft:"20px" }}>
                    <Button onClick={() => shopView()} variant="light">
                        <i className="bi bi-arrow-bar-left"></i>
                        <p style={{ display:"inline" }}>Back</p>
                    </Button>
                </div>
                <div style={{marginTop:"10px"}}>
                    <Container>
                        <h2 style={{marginBottom:"40px"}}>Your Cart</h2>
                        {listCart}
                    </Container>
                </div>
            </div>
        );
    }

    function Checkout(){

        const onSubmit = data => {
            console.log("Data submitted: ");
            console.log(data);

            setDataF(data);
        }

        return(
            <div>
                <div style={{ display: "inline", marginLeft:"20px" }}>
                    <Button onClick={() => cartView()} variant="light">
                        <i className="bi bi-arrow-bar-left"></i>
                        <p style={{ display:"inline" }}>Back</p>
                    </Button>
                </div>
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className="container mt-5">
                        <div className="form-group">
                            <input {...register("fullName", { required: true })} placeholder="Full Name" className="form-control" />
                            {errors.fullName && <p className="text-danger">Full Name is required.</p>}
                        </div>
                        <div className="form-group">
                          <input {...register("email", { required: true, pattern: /^\S+@\S+$/i })} placeholder="Email" className="form-control" />
                            {errors.email && <p className="text-danger">Email is required.</p>}
                        </div>
                        <div className="form-group">
                            <input {...register("creditCard", { required: true })} placeholder="Credit Card" className="form-control" />
                            {errors.creditCard && <p className="text-danger">Credit Card is required.</p>}
                        </div>
                        <div className="form-group">
                            <input {...register("address", { required: true })} placeholder="Address" className="form-control" />
                            {errors.address && <p className="text-danger">Address is required.</p>}
                        </div>
                            <div className="form-group">
                            <input {...register("address2")} placeholder="Address 2" className="form-control" />
                        </div>
                        <div className="form-group">
                            <input {...register("city", { required: true })} placeholder="City" className="form-control" />
                            {errors.city && <p className="text-danger">City is required.</p>}
                        </div>
                        <div className="form-group">
                            <input {...register("state", { required: true })} placeholder="State" className="form-control" />
                            {errors.state && <p className="text-danger">State is required.</p>}
                        </div>
                        <div className="form-group">
                            <input {...register("zip", { required: true })} placeholder="Zip" className="form-control" />
                            {errors.zip && <p className="text-danger">Zip is required.</p>}
                        </div>
                        <div>
                            <p>
                                Subtotal: {numToPrice(subTotal)}
                            </p>
                            <p>
                                Tax Rate: 7.5%
                            </p>
                            <p>
                                Tax: {numToPrice(subTotal * 0.075)}
                            </p>
                            <p>
                                Total Cost: {numToPrice(subTotal * 1.075)}
                            </p>
                        </div>
                        <div className="form-group" style={{marginTop:"10px"}}>
                            <button style={{width:"100%"}} type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    // overall style for entire page
    const pageStyle={
        backgroundColor: "#d0d0d0",
        minHeight: "120vh",
        paddingTop: "20px"
    }

    return(
        <div style={pageStyle}>
            {viewer === 0 && <Browse />}
            {viewer === 1 && <Cart />}
            {viewer === 2 && <Checkout />}
        </div>
    );
}

export default App;