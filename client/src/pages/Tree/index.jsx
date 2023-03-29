import React, { Fragment, useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Tabs from "../../components/Tabs";

import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NewTreeTab from "./NewTreeTab";
import TreeTable from "./TreeTable";
import NewOrderTab from "./NewOrderTab";
import UpdateTreeModal from "./UpdateTreeModal";

const tabs = {
  agac: "tree",
  siparis: "order",
};
const tabList = [
  {
    name: "Ağaç",
    id: "tree",
  },
  {
    name: "Sipariş",
    id: "order",
  },
];
const initUpdateClick = {
  open: false,
  active: "",
  colorId: "",
  creatorId: "",
  date: "",
  isImmediate: "",
  listNo: "",
  optionId: "",
  processId: "",
  thickId: "",
  treeNo: "",
  treeStatusId: "",
  waxId: "",
};

function TreePage() {
  const [selectedTab, setSelectedTab] = useState(tabs.agac);
  const [clickTree, setClickTree] = useState(initUpdateClick);
  const [updateClick, setUpdateClick] = useState({});

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  const [treeStatuses, setTreeStatuses] = useState([]);
  const [options, setOptions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [thicks, setThicks] = useState([]);
  const [waxes, setWaxes] = useState([]);
  const [colors, setColors] = useState([]);
  const [todayTrees, setTodayTrees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [descriptions, setDescriptions] = useState([]);

  const [isHaveNotFinished, setIsHaveNotFinished] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
          signal: controller.signal,
        });

        if (isMounted) {
          setTodayTrees(res.data.trees);
          setIsHaveNotFinished(res.data.isHaveNotFinished);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    const getOptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.OPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setOptions(response.data.options);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };

    const getCreator = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CREATOR, {
          signal: controller.signal,
        });

        if (isMounted) {
          setCreators(response.data.creators);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getThick = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.THICK, {
          signal: controller.signal,
        });
        if (isMounted) {
          setThicks(response.data.thicks);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getWax = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.WAX, {
          signal: controller.signal,
        });

        if (isMounted) {
          setWaxes(response.data.waxes);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getTreeStatus = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
          signal: controller.signal,
        });

        if (isMounted) {
          setTreeStatuses(response.data.treeStatuses);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };

    const getColors = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.COLOR, {
          signal: controller.signal,
        });

        if (isMounted) {
          setColors(response.data.colors);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getDescriptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setDescriptions(response.data.descriptions);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getCustomers = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CUSTOMERS.GET_ALL, {
          signal: controller.signal,
        });
        isMounted && setCustomers(response.data.customers);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    getDescriptions();
    // getTreeStatus();
    getOptions();
    getCreator();
    getThick();
    getWax();
    getColors();
    getTrees();
    getCustomers();
    getTreeStatus();

    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, []);
  return (
    <Fragment>
      <section className="space-y-4">
        <Header
          title={"Ağaçlar"}
          description={"Döküme girecek ağaç girişleri"}
        />
        <div className="grid grid-cols-12 mt-4 gap-x-4 gap-y-4">
          <div className="col-span-12 lg:col-span-6 xl:col-span-4  max-w-md">
            <Tabs
              tabsList={tabList}
              setSelected={setSelectedTab}
              selectedTab={selectedTab}
            />
            <div className="px-6 py-4">
              {selectedTab === tabs.agac ? (
                <NewTreeTab
                  colors={colors}
                  options={options}
                  thicks={thicks}
                  creators={creators}
                  waxes={waxes}
                  todayTrees={todayTrees}
                  setTodayTrees={setTodayTrees}
                  customers={customers}
                  descriptions={descriptions}
                  isHaveNotFinished={isHaveNotFinished}
                />
              ) : (
                <NewOrderTab
                  clickTree={clickTree}
                  customers={customers}
                  descriptions={descriptions}
                  setTodayTrees={setTodayTrees}
                />
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-6 xl:col-span-8  ">
            <TreeTable
              setClickTree={setClickTree}
              todayTrees={todayTrees}
              customers={customers}
              descriptions={descriptions}
              treeStatuses={treeStatuses}
              creators={creators}
              setUpdateClick={setUpdateClick}
              setTodayTrees={setTodayTrees}
              isHaveNotFinished={isHaveNotFinished}
            />
          </div>
        </div>
      </section>

      {updateClick.open ? (
        <UpdateTreeModal
          updateClick={updateClick}
          setTodayTrees={setTodayTrees}
          treeStatuses={treeStatuses}
          options={options}
          creators={creators}
          thicks={thicks}
          waxes={waxes}
          colors={colors}
          todayTrees={todayTrees}
          customers={customers}
          descriptions={descriptions}
          setIsHaveNotFinished={setIsHaveNotFinished}
          toggle={() => {
            setUpdateClick(initUpdateClick);
          }}
        />
      ) : null}
    </Fragment>
  );
}

export default TreePage;