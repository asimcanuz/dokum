import { useEffect, useRef, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
const POSTS_URL = "/api/posts";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const axiosPrivate = useAxiosPrivate();

  const navigate = useNavigate();
  const location = useLocation();

  const effectRun = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getPosts = async () => {
      try {
        const response = await axiosPrivate.get(POSTS_URL, {
          signal: controller.signal,
        });
        console.log(response);
        isMounted && setPosts(response.data.posts);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    if (effectRun.current) {
      getPosts();
    }

    return () => {
      isMounted = false;
      isMounted && controller.abort();
      effectRun.current = true;
    };
  }, []);

  return (
    <article>
      <h2>Posts</h2>
      {posts?.length ? (
        <ul>
          {posts.map((post) => (
            <li key={post.id}>{post.title}</li>
          ))}
        </ul>
      ) : (
        <p>NO Data</p>
      )}
      d
    </article>
  );
};
export default Posts;
