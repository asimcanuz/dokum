import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <article className="  flex flex-col justify-center items-center">
      <div className="flex flex-col gap-y-2">
        <h1>Oops!</h1>
        <p>Page Not Found</p>
        <div className="flexGrow">
          <Button
            appearance={"link"}
            block={true}
            onClick={() => navigate("/")}
          >
            Visit Our Homepage
          </Button>
        </div>
      </div>
    </article>
  );
};

export default NotFoundPage;
