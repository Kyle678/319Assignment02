import React, {useState} from "react";
import {useForm} from "react-hook-form";
import "bootstrap/dist/css/bootstrap.css";
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import items from "./products.json";

function App(){

    const {register, handleSubmit, formState: {errors}} = useForm();
    const [dataF,setDataF] = useState({});
    const [viewer,setViewer] = useState(0);

    function Browse(){

        const listItems = items.map((el) => (
            <Col key={el.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card style={{ width: "15rem", height: "100%" }}>
                    <Card.Img className="card-img-top" src={el.image} alt="Card image cap" style={{ height: "200px", objectFit: "cover" }}/>
                    <Card.Body >
                        <Card.Title className="card-title">{el.title}</Card.Title>
                        <Card.Text className="card-text">{el.category}</Card.Text>
                        <Card.Text className="card-text">{el.price}</Card.Text>
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
            </div>
        );
    }

    function Cart(){

        return(
            <div>

            </div>
        );
    }

    function Checkout(){

        return(
            <div>
                
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