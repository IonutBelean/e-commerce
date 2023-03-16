import { Pagination as BootstrapPagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PaginationCSS from "./Pagination.module.css";

const Pagination = (props) => {
  const { currentPage, baseUrl } = props;

  let navigate = useNavigate();

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="d-flex justify-content-center">
      <BootstrapPagination>
        {pages.map((page) => (
          <BootstrapPagination.Item
            id={
              page === Number(currentPage)
                ? PaginationCSS.paginationActive
                : PaginationCSS.paginationInactive
            }
            key={page}
            active={page === Number(currentPage)}
            onClick={() => {
              navigate(`${baseUrl}?page=${page}`);
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            {page}
          </BootstrapPagination.Item>
        ))}
      </BootstrapPagination>
    </div>
  );
};

export default Pagination;
