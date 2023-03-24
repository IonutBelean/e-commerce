const SearchBarResults = (results) => {
  return (
    <div>
      <h1>{results.title}</h1>
      {/* {results.map((result, id) => {
        return <div>{result.title}</div>;
      })} */}
    </div>
  );
};

export default SearchBarResults;
