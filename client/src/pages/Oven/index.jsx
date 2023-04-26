import React, { useEffect, useMemo } from "react";
import Header from "../../components/Header";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Alert from "../../components/Alert/Alert";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { agaclariFirinla } from "../../utils/agaclariFirinla";

function OvenMainPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobGroups, setJobGroups] = React.useState([]);
  const [selectedJobGroup, setSelectedJobGroup] = React.useState(null);
  const [trees, setTrees] = React.useState([]);
  const [erkenGrupDisabled, setErkenGrupDisabled] = React.useState(false);
  const [checkedGroup, setCheckedGroup] = React.useState(null);

  // useEffect(() => {
  //   if (localStorage.getItem("selectedJobGroup") !== null) {
  //     setSelectedJobGroup(localStorage.getItem("selectedJobGroup"));
  //   }
  //   if (localStorage.getItem("selectedJobGroup.erkenGrupOlusturulduMu")) {
  //     setErkenGrupDisabled(
  //       localStorage.getItem("selectedJobGroup.erkenGrupOlusturulduMu")
  //     );
  //   }
  // }, []);
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        });

        if (isMounted) {
          setTrees(res.data.trees);
        }
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    const getJobGroups = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal,
        });
        isMounted && setJobGroups(response.data.jobGroupList);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getJobGroups();
    selectedJobGroup && getTrees();

    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, [selectedJobGroup]);

  const jobGroupOptions = useMemo(() => {
    return jobGroups.map((jobGroup) => {
      return {
        value: jobGroup.id,
        label: "No: " + jobGroup.date,
        erkenGrupOlusturulduMu: jobGroup.erkenFırınGrubuOlusturulduMu,
      };
    });
  }, [jobGroups]);
  function onChangeValue(event) {
    setCheckedGroup(event.target.value);
  }

  return (
    <div>
      <section className="space-y-4">
        <Header
          title="Fırın"
          description="Fırınlarınızı bu sayfadan yönetebilirsiniz."
        />

        <div className="space-y-4">
          {/* seçilen iş grubu erkenFırınGrubuOlusturulduMu false ise erken firin oluştur button disabled:false  */}
          <Select
            className="hover:cursor-pointer md:w-1/4"
            options={jobGroupOptions}
            value={
              jobGroupOptions.filter(
                (option) => option.value === selectedJobGroup
              )[0]
            }
            onChange={(e) => {
              e.erkenGrupOlusturulduMu && setCheckedGroup("normal");
              setErkenGrupDisabled(e.erkenGrupOlusturulduMu);
              setSelectedJobGroup(e.value);
              // localStorage.setItem("selectedJobGroup", e.value);
              // localStorage.setItem(
              //   "selectedJobGroup.erkenGrupOlusturulduMu",
              //   e.erkenGrupOlusturulduMu
              // );
            }}
          />
          {!erkenGrupDisabled && selectedJobGroup !== null && (
            <div className="space-y-4 flex flex-col" onChange={onChangeValue}>
              <h2>Fırın Grubu:</h2>
              <div className="space-x-4 flex flex-row">
                <div>
                  <input
                    type="radio"
                    value="erken"
                    name="firinType"
                    id="erkenFirin"
                    disabled={erkenGrupDisabled}
                    checked={checkedGroup === "erken"}
                  />
                  <label htmlFor="erkenFirin"> Erken Fırın Grubu </label>
                </div>
                <div>
                  <input
                    type="radio"
                    id="normalFirin"
                    value="normal"
                    name="firinType"
                    checked={checkedGroup === "normal"}
                  />
                  <label htmlFor="normalFirin"> Normal Fırın Grubu </label>
                </div>
              </div>
              <Button
                appearance={"primary"}
                onClick={() => {
                  agaclariFirinla(trees, checkedGroup);
                }}
              >
                Oluştur
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {trees.length > 0 ? (
            <div>
              {/* <h1 className="text-5xl">Ağaçlar</h1> */}
              <Table>
                <Thead>
                  <Tr>
                    <Th>Ağaç No</Th>
                    <Th>Kalınlık</Th>
                    <Th>Renk</Th>
                    <Th>Ayar</Th>
                    <Th>Oluşturulma Tarihi</Th>
                    <Th>Yerlesmesi Gereken Fırın</Th>
                    <Th>Yerleştiği Fırın</Th>
                    <Th>Erken Fırına Girdi Mi?</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {trees.map((tree) => {
                    return (
                      <Tr key={tree.id}>
                        <Td>{tree.treeNo}</Td>
                        <Td>{tree.thick["thickName"]}</Td>
                        <Td>{tree.color["colorName"]}</Td>
                        <Td>{tree.option["optionText"]}</Td>
                        <Td>{tree.createdAt.slice(11, 19)}</Td>
                        <Td>{tree?.yerlesmesiGereken}</Td>
                        <Td>{tree?.yerlestigiFirin}</Td>

                        <Td>
                          {tree.erkenFirinaGirdiMi ? (
                            <Alert apperance={"success"}>Girdi</Alert>
                          ) : (
                            <Alert apperance={"success"}>Girmedi</Alert>
                          )}
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </div>
          ) : (
            <Alert apperance={"danger"}>
              Seçilen İş Grubuna Ağaç Eklenmemiştir
            </Alert>
          )}
        </div>
      </section>
    </div>
  );
}

export default OvenMainPage;

/*
*const getJobGroups = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal,
        });
        isMounted && setJobGroups(response.data.jobGroupList);
      } catch (err) {
        console.error(err);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };,
* 

*/
