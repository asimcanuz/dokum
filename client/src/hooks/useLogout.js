import axios, { axiosPrivate } from "../api/axios";
import { Endpoints } from "../constants/Endpoints";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axiosPrivate.post(Endpoints.LOGOUT_URL, {
        withCredentials: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return logout;
};

export default useLogout;
