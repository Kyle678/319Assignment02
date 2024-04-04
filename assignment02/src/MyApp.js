import React, {useState} from "react";
import {useForm} from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./shop.css";
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import items from "./products.json";

function App(){

    const {register, handleSubmit, formState: {errors}} = useForm();
    const [dataF,setDataF] = useState([]);
    const [viewer,setViewer] = useState(0);

    const shopView = () => {
        setViewer(0);
    }

    const cartView = () => {
        setViewer(1);
    }

    const checkoutView = () => {
        setViewer(2);
    }

    const numToPrice = (num) => {
        return "$"+num.toFixed(2);
    }

    const totalCost = () => {
        let total = 0;
        for(let data of dataF) {
            total += data.price * data.quantity;
        }
        return total;
    }

    function Browse(){

        const buttonStyle = {
            position: 'fixed',
            top: '20px', 
            right: '20px', 
            zIndex: "999"
        };

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

        const removeFromCart = (el) => {
            let hardCopy = [...dataF];
            hardCopy = hardCopy.filter((cartItem) => cartItem.id !== el.id || cartItem.quantity-- > 1);
            setDataF(hardCopy);
        }

        const listItems = items.map((el) => (
            <Col key={el.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card style={{ width: "15rem", height: "100%" }}>
                    <Card.Img className="card-img-top" src={el.image} alt="Card image cap" style={{ scale: "85%", minHeight: "250px", maxHeight:"250px", width: "auto", objectFit: "cover" }}/>            
                    <Card.Body className="d-flex flex-column card-content" style={{ height: "100%" }}>
                        <Card.Title className="card-title" style={{ height: "50%" }}>{el.title}</Card.Title>
                        <Card.Text className="card-text" style={{ height: "10%" }}>{el.category}</Card.Text>
                        <Card.Text className="card-text">{numToPrice(el.price)}</Card.Text>
                        <div className="mt-auto">
                            <Button onClick={() => removeFromCart(el)} variant="light">-</Button>
                            <Button onClick={() => addToCart(el)} variant="light">+</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));

        const cartOrAlert = () => {
            if(dataF.length === 0){
                alert("Must add items to cart first.");
            }else{
                cartView();
            }
        }

        return(
            <div>
                <Button variant="light" style={buttonStyle}>View Cart</Button>
                <div style={{ display: "inline", marginRight:"20px"}}>
                    <Button style={buttonStyle} onClick={() => cartOrAlert()} variant="light">
                        <p style={{display:"inline", marginRight:"5px"}}>View Cart</p>
                        <i class="bi bi-cart"></i>
                    </Button>
                </div>
                <div style={{ display:"flex", justifyContent:"center", alignItems:"center", height: "100vh"}}>
                    <h1>Drew and Kyle's Shop</h1>
                </div>
                <Container>
                    <Row>
                        {listItems}
                    </Row>
                </Container>
                <Row className="justify-content-between">
                    <Col style={{marginBottom:"50px"}}></Col>
                    <Col xs="auto">
                        <div style={{ display: "inline", marginRight:"20px"}}>
                            <Button style={{marginRight:"40px"}} onClick={() => cartOrAlert()} variant="primary">
                                <p style={{display:"inline", marginRight:"5px"}}>View Cart</p>
                                <i class="bi bi-arrow-right-circle"></i>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    function Cart(){

        const listCart = dataF.map((el) => (
            <Row key={el.id} className="mb-3">
                <Col xs={12}>
                    <div className="d-flex align-items-center">
                        <div>
                            <img src={el.image} alt={el.title} style={{ maxWidth: "100px", marginRight: "20px" }} />
                        </div>
                        <div className="ml-3">
                            <h5>{el.title}</h5>
                            <p>Price: {numToPrice(el.price)} | Quantity: {el.quantity}</p>
                            <p>Total: {numToPrice(el.price * el.quantity)}</p>
                        </div>
                    </div>
                </Col>
            </Row>
        ));

        return(
            <div>
                <div style={{ display: "inline", marginLeft:"20px" }}>
                    <Button onClick={() => shopView()} variant="light">
                        <i class="bi bi-arrow-bar-left"></i>
                        <p style={{ display:"inline" }}>Back</p>
                    </Button>
                </div>
                <div style={{marginTop:"10px"}}>
                    <Container>
                        <h2 style={{marginBottom:"40px"}}>Your Cart</h2>
                        {listCart}
                    </Container>
                </div>
                <Row className="justify-content-between">
                    <Col>
                        <h5 style={{ marginLeft:"120px", marginTop:"20px", marginBottom:"20px"}}>Total Cost: {numToPrice(totalCost())}</h5>
                    </Col>
                    <Col xs="auto">
                        <div style={{ display: "inline", marginRight:"20px"}}>
                            <Button style={{marginRight:"40px"}} onClick={() => checkoutView()} variant="light">
                                <p style={{display:"inline", marginRight:"5px"}}>Proceed to Checkout</p>
                                <i class="bi bi-arrow-right-circle"></i>
                            </Button>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

    function Checkout(){

        const onSubmit = data => {
            console.log("Data submitting");
        }

        return(
            <div style={{marginTop:"20px"}}>
                <div style={{ display: "inline", marginLeft:"20px" }}>
                    <Button onClick={() => cartView()} variant="light">
                        <i class="bi bi-arrow-bar-left"></i>
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
                                Subtotal: {numToPrice(totalCost())}
                            </p>
                            <p>
                                Tax Rate: 7.5%
                            </p>
                            <p>
                                Tax: {numToPrice(totalCost() * 0.075)}
                            </p>
                            <p>
                                Total Cost: {numToPrice(totalCost() * 1.075)}
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