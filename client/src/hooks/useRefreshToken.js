import axios from "../api/axios";
import useAuth from "./useAuth";

function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/api/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        role: response.data.role,
        accessToken: response.data.accessToken,
        id: response.data.id,
      };
    });

    return response.data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;
