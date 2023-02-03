import React, { Fragment } from "react";
import { useFormik } from "formik";

import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Button from "../../components/Button";
import Input from "../../components/Input";
import CheckBox from "../../components/Input/CheckBox";
import Select from "react-select";
import { ROLES } from "../../constants/RolesConstants";
import { Endpoints } from "../../constants/Endpoints";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import PasswordInput from "../../components/Input/PasswordInput";

// const FormSchema = Yup.object().shape({
//   password: Yup.string(),
//   confirmPassword: Yup.string().oneOf(
//     [Yup.ref("password"), null],
//     'Must match "password" field value'
//   ),
// });

function AccountCreateAndUpdateModal({
  open,
  toggle,
  type,
  size,
  defaultValues,
  users,
  setUsers,
}) {
  const axiosPrivate = useAxiosPrivate();
  const formik = useFormik({
    initialValues: {
      email: defaultValues.email,
      roleId: defaultValues.roleId,
      username: defaultValues.username,
      isActive: defaultValues.isActive,
      password: "",
      confirmPassword: "",
    },
    // validationSchema: FormSchema,
    onSubmit: async (values) => {
      var user = {
        email: values.email,
        isActive: values.isActive,
        username: values.username,
        roleId: values.roleId,
        userId: defaultValues.userId,
      };
      if (type === "add") {
        user = {
          email: values.email,
          isActive: values.isActive,
          username: values.username,
          roleId: values.roleId,
          password: values.password,
        };
      }
      var endpoint =
        type === "add" ? Endpoints.USER_ADD_NEW_URL : Endpoints.USER_UPDATE_URL;

      try {
        const response = await axiosPrivate.post(endpoint, user, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (response.status === 200) {
          if (type === "add") {
            const { email, roleId, userId, username, password } =
              response.data.user;
            const newUser = {
              email,
              roleId,
              userId,
              username,
              isActive: true,
              password,
            };
            setUsers([...users, newUser]);
          } else {
            const newUserList = [...users];
            var _user = newUserList.find(
              (__user) => __user.userId === user.userId
            );
            _user.email = user.email;
            _user.isActive = user.isActive;
            _user.username = user.username;
            _user.roleId = user.roleId;
            setUsers(newUserList);
          }
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  const rolesOpts = [
    {
      value: 1,
      label: ROLES[1],
    },
    { value: 2, label: ROLES[2] },
    { value: 3, label: ROLES[3] },
  ];
  return (
    <Modal open={open} size={size}>
      {/*header*/}
      <ModalHeader
        title={type === "add" ? "Yeni Hesap Ekle" : "Hesabı Güncelle"}
        toogle={toggle}
      />
      {/*body*/}
      <ModalBody>
        <div className="flex flex-col">
          <form>
            <div className="flex flex-col">
              <div className="mb-6">
                <label htmlFor="username">Username</label>
                <Input
                  id={"username"}
                  name={"username"}
                  type={"text"}
                  placeholder={"Username"}
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email">Email</label>
                <Input
                  id={"email"}
                  name={"email"}
                  type={"text"}
                  placeholder={"Email"}
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  required
                />
              </div>

              {type === "add" ? (
                <Fragment>
                  <div className="mb-6">
                    <label htmlFor="password">Password</label>

                    <PasswordInput
                      id={"password"}
                      name={"password"}
                      placeholder={"Şifre"}
                      {...formik.getFieldProps("password")}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="confirmPassword">Şifre Onayla</label>
                    <PasswordInput
                      id={"confirmPassword"}
                      name={"confirmPassword"}
                      placeholder={"Şifre"}
                      {...formik.getFieldProps("confirmPassword")}
                      required
                    />
                  </div>
                </Fragment>
              ) : null}
              <div className="mb-6">
                <label htmlFor="roleId">Role</label>
                <Select
                  type={"select"}
                  id={"roleId"}
                  name={"roleId"}
                  onChange={(selectedOption) =>
                    formik.setFieldValue("roleId", selectedOption.value)
                  }
                  options={rolesOpts}
                  value={rolesOpts.find(
                    (option) => option.value === formik.values.roleId
                  )}
                  required
                />
              </div>
              <div className="mb-6">
                <div className="form-group form-check">
                  <CheckBox
                    id={"rememberMe"}
                    name={"rememberMe"}
                    label={"Pasif Kullanıcı Yapılsın Mı?"}
                    onChange={(e) => {
                      formik.setFieldValue("isBlocked", e.target.checked);
                    }}
                    checked={formik.values.isBlocked}
                    // checked
                  />
                </div>
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

AccountCreateAndUpdateModal.defaultProps = {
  size: "normal",
};

export default AccountCreateAndUpdateModal;
