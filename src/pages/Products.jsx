import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("https://www.cheapshark.com/api/1.0/deals?pageSize=10")
      .then((response) => response.json())
      .then((products) => {
        setProducts(products);
      });
  }, []);

  console.log(products);

  return (
    <Layout>
      <Row>
        {products.map((product) => {
          return (
            <Col lg={3} md={4} className="mb-4" key={product.dealID}>
              <Card>
                <Card.Img variant="top" src={product.thumb} />
                <Card.Body>
                  <Card.Title>{product.title} </Card.Title>
                  <Card.Text>{product.salePrice} $</Card.Text>
                  <Button variant="primary">Add to chart</Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
};

export default Products;
