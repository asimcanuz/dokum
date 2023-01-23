import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Button from "../../components/Button";
import { Endpoints } from "../../constants/Endpoints";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PasswordInput from "../../components/Input/PasswordInput";

const FormSchema = Yup.object().shape({
  password: Yup.string(),
  confirmPassword: Yup.string().oneOf(
    [Yup.ref("password"), null],
    'Must match "password" field value'
  ),
});

function AccountPasswordUpdateModal({ open, toggle, size, userId }) {
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: FormSchema,
    onSubmit: async (values) => {
      const newPass = {
        userId,
        password: values.password,
      };
      try {
        const response = await axiosPrivate.post(
          Endpoints.USER_PASSWORD_UPDATE_URL,
          newPass,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <Modal open={open} size={size}>
      {/*header*/}
      <ModalHeader title={"Şifre Güncelle"} toogle={toggle} />
      {/*body*/}
      <ModalBody>
        <div className="flex flex-col">
          <form>
            <div className="flex flex-col">
              <div className="mb-6">
                <label htmlFor="password">Şifre</label>

                <PasswordInput
                  id={"password"}
                  name={"password"}
                  placeholder={"Şifre"}
                  {...formik.getFieldProps("password")}
                  required
                />
                {formik.errors.password && (
                  <label className="text-red-600">
                    *{formik.errors.password}
                  </label>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="mb-6">
                <label htmlFor="password">Şifre Onayla</label>
                <PasswordInput
                  id={"confirmPassword"}
                  name={"confirmPassword"}
                  placeholder={"Şifre Onayla"}
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.errors.confirmPassword &&
                formik.touched.confirmPassword ? (
                  <label className="text-red-600">
                    *{formik.errors.confirmPassword}
                  </label>
                ) : null}
              </div>
            </div>
          </form>
        </div>
      </ModalBody>
      {/*footer*/}
      <ModalFooter>
        <Button appearance={"danger"} onClick={toggle}>
          İptal
        </Button>

        <Button
          type="submit"
          appearance={"success"}
          disabled={formik.values.password.length === 0 || !formik.isValid}
          onClick={async () => {
            await formik.handleSubmit();

            await toggle();
          }}
        >
          Kaydet
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AccountPasswordUpdateModal;
