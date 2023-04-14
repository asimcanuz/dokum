import React, { useState } from "react";
import Input from "../../components/Input";
import CheckBox from "../../components/Input/CheckBox";
import Button from "../../components/Button";
import DatePicker from "react-datepicker";
import { AiOutlinePlus } from "react-icons/ai";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { Capitalize } from "../../utils/Capitalize";
import AddNewTreeOptions from "./AddNewTreeOptions";
import Select from "react-select";

function NewTreeTab({
  colors,
  options,
  thicks,
  creators,
  waxes,
  todayTrees,
  setTodayTrees,
  jobGroups,
  selectedJobGroup,
  setSelectedJobGroup,
}) {
  const initialState = {
    newTree: {
      treeNo: "",
      listeNo: "",
      agacAuto: false,
      listeAuto: false,
      renkId: "",
      ayarId: "",
      kalınlıkId: "",
      hazırlayanId: "",
      mumTurId: "",
      date: new Date(),
      jobGroupId: selectedJobGroup,
    },
    descriptions: [],
    options: [],
    creators: [],
    thicks: [],
    waxes: [],
    treeStatuses: [],
  };
  const [newTree, setNewTree] = useState(initialState.newTree);
  const [addNewTreeOptions, setAddNewTreeOptions] = useState({
    open: false,
    type: "",
  });
  const axiosPrivate = useAxiosPrivate();

  function getBiggestNumber(key) {
    if (!todayTrees || todayTrees.length === 0) {
      return 0;
    }

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

    let _agacNo = newTree?.treeNo;
    let _listeNo = newTree?.listeNo;
    try {
      if (newTree.jobGroupId === "") {
        throw new Error("İş grubu seçilmedi!");
      }
      if (newTree.agacAuto) {
        _agacNo = getBiggestNumber("treeNo") + 1;
        // set New tree with prev State

        // setNewTree({ ...newTree, treeNo: _agacNo });
      } else {
        todayTrees.forEach((tree) => {
          if (
            tree["treeNo"] === Number(newTree.treeNo) &&
            tree["jobGroupId"] === selectedJobGroup
          ) {
            throw new Error(
              `Tekrar eden bir Agaç numarası girdiniz!. ${
                getBiggestNumber("treeNo") + 1
              } numarasını girebilirsiniz. `
            );
          }
        });
      }

      if (newTree.listeAuto) {
        _listeNo = getBiggestNumber("listNo") + 1;
      } else {
        todayTrees.forEach((tree) => {
          if (
            tree["listNo"] === Number(newTree.listeNo) &&
            tree["jobGroupId"] === selectedJobGroup
          ) {
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
      setNewTree({ ...newTree, treeNo: _agacNo, listeNo: _listeNo });
      const treeDate = jobGroups.filter(
        (jobGroup) => jobGroup.id === newTree.jobGroupId
      )[0].date;

      var treeBody = {
        optionId: newTree.ayarId,
        waxId: newTree.mumTurId,
        creatorId: newTree.hazırlayanId,
        thickId: newTree.kalınlıkId,
        colorId: newTree.renkId,
        date: treeDate,
        listNo: _listeNo,
        treeNo: _agacNo,
        treeStatusId: 1,
        isImmediate: false,
        active: true,
        jobGroupId: newTree.jobGroupId,
      };
      await axiosPrivate.post(Endpoints.TREE.MAIN, treeBody, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      const controller = new AbortController();
      const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        params: {
          jobGroupId: selectedJobGroup,
        },

        signal: controller.signal,
      });
      setTodayTrees(res.data.trees);
      controller.abort();
    } catch (err) {
      window.alert(err);
    }
  };

  const jobGroupOptions = jobGroups.map((jobGroup) => {
    return {
      value: jobGroup.id,
      label: "No: " + jobGroup.date,
    };
  });

  return (
    <>
      <form
        className="space-y-4 border-r border-gray-700 px-4"
        onSubmit={onFormSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <p className="col-span-12 md:col-span-1">İş Grubu</p>
          <div className="col-span-12 md:col-span-5">
            <Select
              options={jobGroupOptions}
              value={
                jobGroupOptions.filter(
                  (option) => option.value === selectedJobGroup
                )[0]
              }
              onChange={(e) => {
                setNewTree({ ...newTree, jobGroupId: e.value });
                setSelectedJobGroup(e.value);
              }}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2 ">
          <p className="col-span-12 md:col-span-1">Agac No</p>
          <div className="col-span-12 md:col-span-2">
            <Input
              id="treeNo"
              placeholder={"Agaç No"}
              type={"number"}
              value={newTree?.treeNo || ""}
              min="0"
              onChange={(e) =>
                setNewTree({ ...newTree, treeNo: e.target.value })
              }
            />
          </div>
          <div className="col-span-12 md:col-span-3">
            <CheckBox
              htmlFor="treeNo"
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
              value={newTree?.listeNo}
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

        <div className="grid grid-cols-3 grid-rows-2 ">
          <div className="px-2 py-2  border border-slate-800 space-y-4">
            <h4 className="text-lg font-bold flex flex-row items-center justify-around border-b border-slate-800 pb-2">
              Renk
            </h4>
            <ul
              className={`mt-2 max-h-60  ${
                colors.length > 9 && "overflow-y-scroll"
              } scroll-m-1 scroll-smooth`}
            >
              {/* <li
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "COLOR",
                  });
                }}
                className="flex items-center gap-x-4 text-blue-700 hover:bg-gray-200  dark:hover:bg-slate-700 p-2 hover:cursor-pointer"
              >
                <AiOutlinePlus /> <span>Yeni Ekle</span>
              </li> */}
              {colors.map((color) => {
                return (
                  <li
                    key={color.colorId}
                    className={`${
                      newTree.renkId === color.colorId
                        ? "bg-gray-300 dark:bg-slate-800"
                        : ""
                    } p-1`}
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
          <div className="px-2 py-2 border-r border-t border-b border-slate-800 ">
            <h4 className="text-lg font-bold flex flex-row items-center justify-around border-b border-slate-800 pb-2">
              Ayar
              <AiOutlinePlus
                className="text-blue-700 hover:cursor-pointer "
                size={20}
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "OPTION",
                  });
                }}
              />
            </h4>
            <ul
              className={`mt-2 max-h-60  ${
                options.length > 9 && "overflow-y-scroll"
              } scroll-m-1 scroll-smooth`}
            >
              {options.map((option) => {
                return (
                  <li
                    key={option.optionId}
                    className={`${
                      newTree.ayarId === option.optionId
                        ? "bg-gray-300 dark:bg-slate-800"
                        : ""
                    } p-1`}
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
          <div className="px-2 py-2 border border-l-0 border-slate-800">
            <h4 className="text-lg font-bold flex flex-row items-center justify-around border-b border-slate-800 pb-2">
              Kalınlık
              <AiOutlinePlus
                className="text-blue-700 hover:cursor-pointer "
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "THICK",
                  });
                }}
              />
            </h4>
            <ul
              className={`mt-2 max-h-60  ${
                thicks.length > 9 && "overflow-y-scroll"
              } scroll-m-1 scroll-smooth`}
            >
              {thicks.map((thick) => {
                return (
                  <li
                    key={thick.thickId}
                    className={`${
                      newTree.kalınlıkId === thick.thickId
                        ? "bg-gray-300 dark:bg-slate-800"
                        : ""
                    } p-1`}
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
          <div className="px-2 py-2  border border-t-0 border-slate-800">
            <h4 className=" text-lg font-bold flex flex-row items-center justify-around border-b border-slate-800 pb-2">
              Hazırlayan
              <AiOutlinePlus
                className="text-blue-700 hover:cursor-pointer "
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "CREATOR",
                  });
                }}
              />
            </h4>
            <ul
              className={`mt-2 max-h-60 ${
                creators.length > 9 && "overflow-y-scroll"
              } scroll-m-1 scroll-smooth`}
            >
              {creators.map((creator) => {
                return (
                  <li
                    key={creator.creatorId}
                    className={`${
                      newTree.hazırlayanId === creator.creatorId
                        ? "bg-gray-300 dark:bg-slate-800"
                        : ""
                    } p-1  `}
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
          <div className="px-2 py-2  border-r border-b border-slate-800 col-span-2 md:col-span-1">
            <h4 className=" text-lg font-bold flex flex-row items-center justify-around border-b border-slate-800 pb-2">
              Mum Türü
              <AiOutlinePlus
                className="text-blue-700 hover:cursor-pointer "
                onClick={() => {
                  setAddNewTreeOptions({
                    open: true,
                    type: "WAX",
                  });
                }}
              />
            </h4>
            <ul
              className={`mt-2 max-h-44  ${
                waxes.length > 9 && "overflow-y-scroll"
              } scroll-m-1 scroll-smooth`}
            >
              {waxes.map((wax) => {
                return (
                  <li
                    key={wax.waxId}
                    className={`${
                      newTree.mumTurId === wax.waxId
                        ? "bg-gray-300 dark:bg-slate-800"
                        : ""
                    } p-1`}
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
