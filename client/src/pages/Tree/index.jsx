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
import NewJobGroup from "./NewJobGroup";

const tabs = {
  agac: "tree",
  siparis: "order",
  isGrubu: "jobGroup"
};
const tabList = [
  {
    name: "İş Grubu",
    id: "jobGroup"
  },
  {
    name: "Ağaç",
    id: "tree"
  },
  {
    name: "Sipariş",
    id: "order"
  }
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
  waxId: ""
};

function TreePage() {
  const [selectedTab, setSelectedTab] = useState(tabs.isGrubu);
  const [clickTree, setClickTree] = useState(initUpdateClick);
  const [updateClick, setUpdateClick] = useState({});

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [treeStatuses, setTreeStatuses] = useState([]);
  const [options, setOptions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [thicks, setThicks] = useState([]);
  const [waxes, setWaxes] = useState([]);
  const [colors, setColors] = useState([]);
  const [todayTrees, setTodayTrees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [descriptions, setDescriptions] = useState([]);
  const [jobGroups, setJobGroups] = useState([]);

  const [selectedJobGroup, setSelectedJobGroup] = useState(null);
  const treeTableRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
          params: {
            jobGroupId: selectedJobGroup
          },
          signal: controller.signal
        });

        if (isMounted) {
          setTodayTrees(res.data.trees);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    const getOptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.OPTION, {
          signal: controller.signal
        });
        if (isMounted) {
          setOptions(response.data.options);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };

    const getCreator = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CREATOR, {
          signal: controller.signal
        });

        if (isMounted) {
          setCreators(response.data.creators);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };
    const getThick = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.THICK, {
          signal: controller.signal
        });
        if (isMounted) {
          setThicks(response.data.thicks);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };
    const getWax = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.WAX, {
          signal: controller.signal
        });

        if (isMounted) {
          setWaxes(response.data.waxes);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };
    const getTreeStatus = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
          signal: controller.signal
        });

        if (isMounted) {
          setTreeStatuses(response.data.treeStatuses);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };

    const getColors = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.COLOR, {
          signal: controller.signal
        });

        if (isMounted) {
          setColors(response.data.colors);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };
    const getDescriptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
          signal: controller.signal
        });
        if (isMounted) {
          setDescriptions(response.data.descriptions);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true
        });
      }
    };
    const getCustomers = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CUSTOMERS.GET_ALL, {
          signal: controller.signal
        });
        isMounted && setCustomers(response.data.customers);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    const getJobGroups = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal
        });
        isMounted && setJobGroups(response.data.jobGroupList);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getJobGroups();
    getDescriptions();
    // getTreeStatus();
    getOptions();
    getCreator();
    getThick();
    getWax();
    getColors();
    selectedJobGroup && getTrees();
    getCustomers();
    getTreeStatus();

    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        params: {
          jobGroupId: selectedJobGroup
        }
      });
      treeTableRef.current = res.data.trees;
      setTodayTrees(res.data.trees);
    };
    selectedJobGroup && fetchData();
  }, [selectedJobGroup]);
  return (
    <Fragment>
      <section className="space-y-2">
        <Header
          title={"Ağaç Girişi"}
          description={"Döküme girecek ağaç girişleri"}
        />
        <div className="grid grid-cols-12 mt-4 gap-x-4 gap-y-4">
          <div className="col-span-12 lg:col-span-3 max-w-lg">
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
                  jobGroups={jobGroups}
                  selectedJobGroup={selectedJobGroup}
                  setSelectedJobGroup={setSelectedJobGroup}
                />
              ) : selectedTab === tabs.siparis ? (
                <NewOrderTab
                  clickTree={clickTree}
                  setClickTree={setClickTree}
                  customers={customers}
                  descriptions={descriptions}
                  setTodayTrees={setTodayTrees}
                  selectedJobGroup={selectedJobGroup}
                />
              ) : (
                <NewJobGroup
                  jobGroups={jobGroups}
                  setJobGroups={setJobGroups}
                  setSelectedJobGroup={setSelectedJobGroup}
                  selectedJobGroup={selectedJobGroup}
                />
              )}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-9">
            <TreeTable
              setClickTree={setClickTree}
              todayTrees={todayTrees}
              customers={customers}
              descriptions={descriptions}
              treeStatuses={treeStatuses}
              creators={creators}
              setUpdateClick={setUpdateClick}
              setTodayTrees={setTodayTrees}
              clickTreeId={clickTree.agacId}
              jobGroups={jobGroups}
              selectedJobGroup={selectedJobGroup}
              setSelectedJobGroup={setSelectedJobGroup}
              treeTableRef={treeTableRef}
            />
          </div>
        </div>
      </section>

      {updateClick.open ? (
        <UpdateTreeModal
          updateClick={updateClick}
          setUpdateClick={setUpdateClick}
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
          selectedJobGroup={selectedJobGroup}
          toggle={() => {
            setUpdateClick(initUpdateClick);
          }}
        />
      ) : null}
    </Fragment>
  );
}

export default TreePage;
