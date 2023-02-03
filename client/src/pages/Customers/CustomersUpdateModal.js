import React from "react";
import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Button from "../../components/Button";
import { useFormik } from "formik";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Input from "../../components/Input";
import useAuth from "../../hooks/useAuth";
import CheckBox from "../../components/Input/CheckBox";
import { Endpoints } from "../../constants/Endpoints";

function CustomerUpdateModal({
  open,
  toggle,
  size,
  defaultValues,
  customers,
  setCustomers,
}) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();

  const formik = useFormik({
    initialValues: {
      accountNumber: defaultValues?.accountNumber,
      customerName: defaultValues?.customerName,
      email: defaultValues?.email,
      phone: defaultValues?.phone,
      isActive: defaultValues?.isActive,
    },
    // validationSchema: FormSchema,
    onSubmit: async (values) => {
      var customer = {
        customerId: defaultValues.customerId,
        accountNumber: values.accountNumber,
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        createdBy: defaultValues.createdBy,
        updatedBy: auth.id,
        isActive: values.isActive,
      };

      try {
        const response = await axiosPrivate.post(
          Endpoints.CUSTOMERS.UPDATE,
          customer,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const newCustomerList = [...customers];
          var _customer = newCustomerList.find(
            (cus) => cus.customerId === customer.customerId
          );
          _customer.accountNumbe = customer.accountNumber;
          _customer.customerName = customer.customerName;
          _customer.email = customer.email;
          _customer.phone = customer.phone;
          _customer.createdBy = customer.createdBy;
          _customer.updatedBy = customer.updatedBy;
          _customer.isActive = customer.isActive;
          setCustomers(newCustomerList);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <Modal open={open} size={size}>
      <ModalHeader title={"Müşteri Güncelle"} toogle={toggle} />
      <ModalBody>
        <div className="flex flex-col">
          <form>
            <div className="flex flex-col">
              <div className="mb-6">
                <label htmlFor="accountNumber"> Hesap Numarası </label>
                <Input
                  id={"accountNumber"}
                  name={"accountNumber"}
                  type={"text"}
                  placeholder={"Hesap Numarası"}
                  onChange={formik.handleChange}
                  value={formik.values.accountNumber}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="customerName"> Müşteri Adı</label>
                <Input
                  id={"customerName"}
                  name={"customerName"}
                  type={"text"}
                  placeholder={"Müşteri Adı"}
                  onChange={formik.handleChange}
                  value={formik.values.customerName}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email"> Email </label>
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
              <div className="mb-6">
                <label htmlFor="phone"> Telefon Numarası </label>
                <Input
                  id={"phone"}
                  name={"phone"}
                  type={"text"}
                  placeholder={"Hesap Numarası"}
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  required
                />
              </div>
              <div className="mb-6">
                <div className="form-group form-check">
                  <CheckBox
                    id={"isActive"}
                    name={"isActive"}
                    label={"Aktif Müşteri"}
                    onChange={(e) => {
                      formik.setFieldValue("isActive", e.target.checked);
                    }}
                    checked={formik.values.isActive}
                    // checked
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModalBody>
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

export default CustomerUpdateModal;
