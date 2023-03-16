import { Row, Col, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { getGamesDetailsEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";

const GamesDetails = () => {
  const { gameId } = useParams();

  const gamesDetails = getGamesDetailsEndpoint(gameId);

  const data = useFetch(gamesDetails);

  console.log(data);

  const {
    name,
    description,
    released,
    playtime,
    background_image_additional,
    website,
  } = data || {};

  return (
    <Layout>
      <Container>
        <Row>
          <Col xs={12} lg={8}>
            <h1>{name}</h1>
            <h6>{released}</h6>
            <img src={background_image_additional} alt="game" />
            <p>{description}</p>
            <h5>Hours to play: {playtime}</h5>
            <h5>
              Official website:{" "}
              <a href={website} target="_blank">
                {website}
              </a>
            </h5>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default GamesDetails;
