import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./shop.css";
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import items from "./products.json";

function App() {

    // state used for form input at checkout
    const { register, handleSubmit, formState: { errors } } = useForm();

    // state used to store form
    const [dataF, setDataF] = useState({});

    // state used for items in cart
    const [cart, setCart] = useState([]);

    // state used to figure out what page to display
    const [viewer, setViewer] = useState(0);

    // state to store the subtotal of the user's cart
    const [subTotal, setSubTotal] = useState(0);

    // state used to control opacity of arrow on the shop page
    const [isVisible, setIsVisible] = useState(1);

    // state used for search bar
    const [query, setQuery] = useState('');

    // state used for filtered items
    const [ProductsCategory, setProductsCategory] = useState(items);

    // Tells page to listen to user scroll and dynamically changes
    // isVisible's value for the arrow to use in its style
    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const scrollThreshold = 300;
            setIsVisible((scrollThreshold - scrollPosition) / 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleChange = (e) => {
        setQuery(e.target.value);
        const results = items.filter(eachProduct => {
            if(e.target.value === "") return ProductsCategory;
            return eachProduct.title.toLowerCase().includes(e.target.value.toLowerCase())
        });
        setProductsCategory(results);
    }

    // sets page view to the shop
    const shopView = () => {
        setQuery("");
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

    const confirmationView = () => {
        setViewer(3);
    }

    // converts decimal into a string representing its monetary value
    const numToPrice = (num) => {
        return "$" + num.toFixed(2);
    }

    // returns the total cost of the items in the cart
    const totalCost = () => {
        let total = 0;
        for (let data of cart) {
            total += data.price * data.quantity;
        }
        return total;
    }

    // returns quantity of items for fixed "View Cart" button
    // in the top right of the shop page
    const totalItemsInCart = () => {
        let total = 0;
        for (let item of cart) {
            total += item.quantity;
        }
        return total;
    }

    function Browse() {

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
            const updatedcart = cart.map(data => {
                if (data.id === el.id) {
                    alreadyInCart = 1;
                    return { ...data, quantity: data.quantity + 1 }
                } else {
                    return data;
                }
            });

            if (alreadyInCart) {
                setCart(updatedcart);
            } else {
                el.quantity = 1;
                setCart([...updatedcart, el])
            }
        }

        // removes item from list if its quantity is one
        // otherwise decrease quantity by one if it is in the cart
        const removeFromCart = (el) => {
            let hardCopy = [...cart];
            hardCopy = hardCopy.filter((cartItem) => cartItem.id !== el.id || cartItem.quantity-- > 1);
            setCart(hardCopy);
        }

        // returns quantity of specified item in the cart
        const quantityInCart = (el) => {
            for (let item of cart) {
                if (item.id === el.id) {
                    return item.quantity;
                }
            }
            return 0;
        }

        // lists the elements from the json file
        const listItems = ProductsCategory.map((el) => (
            <Col key={el.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card style={{ width: "15rem", height: "100%", backgroundColor: "#505050", color: "#000000" }}>
                    <Card.Img className="card-img-top" src={el.image} alt="Card image cap" style={{ scale: "85%", minHeight: "250px", maxHeight: "250px", width: "auto", objectFit: "cover" }} />
                    <Card.Body className="d-flex flex-column card-content" style={{ height: "100%" }}>
                        <Card.Title className="card-title" style={{ height: "50%" }}>{el.title}</Card.Title>
                        <Card.Text className="card-text" style={{ height: "10%" }}>{el.category}</Card.Text>
                        <Card.Text className="card-text">{numToPrice(el.price)}</Card.Text>
                        <Card.Text className="card-text">In Cart: {quantityInCart(el)}</Card.Text>
                        <div className="mt-auto">
                            <button onClick={() => removeFromCart(el)} style={{ minWidth: "40px", borderRadius: "20px" }} type="button" className="btn btn-secondary btn-circle btn-sm">-</button>
                            <button onClick={() => addToCart(el)} style={{ minWidth: "40px", borderRadius: "20px" }} type="button" className="btn btn-secondary btn-circle btn-sm">+</button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));

        // trigger an alert if there are no items in cart
        // otherwise, continue to the cart page
        const cartOrAlert = () => {
            if (cart.length === 0) {
                alert("Must add items to cart first.");
            } else {
                // calculate total for order and set value
                setSubTotal(totalCost());
                cartView();
            }
        }

        // style for arrow
        // dynamically changing visibility based on how far
        // the user has scrolled down
        const arrowStyle = {
            opacity: isVisible,
            scale: "3"
        }

        return (
            <div style={{ minHeight: "300vh" }}>
                <div style={{ display: "inline", marginRight: "20px" }}>
                    <Button style={buttonStyle} onClick={() => cartOrAlert()} variant="light">
                        <p style={{ display: "inline", marginRight: "5px" }}>View Cart ({totalItemsInCart()})</p>
                        <i className="bi bi-cart"></i>
                    </Button>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                    <h1>Drew and Kyle's Shop</h1>
                </div>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "20vh" }}>
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

    function Cart() {

        // Lists elements in user cart
        const listCart = cart.map((el) => (
            <Row key={el.id} className="mb-3">
                <Col xs={12}>
                    <div className="d-flex align-items-center">
                        <div>
                            <img src={el.image} alt={el.title} style={{ maxWidth: "100px", marginRight: "20px" }} />
                        </div>
                        <div className="ml-3" style={{ maxWidth: "40vh" }}>
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
            position: "fixed",
            top: "100px",
            right: "20px",
            zIndex: "999",
            whiteSpace: "pre",
            paddingLeft: "5px",
            paddingBottom: "5px",
            border: "2px solid gray"
        }

        return (
            <div>
                <div style={summaryBox}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <h3>Summary</h3>
                    </div>
                    <h5>Subtotal:    {numToPrice(subTotal)}</h5>
                    <h5>Tax Rate:      7.5%</h5>
                    <h5>Tax:            {numToPrice(subTotal * 0.075)}</h5>
                    <h5>Total Cost: {numToPrice(subTotal * 1.075)}</h5>
                    <div style={{ display: "inline", marginRight: "20px" }}>
                        <Button onClick={() => checkoutView()} variant="primary">
                            <p style={{ display: "inline", marginRight: "5px" }}>Proceed to Checkout</p>
                            <i className="bi bi-arrow-right-circle"></i>
                        </Button>
                    </div>
                </div>
                <div style={{ display: "inline", marginLeft: "20px" }}>
                    <Button onClick={() => shopView()} variant="light">
                        <i className="bi bi-arrow-bar-left"></i>
                        <p style={{ display: "inline" }}>Back</p>
                    </Button>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <Container>
                        <h2 style={{ marginBottom: "40px" }}>Your Cart</h2>
                        {listCart}
                    </Container>
                </div>
            </div>
        );
    }

    function Checkout() {

        const onSubmit = data => {
            try {
                console.log("Data submitted: ");
                console.log(data);

                setDataF(data);
                setViewer(3);
            } catch (e) {
                console.log("Data submitted: ");
                console.log(data);

                setDataF(data);
            }
        }

        return (
            <div>
                <div style={{ display: "inline", marginLeft: "20px" }}>
                    <Button onClick={() => cartView()} variant="light">
                        <i className="bi bi-arrow-bar-left"></i>
                        <p style={{ display: "inline" }}>Back</p>
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
                            <input {...register("creditCard", { required: true, minLength: 16, maxLength: 16 })} placeholder="Credit Card (XXXXXXXXXXXXXXXX)" className="form-control" />
                            {errors.creditCard && errors.creditCard.type === "required" && <p className="text-danger">Credit Card is required.</p>}
                            {errors.creditCard && (errors.creditCard.type === "minLength" || errors.creditCard.type === "maxLength") && <p className="text-danger">Credit Card number must be 16 numbers long.</p>}
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
                            <input {...register("zip", { required: true, minLength: 5, maxLength: 5 })} placeholder="Zip (XXXXX)" className="form-control" />
                            {errors.zip && errors.zip.type ==="required" && <p className="text-danger">Zip is required.</p>}
                            {errors.zip && (errors.zip.type === "minLength" || errors.zip.type === "maxLength") && <p className="text-danger">Zip code must be 5 digits.</p>}
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
                        <div className="form-group" style={{ marginTop: "10px" }}>
                            <button onClick={handleSubmit} style={{ width: "100%" }} type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    function Confirmation() {
        const updateHooks = () => {
            setViewer(0);
            setDataF({});
            setCart([]);
        }

        const showCart = cart.map((el) => (
            <Row key={el.id} className="mb-3">
                <Col xs={12}>
                    <div className="d-flex align-items-center">
                        <div>
                            <img src={el.image} alt={el.title} style={{ maxWidth: "100px", marginRight: "20px" }} />
                        </div>
                        <div className="ml-3" style={{ maxWidth: "40vh" }}>
                            <h5>{el.title}</h5>
                            <p>Quantity: {el.quantity}</p>
                        </div>
                    </div>
                </Col>
            </Row>
        ));

        return (<div>
            <h1>Payment summary:</h1>
            <h3>{dataF.fullName}</h3>
            <p>{dataF.email}</p>
            <p>{dataF.creditCard}</p>
            <p>{dataF.address}</p>
            <p>{dataF.city}, {dataF.state} {dataF.zip}</p>

            <br />
            <h1>Order summary:</h1>
            {showCart}
            <p>SubTotal: {numToPrice(subTotal)}</p>
            <p>Tax: {numToPrice(subTotal * 0.075)}</p>
            <p>Total: {numToPrice(subTotal * 1.075)}</p>
            <button onClick={updateHooks} className="btn btn-secondary">Submit</button>
        </div>)
    }

    // overall style for entire page
    const pageStyle = {
        backgroundColor: "#d0d0d0",
        minHeight: "100vh",
        paddingTop: "20px"
    }

    return (
        <div style={pageStyle}>
            {viewer === 0 && <div style={{marginLeft:"10px", position:"fixed", zIndex:"999"}} className="py-10">
                <input type="search" value={query} onChange={handleChange} placeholder="Search..."/>
            </div>}
            {viewer === 0 && <Browse />}
            {viewer === 1 && <Cart />}
            {viewer === 2 && <Checkout />}
            {viewer === 3 && <Confirmation />}
        </div>
    );
}

export default App;