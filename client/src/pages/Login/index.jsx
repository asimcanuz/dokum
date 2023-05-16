import { useFormik } from "formik";

import Button from "../../components/Button";
import CustomLink from "../../components/CustomLink";
import Input from "../../components/Input";
import CheckBox from "../../components/Input/CheckBox";
import useAuth from "../../hooks/useAuth";

import axios from "../../api/axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Endpoints } from "../../constants/Endpoints";
import PasswordInput from "../../components/Input/PasswordInput";

const initalLoginError = {
  show: false,
  message: "",
  type: "",
};

const LoginPage = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const [loginError, setLoginError] = useState(initalLoginError);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async (values) => {
      const loginValues = JSON.stringify(values, null, 2);

      try {
        const response = await axios.post(Endpoints.LOGIN_URL, loginValues, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        const { username, accessToken, email, role, id } = response?.data;
        setAuth({ username, email, role, accessToken, id });
        sessionStorage.setItem(
          "auth",
          JSON.stringify({ username, email, role, accessToken, id })
        );
        navigate(from, { replace: true });
      } catch (error) {
        const { type, message } = error.response.data;
        setLoginError({
          show: true,
          message,
          type,
        });
      }
    },
  });
  useEffect(() => {
    if (loginError.show) {
      const loginErrorTimeout = setTimeout(() => {
        setLoginError(initalLoginError);
      }, 10000);
      return () => clearTimeout(loginErrorTimeout);
    }
  }, [loginError]);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section className="antialiased h-screen bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 flex items-center justify-center ">
      <div className="container px-6 py-12 h-full max-w-screen-xl">
        <div className="flex justify-center items-center flex-wrap h-full g-6 text-gray-800">
          <div className="md:w-8/12 lg:w-6/12 mb-12 md:mb-0">
            <img
              alt="LoginImage"
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="w-full"
            />
          </div>
          <div className="md:w-8/12 lg:w-5/12 lg:ml-20">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit(e);
              }}
            >
              <div className="mb-6">
                <label htmlFor="username" className="dark:text-slate-200">
                  Kullanıcı Adı
                </label>
                <Input
                  id={"username"}
                  name={"username"}
                  type={"text"}
                  placeholder={"Kullanıcı Adı"}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  required
                />
                {loginError.type === "username" && loginError.show ? (
                  <div className="text-red-500 text-sm">
                    {loginError.message}
                  </div>
                ) : null}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="dark:text-slate-200">
                  Şifre
                </label>
                <PasswordInput
                  id={"password"}
                  name={"password"}
                  placeholder={"Şifre"}
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  required
                />
                {loginError.type === "password" && loginError.show ? (
                  <div className="text-red-500 text-sm">
                    {loginError.message}
                  </div>
                ) : null}
              </div>

              <div className="flex justify-between items-center mb-6">
                <div className="form-group form-check">
                  <CheckBox
                    id={"rememberMe"}
                    name={"rememberMe"}
                    label={"Remember Me"}
                    onChange={togglePersist}
                    checked={persist}
                    // checked
                  />
                </div>
                <CustomLink to={"#"}>Forgot Password?</CustomLink>
              </div>

              <Button type="submit" appearance={"primary-block"}>
                Sign in
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
