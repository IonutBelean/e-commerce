import { getSearchGamesEndpoint } from "../api/endpoints";
import { useFetch } from "../hooks/useFetch";
import { getGamesList } from "../api/adaptors";
import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const queryParams = new URLSearchParams(useLocation().search);

  let search = queryParams.get("search");

  if (!search) {
    search = "";
  }

  const searchGames = getSearchGamesEndpoint(search);

  const data = useFetch(searchGames);

  const adaptedGamesList = getGamesList(data);

  // console.log(adaptedGamesList);

  const handleSearch = () => {
    console.log(
      adaptedGamesList.filter((game) =>
        game.title.toLowerCase().includes(query)
      )
    );
  };
  return (
    <Form className="d-flex">
      <Form.Control
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="outline-success" onClick={handleSearch}>
        Search
      </Button>
    </Form>
  );
};

export default SearchBar;
