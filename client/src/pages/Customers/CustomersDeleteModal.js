import React, { useRef } from "react";
import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";
import Button from "../../components/Button";
import { useFormik } from "formik";
import { MdOutlineDeleteForever } from "react-icons/md";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";

function CustomersDeleteModal({
  open,
  toggle,
  size,
  id,
  customerName,
  customers,
  setCustomers,
  setReqController,
}) {
  const axiosPrivate = useAxiosPrivate();

  const deleteCustomer = async () => {
    try {
      const response = await axiosPrivate.post(
        Endpoints.CUSTOMERS.DELETE,
        { customerId: id },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setReqController(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Modal open={open} size={size}>
      <ModalHeader
        title={"Silmek istediğinize emin misiniz?"}
        toogle={toggle}
      />
      <ModalBody>
        <div className="flex items-center space-x-5">
          <div className="border-4  border-red-600 rounded-full p-4 ">
            <MdOutlineDeleteForever size={"48px"} className="text-red-600 " />
          </div>
          <p>Müşteriyi ({customerName}) silmek istediğinize emin misiniz?</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button appearance={"danger"} onClick={toggle}>
          Hayır
        </Button>
        <Button
          type="submit"
          appearance={"success"}
          onClick={async () => {
            // await formik.handleSubmit();
            await deleteCustomer();

            await toggle();
          }}
        >
          Evet
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default CustomersDeleteModal;
