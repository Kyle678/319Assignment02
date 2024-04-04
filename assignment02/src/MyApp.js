import React, {useState} from "react";
import {useForm} from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
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

    function Browse(){

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
                        <Card.Text className="card-text">${el.price.toFixed(2)}</Card.Text>
                        <div className="mt-auto">
                            <Button onClick={() => removeFromCart(el)} variant="light">-</Button>
                            <Button onClick={() => addToCart(el)} variant="light">+</Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        ));

        return(
            <div>
                <Container>
                    <Row>
                        {listItems}
                    </Row>
                </Container>
                <Button onClick={() => cartView()} variant="primary">View Cart</Button>
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
                            <p>Price: ${el.price} | Quantity: {el.quantity}</p>
                            <p>Total: ${el.price * el.quantity}</p>
                        </div>
                    </div>
                </Col>
            </Row>
        ));

        const totalCost = () => {
            let total = 0;
            for(let data of dataF) {
                total += data.price * data.quantity;
            }
            return total;
        }

        return(
            <div>
                <Button onClick={() => shopView()} varaint="primary">Back</Button>
                <div>
                    <Container>
                        <h2 style={{marginBottom:"40px"}}>Your Cart</h2>
                        {listCart}
                    </Container>
                </div>
                <Row className="justify-content-between">
                    <Col>
                        <h5 style={{ marginLeft:"120px", marginTop:"20px", marginBottom:"20px"}}>Total Cost: ${totalCost()}</h5>
                    </Col>
                    <Col xs="auto">
                        <Button style={{marginRight:"40px"}} onClick={() => checkoutView()} variant="primary">Proceed to Checkout</Button>
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
            <div>
                <Button onClick={() => cartView()} variant="primary">Back</Button>
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
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </div>
        );
    }

    return(
        <div>
            {viewer === 0 && <Browse />}
            {viewer === 1 && <Cart />}
            {viewer === 2 && <Checkout />}
        </div>
    );
}

export default App;