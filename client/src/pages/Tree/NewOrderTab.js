import React, { useEffect } from "react";
import Select from "react-select";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { AiOutlinePlus } from "react-icons/ai";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function NewOrderTab({
  clickTree: tree,
  customers,
  descriptions,
  setTodayTrees,
}) {
  const auth = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = React.useState({
    treeId: tree.agacId,
    customerId: "",
    descriptionId: "",
    quantity: "",
    createdBy: auth.auth.id,
  });
  useEffect(() => {
    setOrder({ ...order, treeId: tree.agacId });
  }, [tree]);

  const customerOptions = customers.map((customer) => ({
    value: customer.customerId,
    label: customer.customerName,
  }));
  const descriptionOptions = descriptions.map((description) => ({
    value: description.descriptionId,
    label: description.descriptionText,
  }));

  async function addOrder() {
    const controller = new AbortController();
    try {
      await axiosPrivate.post(Endpoints.ORDER, order, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const response = await axiosPrivate.get(Endpoints.TREE.TODAY);

      setTodayTrees(response.data.trees);
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  }

  return (
    <section className="flex flex-col space-y-4 ">
      <div className="grid grid-cols-4 gap-4">
        <div className="flex flex-col ">
          <p className="font-bold text-red-400">Id</p>
          <p className="text-blue-600">{tree.agacId}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Agaç No</p>
          <p className="text-blue-600">{tree.agacNo}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Liste No</p>
          <p className="text-blue-600">{tree.listeNo}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Ağaçtaki Sipariş Adeti</p>
          <p className="text-blue-600">{tree.siparisSayisi}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Renk</p>
          <p className="text-blue-600">{tree.renk}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Ayar</p>
          <p className="text-blue-600">{tree.ayar}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Kalınlık</p>
          <p className="text-blue-600">{tree.kalinlik}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold text-red-400">Ağaçtaki Müşteri Adeti</p>
          <p className="text-blue-600">{tree.musteriSayisi}</p>
        </div>
      </div>
      <div className="grid grid-rows-3">
        <div className="flex flex-col">
          <p>Müşteri</p>
          <Select
            options={customerOptions}
            onChange={({ value }) => {
              setOrder({ ...order, customerId: value });
            }}
          />
        </div>
        <div className="flex flex-col">
          <p>Adet</p>
          <Input
            type={"text"}
            value={order.quantity}
            onChange={(e) => setOrder({ ...order, quantity: e.target.value })}
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex flex-row justify-between ">
            <p>Açıklama</p>
            <p className="flex flex-row justify-between items-center text-blue-600 hover:cursor-pointer hover:animate-pulse">
              <AiOutlinePlus /> <span>Yeni Açıklama</span>
            </p>
          </div>
          <Select
            options={descriptionOptions}
            onChange={({ value }) => {
              setOrder({ ...order, descriptionId: value });
            }}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          appearance={"primary"}
          disabled={Object.values(tree).includes("")}
          onClick={addOrder}
        >
          Sipariş Ekle
        </Button>
      </div>
    </section>
  );
}

export default NewOrderTab;
