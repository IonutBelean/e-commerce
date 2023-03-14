import Layout from "../components/Layout";
import { Card, Button, Row, Col } from "react-bootstrap";
import { getGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { getMGamesList } from "../api/adaptors";
import ProducsCSS from "./Products.module.css";

const Products = () => {
  const gamesList = getGamesEndpoint();

  const data = useFetch(gamesList);

  const adaptedGamesList = getMGamesList(data);

  console.log(adaptedGamesList);

  return (
    <Layout>
      <div className={ProducsCSS.main}>
        <Row>
          {adaptedGamesList.map((product) => {
            return (
              <Col lg={3} md={4} className="mb-4" key={product.id}>
                <Card className={ProducsCSS.card}>
                  <Card.Img variant="top" src={product.image} />
                  <Card.Body>
                    <Card.Title className={ProducsCSS.title}>
                      {product.title}{" "}
                    </Card.Title>
                    <Card.Text>{product.rating} $</Card.Text>
                    <Button className={ProducsCSS.button}>Add to chart</Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    </Layout>
  );
};

export default Products;
