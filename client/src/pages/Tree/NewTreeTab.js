import React, { useState } from "react";
import Input from "../../components/Input";
import CheckBox from "../../components/Input/CheckBox";
import Button from "../../components/Button";
import DatePicker from "react-datepicker";
import { AiOutlinePlus } from "react-icons/ai";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import { Capitalize } from "../../utils/Capitalize";
import AddNewTreeOptions from "./AddNewTreeOptions";
const initialState = {
  newTree: {
    agacNo: "",
    listeNo: "",
    agacAuto: false,
    listeAuto: false,
    renkId: "",
    ayarId: "",
    kalınlıkId: "",
    hazırlayanId: "",
    mumTurId: "",
    date: new Date(),
  },
  descriptions: [],
  options: [],
  creators: [],
  thicks: [],
  waxes: [],
  treeStatuses: [],
};
function NewTreeTab({
  colors,
  options,
  thicks,
  creators,
  waxes,
  todayTrees,
  setTodayTrees,
}) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newTree, setNewTree] = useState(initialState.newTree);
  const [addNewTreeOptions, setAddNewTreeOptions] = useState({
    open: false,
    type: "",
  });
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const controller = new AbortController();

  function getBiggestNumber(key) {
    let biggest = Number(todayTrees[0][key]);
    todayTrees.forEach((tree) => {
      if (biggest < tree[key]) {
        biggest = Number(tree[key]);
      }
    });
    return biggest;
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();
    // auto seçili ise next number (listNo -> listeAuto, agacNo -> agacAuto) OK
    // auto seçili değil tekrar eden bir numara girdi error
    // renk, tarih,ayar, kalınlık , mum türü  değerlerini girilip girilmediğini kontrol et

    /**agacAuto: false
      agacNo: "1"
      ayarId: 1
      date: Wed Feb 15 2023 23:34:14 GMT+0300 (GMT+03:00) {}
      hazırlayanId: 1
      kalınlıkId: 1
      listeAuto: false
      listeNo: ""
      mumTurId: 1
      renkId: 1 */

    try {
      if (newTree.agacAuto) {
        let biggestNumber = getBiggestNumber("treeNo") + 1;
        setNewTree({ ...newTree, agacNo: biggestNumber });
      } else {
        todayTrees.forEach((tree) => {
          if (tree["treeNo"] === Number(newTree.agacNo)) {
            throw new Error(
              `Tekrar eden bir Agaç numarası girdiniz!. ${
                getBiggestNumber("treeNo") + 1
              } numarasını girebilirsiniz. `
            );
          }
        });
      }

      if (newTree.listeAuto) {
        let biggestNumber = getBiggestNumber("listNo") + 1;
        setNewTree({ ...newTree, listeNo: biggestNumber });
      } else {
        todayTrees.forEach((tree) => {
          if (tree["listNo"] === Number(newTree.listeNo)) {
            throw new Error(
              `Tekrar eden bir Liste numarası girdiniz!. ${
                getBiggestNumber("listNo") + 1
              } numarasını girebilirsiniz. `
            );
          }
        });
      }
      if (newTree.agacNo === "" && newTree.agacAuto === false) {
        throw new Error("Agaç Numarası Girilmedi!");
      }
      if (newTree.listeNo === "" && newTree.listeAuto === false) {
        throw new Error("Liste Numarası Girilmedi!");
      }
      if (newTree.renkId === "") {
        throw new Error("Renk Seçilmedi!");
      }
      if (newTree.ayarId === "") {
        throw new Error("Ayar Seçilmedi!");
      }
      if (newTree.kalınlıkId === "") {
        throw new Error("Kalınlık Seçilmedi!");
      }
      if (newTree.hazırlayanId === "") {
        throw new Error("Hazırlayan Seçilmedi!");
      }
      if (newTree.mumTurId === "") {
        throw new Error("Mum Turu Seçilmedi");
      }
      var treeBody = {
        optionId: newTree.ayarId,
        waxId: newTree.mumTurId,
        creatorId: newTree.hazırlayanId,
        thickId: newTree.kalınlıkId,
        colorId: newTree.renkId,
        date: newTree.date,
        listNo: newTree.listeNo,
        treeNo: newTree.agacNo,
        treeStatusId: 1,
        isImmediate: false,
        active: true,
      };
      await axiosPrivate.post(Endpoints.TREE.MAIN, treeBody, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        signal: controller.signal,
      });
      setTodayTrees(res.data.trees);
    } catch (err) {
      window.alert(err);
    }
  };
  return (
    <>
      <form className="space-y-4" onSubmit={onFormSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 ">
          <p className="col-span-12 md:col-span-1">Agac No</p>
          <div className="col-span-12 md:col-span-2">
            <Input
              placeholder={"Agaç No"}
              type={"number"}
              min="0"
              onChange={(e) =>
                setNewTree({ ...newTree, agacNo: e.target.value })
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <CheckBox
              label={"Agaç No Otomatik Artır"}
              checked={newTree.agacAuto}
              onChange={(e) =>
                setNewTree({ ...newTree, agacAuto: !newTree.agacAuto })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 ">
          <p className="col-span-12 md:col-span-1">Liste No</p>
          <div className="col-span-12 md:col-span-2">
            <Input
              placeholder={"Liste No"}
              type={"number"}
              min="0"
              onChange={(e) =>
                setNewTree({ ...newTree, listeNo: e.target.value })
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <CheckBox
              label={"Liste No Otomatik Artır"}
              checked={newTree.listeAuto}
              onChange={(e) =>
                setNewTree({ ...newTree, listeAuto: !newTree.listeAuto })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-12 md:col-span-4">
            <DatePicker
              inline
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
            />
          </div>
          <div className="col-span-12 md:col-span-2">
            <h4 className="text-lg">Renk</h4>
            <ul>
              <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "COLOR",
                  });
                }}
                className="flex items-center gap-x-4 text-blue-700 hover:bg-slate-700 p-2 hover:cursor-pointer"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li>
              {colors.map((color) => {
                return (
                  <li
                    key={color.colorId}
                    className={`${
                      newTree.renkId === color.colorId ? "bg-slate-800" : ""
                    } p-2  `}
                    onClick={() => {
                      setNewTree({ ...newTree, renkId: color.colorId });
                    }}
                  >
                    {Capitalize(color.colorName)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-y-6 md:gap-y-0">
          <div className="border-r border-slate-800 px-1 col-span-2 md:col-span-1">
            <h4 className="text-lg">Ayar</h4>
            <ul>
              <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "OPTION",
                  });
                }}
                className="hover:cursor-pointer flex items-center gap-x-4 text-blue-700 hover:bg-slate-700 p-2"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li>
              {options.map((option) => {
                return (
                  <li
                    key={option.optionId}
                    className={`${
                      newTree.ayarId === option.optionId ? "bg-slate-800" : ""
                    } p-2  `}
                    onClick={() => {
                      setNewTree({ ...newTree, ayarId: option.optionId });
                    }}
                  >
                    {Capitalize(option.optionText)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-r border-slate-800 px-1 col-span-2 md:col-span-1">
            <h4 className="text-lg">Kalınlık</h4>
            <ul>
              <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "THICK",
                  });
                }}
                className=" hover:cursor-pointer flex items-center gap-x-4 text-blue-700 hover:bg-slate-700 p-2"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li>
              {thicks.map((thick) => {
                return (
                  <li
                    key={thick.thickId}
                    className={`${
                      newTree.kalınlıkId === thick.thickId ? "bg-slate-800" : ""
                    } p-2  `}
                    onClick={() => {
                      setNewTree({ ...newTree, kalınlıkId: thick.thickId });
                    }}
                  >
                    {Capitalize(thick.thickName)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border-r border-slate-800 px-1 col-span-2 md:col-span-1">
            <h4 className="text-lg">Hazırlayan</h4>
            <ul>
              <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "CREATOR",
                  });
                }}
                className="hover:cursor-pointer flex items-center gap-x-4 text-blue-700 hover:bg-slate-700 p-2"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li>
              {creators.map((creator) => {
                return (
                  <li
                    key={creator.creatorId}
                    className={`${
                      newTree.hazırlayanId === creator.creatorId
                        ? "bg-slate-800"
                        : ""
                    } p-2  `}
                    onClick={() => {
                      setNewTree({
                        ...newTree,
                        hazırlayanId: creator.creatorId,
                      });
                    }}
                  >
                    {Capitalize(creator.creatorName)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="pl-1 col-span-2 md:col-span-1">
            <h4 className="text-lg">Mum Türü</h4>
            <ul>
              <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "WAX",
                  });
                }}
                className=" hover:cursor-pointer flex items-center gap-x-4 text-blue-700 hover:bg-slate-700 p-2"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li>
              {waxes.map((wax) => {
                return (
                  <li
                    key={wax.waxId}
                    className={`${
                      newTree.mumTurId === wax.waxId ? "bg-slate-800" : ""
                    } p-2  `}
                    onClick={() => {
                      setNewTree({ ...newTree, mumTurId: wax.waxId });
                    }}
                  >
                    {Capitalize(wax.waxName)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className="flex justify-end">
          <Button type="submit" appearance={"primary"}>
            Agaç Ekle
          </Button>
        </div>
      </form>
      {addNewTreeOptions.open ? (
        <AddNewTreeOptions
          open={addNewTreeOptions.open}
          type={addNewTreeOptions.type.toUpperCase()}
          setAddNewTreeOptions={setAddNewTreeOptions}
          toggle={() => setAddNewTreeOptions({ open: false, type: "" })}
        />
      ) : null}
    </>
  );
}

export default NewTreeTab;
