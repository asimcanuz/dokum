import React, { useEffect, useRef, useState } from "react";
import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Capitalize } from "../../utils/Capitalize";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";
import Alert from "../../components/Alert/Alert";
import ModalFooter from "../../components/Modal/ModalFooter";

const initUpdatedItem = {
  value: "",
  id: "",
};

function AddNewTreeOptions({ open, size, toggle, type, setForceUpdate }) {
  const [treeOptions, setTreeOptions] = useState([]);

  const [operationType, setOperationType] = useState("add");
  const [value, setValue] = useState("");
  const [updatedItem, setUpdatedItem] = useState(initUpdatedItem);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    let isMounted = true;

    const getTreeOtions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints[type.toUpperCase()], {
          signal: controller.signal,
        });
        if (isMounted) {
          const responseDataType = Object.keys(response.data)[0];
          setTreeOptions(response.data[responseDataType]);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };

    getTreeOtions();
    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, []);
  const handleOperation = async () => {
    var item = {};

    switch (type) {
      case "WAX":
        item =
          operationType === "add"
            ? { waxName: value }
            : { waxId: updatedItem.id, waxName: updatedItem.value };
        break;
      case "COLOR":
        item =
          operationType === "add"
            ? { colorName: value }
            : { colorId: updatedItem.id, colorName: updatedItem.value };
        break;
      case "CREATOR":
        item =
          operationType === "add"
            ? { creatorName: value }
            : { creatorId: updatedItem.id, creatorName: updatedItem.value };
        break;
      case "OPTION":
        item =
          operationType === "add"
            ? { optionText: value }
            : { optionId: updatedItem.id, optionText: updatedItem.value };
        break;
      case "THICK":
        item =
          operationType === "add"
            ? { thickName: value }
            : { thickId: updatedItem.id, thickName: updatedItem.value };
        break;
      default:
        break;
    }

    if (operationType === "add") {
      await axiosPrivate.post(Endpoints[type.toUpperCase()], item, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } else {
      await axiosPrivate.put(Endpoints[type.toUpperCase()], item, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    }

    const response = await axiosPrivate.get(Endpoints[type.toUpperCase()]);

    const responseDataType = Object.keys(response.data)[0];
    setTreeOptions(response.data[responseDataType]);
    // if (response.status === 200) window.location.reload();
  };

  return (
    <Modal open={open} size={size}>
      <ModalHeader
        title={operationType === "add" ? "Yeni Ekle" : "Güncelle"}
        toogle={toggle}
      />
      <ModalBody>
        <div className="flex flex-col  space-y-4">
          <div className="flex flex-row space-x-4 border-b border-b-gray-700 pb-4">
            <Input
              placeholder={type}
              type={"text"}
              value={value}
              onChange={(e) => {
                if (type === "update") {
                  setUpdatedItem({ ...updatedItem, value: e.target.value });
                }
                setValue(e.target.value);
              }}
            />
            <Button
              appearance={"primary"}
              onClick={() => {
                setOperationType("add");
                handleOperation();
              }}
            >
              {operationType === "add" ? "Ekle" : "Kaydet"}
            </Button>
          </div>
          {treeOptions.length > 0 ? (
            <div className="w-full">
              <h3>{Capitalize(type)}</h3>
              <ul className="space-y-4">
                {treeOptions.map((val, index) => (
                  <li
                    className="hover:cursor-pointer"
                    key={index}
                    onClick={() => {
                      setValue(Object.values(val)[1]);
                      setOperationType("update");
                      setUpdatedItem({
                        id: Object.values[0],
                        value: Object.values[1],
                      });
                    }}
                  >
                    {Object.values(val)[1]}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Alert apperance={"danger"}>Veri Yok</Alert>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button appearance={"danger"} onClick={toggle}>
          Kapat
        </Button>
      </ModalFooter>
    </Modal>
  );
}

AddNewTreeOptions.defaultProps = {
  size: "normal",
};

export default AddNewTreeOptions;
