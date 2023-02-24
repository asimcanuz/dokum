import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";
import Button from "../../components/Button";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import Alert from "../../components/Alert/Alert";
import EditableText from "../../components/Input/EditableText";

// TODO : icon renkleri düzenle
function ConfigurationsPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const effectRun = useRef(false);

  const [descriptions, setDescriptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [thicks, setThicks] = useState([]);
  const [waxes, setWaxes] = useState([]);
  const [treeStatuses, setTreeStatuses] = useState([]);
  const [colors, setColors] = useState([]);

  const descriptionsRef = useRef(null);
  const optionsRef = useRef(null);
  const creatorsRef = useRef(null);
  const thicksRef = useRef(null);
  const waxesRef = useRef(null);
  const treeStatusesRef = useRef(null);
  const colorsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();

    let isMounted = true;
    const getDescriptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setDescriptions(response.data.descriptions);
          descriptionsRef.current = response.data.descriptions;
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    const getOptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.OPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setOptions(response.data.options);
          optionsRef.current = response.data.options;
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
          creatorsRef.current = response.data.creators;
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
          thicksRef.current = response.data.thicks;
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
          waxesRef.current = response.data.waxes;
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
          treeStatusesRef.current = response.data.treeStatusesRef;
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
          colorsRef.current = response.data.colors;
        }
      } catch (error) {
        console.error(error);
        navigate("/login", {
          state: { from: location },
          replace: true,
        });
      }
    };
    if (effectRun.current) {
      getDescriptions();
      getOptions();
      getCreator();
      getThick();
      getWax();
      getTreeStatus();
      getColors();
    }

    return () => {
      isMounted = false;
      !isMounted && controller.abort();

      effectRun.current = true;
    };
  }, []);

  //#region wax requests
  const saveWax = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.WAX,
        { waxName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateWax = async (id, name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.WAX,
        { waxId: id, waxName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteWax = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.WAX,
        { data: { waxId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion wax requests

  //#region options request
  const saveOption = async (text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.OPTION,
        { optionText: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateOption = async (id, text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.OPTION,
        { optionId: id, optionText: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteOption = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.OPTION,
        { data: { optionId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion options requests

  //#region thick request
  const saveThick = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.THICK,
        { thickName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateThick = async (id, name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.THICK,
        { thickId: id, thickName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteThick = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.THICK,
        { data: { thickId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion thick requests

  //#region color request
  const saveColor = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.COLOR,
        { colorName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateColor = async (id, name) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.COLOR,
        { colorId: id, colorName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteColor = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.COLOR,
        { data: { colorId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion color requests

  //#region description request
  const saveDescription = async (text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.DESCRIPTION,
        { descriptionText: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateDescription = async (id, text) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.DESCRIPTION,
        { descriptionId: id, descriptionText: text },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteDescription = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.DESCRIPTION,
        { data: { descriptionId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion color requests

  //#region creator request
  const saveCreator = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.CREATOR,
        { creatorName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateCreator = async (id, name) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.CREATOR,
        { creatorId: id, creatorName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteCreator = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.CREATOR,
        { data: { creatorId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion creators requests

  //#region tree status request
  const saveTreeStatus = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.TREESTATUS,
        { treeStatusName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
        signal: controller.signal,
      });

      setTreeStatuses(response.data.treeStatuses);
      treeStatusesRef.current = response.data.treeStatuses;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const updateTreeStatus = async (id, name) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.TREESTATUS,
        { treeStatusId: id, treeStatusName: name },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
        signal: controller.signal,
      });

      setTreeStatuses(response.data.treeStatuses);
      treeStatusesRef.current = response.data.treeStatuses;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  const deleteTreeStatus = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.TREESTATUS,
        { data: { treeStatusId: id } },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
        signal: controller.signal,
      });

      setTreeStatuses(response.data.treeStatuses);
      treeStatusesRef.current = response.data.treeStatuses;
    } catch (error) {
      console.error(error);
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  };
  //#endregion creators requests

  return (
    <div className="space-y-4 ">
      <Header
        title={"Konfigürasyonlar"}
        description={
          "Uygulamanın bazı konfigürasyon ayarlarını buradan yapabilirsiniz."
        }
      />
      <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4 gap-x-4 gap-y-4 ">
        {/* #region Mum Türü */}
        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4  ">
          <h4 className="text-lg">Mum Türü</h4>
          <Button
            appearance={"primary"}
            onClick={async (e) => {
              const lastWaxId = waxes[waxes.length - 1]?.waxId + 1 || 1;
              const newWaxItem = {
                waxId: lastWaxId,
                waxName: "Yeni Mum türü",
              };
              setWaxes([...waxes, newWaxItem]);
              saveWax(newWaxItem.waxName);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Mum Türü Ekle
          </Button>
          {waxes.length > 0 ? (
            <div className="flex flex-col max-h-96 overflow-y-scroll scroll-m-1 scroll-smooth">
              <div className="grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4 ">
                <p>Mum Türü</p>
                <p>İşlemler</p>
              </div>
              {waxes.map((wax) => {
                return (
                  <div
                    key={wax.waxId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={wax.waxId}
                        type={"text"}
                        value={wax.waxName}
                        onChange={(e) => {
                          let newWaxList = [...waxes];
                          let _wax = newWaxList.find(
                            (w) => w.waxId === wax.waxId
                          );
                          _wax.waxName = e.target.value;
                          setWaxes(newWaxList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateWax(wax.waxId, wax.waxName);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={
                          waxesRef.current.find(
                            (wref) => wref.waxId === wax.waxId
                          )?.waxName === undefined
                            ? "Kaydet"
                            : "Güncelle"
                        }
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteWax(wax.waxId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Tooltip on right"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>
        {/* #endregion Mum Türü */}
        {/* #region Ayar */}
        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4 ">
          <h4 className="text-lg">Ayar</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastOptionId =
                options[options.length - 1]?.optionId + 1 || 1;
              const newOptionItem = {
                optionId: lastOptionId,
                optionText: "Yeni Ayar Türü",
              };
              setOptions([...options, newOptionItem]);
              saveOption(newOptionItem.optionText);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Ayar Ekle
          </Button>
          {options.length > 0 ? (
            <div className="flex flex-col max-h-96 overflow-y-scroll scroll-m-1 scroll-smooth">
              <div className="grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4">
                <p>Ayar Türü</p>
                <p>İşlemler</p>
              </div>
              {options.map((option) => {
                return (
                  <div
                    key={option.optionId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={option.optionId}
                        type={"text"}
                        value={option.optionText}
                        onChange={(e) => {
                          let newOptionList = [...options];
                          let _option = newOptionList.find(
                            (o) => o.optionId === option.optionId
                          );
                          _option.optionText = e.target.value;
                          setOptions(newOptionList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateOption(option.optionId, option.optionText);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={
                          optionsRef.current.find(
                            (oref) => oref.optionId === option.optionId
                          )?.optionText === undefined
                            ? "Kaydet"
                            : "Güncelle"
                        }
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteOption(option.optionId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>
        {/* #endregion Ayar */}

        {/* #region Kalınlık */}
        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4">
          <h4 className="text-lg">Kalınlık</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastThickId = thicks[thicks.length - 1]?.thickId + 1 || 1;
              const newThickItem = {
                thickId: lastThickId,
                thickName: "Yeni Kalınlık",
              };
              setThicks([...thicks, newThickItem]);
              saveThick(newThickItem.thickName);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Kalınlık Ekle
          </Button>
          {thicks.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-flow-row-dense grid-cols-2">
                <p>Kalınlık</p>
                <p>İşlemler</p>
              </div>
              {thicks.map((thick) => {
                return (
                  <div
                    key={thick.thickId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={thick.thickId}
                        type={"text"}
                        value={thick.thickName}
                        onChange={(e) => {
                          let newThickList = [...thicks];
                          let _thick = newThickList.find(
                            (t) => t.thickId === thick.thickId
                          );
                          _thick.thickName = e.target.value;
                          setThicks(newThickList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateThick(thick.thickId, thick.thickName);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={"Kaydet"}
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteThick(thick.thickId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>
        {/* #endregion Kalınlık */}

        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4">
          <h4 className="text-lg">Renkler</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastColorId = colors[colors.length - 1]?.colorId + 1 || 1;
              const newColorItem = {
                colorId: lastColorId,
                colorName: "Yeni Renk",
              };
              setColors([...colors, newColorItem]);
              saveColor(newColorItem.colorName);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Renk Ekle
          </Button>
          {colors.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-flow-row-dense grid-cols-2">
                <p>Renk</p>
                <p>İşlemler</p>
              </div>
              {colors.map((color) => {
                return (
                  <div
                    key={color.colorId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={color.colorId}
                        type={"text"}
                        value={color.colorName}
                        onChange={(e) => {
                          let newColorList = [...colors];
                          let _color = newColorList.find(
                            (c) => c.colorId === color.colorId
                          );
                          _color.colorName = e.target.value;
                          setColors(newColorList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateColor(color.colorId, color.colorName);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={"Kaydet"}
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteColor(color.colorId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>

        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4">
          <h4 className="text-lg">Açıklamalar</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastDescriptionId =
                descriptions[descriptions.length - 1]?.descriptionId + 1 || 1;
              const newDescriptionItem = {
                descriptionId: lastDescriptionId,
                descriptionText: "Yeni Açıklama",
              };
              setDescriptions([...colors, newDescriptionItem]);
              saveDescription(newDescriptionItem.descriptionText);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Açıklama Ekle
          </Button>
          {descriptions.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-flow-row-dense grid-cols-2">
                <p>Açıklama</p>
                <p>İşlemler</p>
              </div>
              {descriptions.map((description) => {
                return (
                  <div
                    key={description.descriptionId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={description.descriptionId}
                        type={"text"}
                        value={description.descriptionText}
                        onChange={(e) => {
                          let newDescriptionList = [...descriptions];
                          let _description = newDescriptionList.find(
                            (d) => d.descriptionId === description.descriptionId
                          );
                          _description.descriptionText = e.target.value;
                          setDescriptions(newDescriptionList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateDescription(
                            description.descriptionId,
                            description.descriptionText
                          );
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={"Kaydet"}
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteDescription(description.descriptionId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>

        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4">
          <h4 className="text-lg">Hazırlayan</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastCreatorId =
                creators[creators.length - 1]?.creatorId + 1 || 1;
              const newCreatorItem = {
                creatorId: lastCreatorId,
                creatorName: "Yeni Hazırlayan Kişi",
              };

              setCreators([...creators, newCreatorItem]);
              saveCreator(newCreatorItem.creatorName);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Hazırlayan Ekle
          </Button>
          {creators.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-flow-row-dense grid-cols-2">
                <p>Hazırlayan</p>
                <p>İşlemler</p>
              </div>
              {creators.map((creator) => {
                return (
                  <div
                    key={creator.creatorId}
                    className={` grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={creator.creatorId}
                        type={"text"}
                        value={creator.creatorName}
                        onChange={(e) => {
                          let newCreatorList = [...creators];
                          let _creator = newCreatorList.find(
                            (c) => c.creatorId === creator.creatorId
                          );
                          _creator.creatorName = e.target.value;
                          setCreators(newCreatorList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateCreator(creator.creatorId, creator.creatorName);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={"Kaydet"}
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteCreator(creator.creatorId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>
        <div className="px-6 py-4 border border-spacing-2 border-gray-600 rounded space-y-4">
          <h4 className="text-lg">Ağaç Durumları</h4>
          <Button
            appearance={"primary"}
            onClick={() => {
              const lastTreeStatusId =
                treeStatuses[treeStatuses.length - 1]?.treeStatusId + 1 || 1;
              const newTreeStatusItem = {
                treeStatusId: lastTreeStatusId,
                treeStatusName: "Yeni Ağaç Durumu",
              };

              setTreeStatuses([...treeStatuses, newTreeStatusItem]);
              saveTreeStatus(newTreeStatusItem.treeStatusName);
            }}
          >
            <AiOutlinePlus color="white" size={"16px"} />
            Yeni Ağaç Durumu Ekle
          </Button>
          {treeStatuses.length > 0 ? (
            <div className="flex flex-col">
              <div className="grid grid-flow-row-dense grid-cols-2">
                <p>Ağaç Durumu</p>
                <p>İşlemler</p>
              </div>
              {treeStatuses.map((treeStatus) => {
                return (
                  <div
                    key={treeStatus.treeStatusId}
                    className={` 
                    grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4`}
                  >
                    <div className="flex items-center justify-between">
                      <EditableText
                        id={treeStatus.treeStatusId}
                        type={"text"}
                        value={treeStatus.treeStatusName}
                        onChange={(e) => {
                          console.log("e");
                          let newTreeStatusList = [...treeStatuses];
                          let _treeStatus = newTreeStatusList.find(
                            (t) => t.treeStatusId === treeStatus.treeStatusId
                          );
                          _treeStatus.treeStatusName = e.target.value;
                          setTreeStatuses(newTreeStatusList);
                        }}
                      />
                    </div>
                    <div className="flex flex-row space-x-4 ">
                      <AiOutlineSave
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          updateTreeStatus(
                            treeStatus.treeStatusId,
                            treeStatus.treeStatusName
                          );
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title={"Kaydet"}
                      />
                      <AiOutlineDelete
                        size={"24px"}
                        color="white"
                        className="hover:cursor-pointer hover:animate-pulse "
                        onClick={() => {
                          deleteTreeStatus(treeStatus.treeStatusId);
                        }}
                        data-bs-toggle="tooltip"
                        data-bs-placement="right"
                        title="Sil"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Alert apperance={"warning"}>Veriler Henüz Girilmemiş!</Alert>
          )}
        </div>
      </div>

      {/* descriptions */}
      {/* option */}
      {/* creator  */}
      {/* thick */}
      {/* wax */}
      {/* tree status */}
    </div>
  );
}

export default ConfigurationsPage;
