import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="card" style={{ textAlign: "center", margin: "2rem auto", maxWidth: "400px" }}>
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn-primary">Go Home</Link>
    </div>
  );
};

export default NotFound;


