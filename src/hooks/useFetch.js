import { useEffect, useState } from "react";

export const useFetch = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Something went wrong");
        }
      })
      .then((jsonData) => {
        setData(jsonData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [url]);

  return data;
};
