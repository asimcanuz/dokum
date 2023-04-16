import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Header";
import MadenAyarlamaRaporu from "./MadenAyarlamaRaporu";
import Alert from "../../components/Alert/Alert";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";

const reports = [
  {
    title: "Maden Ayarlama Raporu",
    src: "madenAyarlamaRaporu",
  },
  {
    title: "Müşteri Adet Sıralı Maden Ayarlama Raporu",
    src: "musteriAdetSiraliMadenAyarlamaRaporu",
  },
  {
    title: "Müşteri Sipariş Raporu",
    src: "musteriSiparisRaporu",
  },
  {
    title: "Maden Ağırlık Genel Raporu (Tablo)",
    src: "madenAgirlikGenelRaporuTablo",
  },
  {
    title: "Maden Ağırlık Genel Raporu (Grafik)",
    src: "madenAgirlikGenelRaporuGrafik",
  },
  {
    title: "Ağaç Performans Raporu",
    src: "agacPerformansRaporu",
  },
];

function ReportsPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobGroups, setJobGroups] = useState([]);

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedJobGroup, setSelectedJobGroup] = useState(null);
  const renderReportPage = (report) => {
    if (report === "madenAyarlamaRaporu") {
      return (
        <MadenAyarlamaRaporu
          selectedJobGroup={selectedJobGroup}
          setSelectedJobGroup={setSelectedJobGroup}
          jobGroups={jobGroups}
        />
      );
    } else {
      return <Alert apperance={"warning"}>Sol Menüden rapor seçiniz!</Alert>;
    }
  };
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

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

    isMounted && getJobGroups();
    return () => {
      isMounted = false;
      isMounted && controller.abort();
    };
  }, []);

  return (
    <div className="space-y-4">
      <Header
        title={"Rapor"}
        description={
          "Raporlarınızı buradan inceleyebilirsiniz ve indirebilirsiniz."
        }
      />
      <div className="space-x-3 grid grid-cols-12">
        {/* menü şeklinde rapoların tip listesi */}
        <div className="flex flex-col space-y-1 col-span-2  ">
          <ul
            className="mr-4 flex list-none flex-col flex-wrap bg-slate-50 "
            role="tablist"
          >
            {reports.map((report, index) => (
              <li role="presentation" key={index} className="flex-grow ">
                <div
                  className={`${
                    selectedReport === report.src
                      ? "border-b border-blue-600"
                      : ""
                  } my-2 block border-x-0 border-b-2 border-t-0 border-transparent pr-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight text-neutral-500 hover:isolate hover:border-transparent hover:bg-neutral-100 
                  focus:isolate focus:border-transparent dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400`}
                  onClick={() => {
                    setSelectedReport(report.src);
                  }}
                >
                  {report.title}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-10">{renderReportPage(selectedReport)}</div>
      </div>
    </div>
  );
}

export default ReportsPage;
