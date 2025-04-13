import { Container, Row, Col } from "react-bootstrap";
import ProductCard from "./ProductCard";
import React from "react";

const ProductCardList = (props) => {
  const { data } = props;

  return (
    <Container>
      <Row>
        {data.map((product) => (
          <Col lg={3} md={4} className="mb-4" key={product.id}>
            <ProductCard
              id={product.id}
              image={product.image}
              title={product.title}
              rating={product.rating}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProductCardList;
