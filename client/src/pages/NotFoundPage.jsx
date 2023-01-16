import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <article className="h-screen bg-white dark:bg-black flex justify-center items-center">
      <h1>Oops!</h1>
      <p>Page Not Found</p>
      <div className="flexGrow">
        <Link to="/">Visit Our Homepage</Link>
      </div>
    </article>
  );
};

export default NotFoundPage;
