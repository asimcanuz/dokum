import React, { Fragment, useEffect, useMemo, useState } from "react";
import Select from "react-select";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import {
  Document,
  Font,
  PDFViewer,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import Alert from "../../components/Alert/Alert";
// import PdfTable from "./PdfTable";

function MusteriAdetSiraliMadenAyarlamaRaporu({
  selectedJobGroup,
  setSelectedJobGroup,
  jobGroups,
}) {
  const axiosPrivate = useAxiosPrivate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  const jobGroupOptions = useMemo(() => {
    return jobGroups.map((jobGroup) => {
      return {
        value: jobGroup.id,
        label: "No: " + jobGroup.number + " (" + jobGroup.date + ")",
      };
    });
  }, [jobGroups]);

  const getJobGroupValue = () => {
    if (selectedJobGroup !== "") {
      return jobGroupOptions.find(
        (option) => option.value === selectedJobGroup
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      const res = await axiosPrivate.get(
        Endpoints.REPORTS.MADENAYARLAMARAPORU,
        {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        }
      );

      if (isMounted) {
        setTrees(res.data.madenAyarlamaRaporu);
        setLoading(false);
      }
    };
    selectedJobGroup !== null && fetchData();
  }, [selectedJobGroup]);

  return (
    <div className="flex flex-col space-y-4">
      <div className="">
        <Select
          className="w-1/2"
          value={getJobGroupValue()}
          options={jobGroupOptions}
          onChange={(e) => {
            setSelectedJobGroup(e.value);
          }}
        />
      </div>
      <div>
        {selectedJobGroup !== null ? (
          loading ? (
            <div>Loading</div>
          ) : (
            <Fragment>
              {trees.length > 0 ? (
                <PDFViewer className="w-full" style={{ height: "79vh" }}>
                  <MadenAyarlamaRaporuPDF trees={trees} />
                </PDFViewer>
              ) : (
                <Alert apperance={"warning"}>
                  {" "}
                  Seçilen iş grubunda ağaç girilmemiş.
                </Alert>
              )}
            </Fragment>
          )
        ) : (
          <div>rapor yok</div>
        )}
      </div>
    </div>
  );
}
const styles = StyleSheet.create({
  page: {
    fontFamily: "Roboto",
    fontSize: 9,
    padding: 10,
  },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    fontWeight: "medium",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  tableCellHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
    // textAlign: "center",
    // backgroundColor: "#eaeaea",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "grey",
  },
});
// Register Font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
});

const MadenAyarlamaRaporuPDF = ({ trees }) => {
  const mappedHeaders = [
    {
      label: "AğaçNo",
      key: "treeNo",
    },
    {
      label: "Ağaç Tipi",
      key: "treeType",
    },
    {
      label: "Müşteri Adet",
      key: "customerQuantity",
    },
    {
      label: "Ayar",
      key: "option.optionText",
    },
    {
      label: "Kalınlık",
      key: "thick.thickName",
    },
    {
      label: "Renk",
      key: "color.colorName",
    },
    {
      label: "Mum Ağırlık",
      key: "waxWeight",
    },
    {
      label: "Maden Ağırlık",
      key: "mineralWeight",
    },
    {
      label: "Gelen Maden",
      key: "",
    },
    {
      label: "Gönderilen Maden",
      key: "",
    },
    {
      label: "Cüruf",
      key: "",
    },
  ];

  const groupTrees = () => {
    const groupedTrees = [];
    // option.optionText'e göre grupla
    trees.forEach((tree, index) => {
      if (index !== 0) {
        if (
          trees[index - 1] !== undefined &&
          trees[index - 1]["option.optionText"] !== tree["option.optionText"]
        ) {
          groupedTrees.push([tree]);
        } else {
          //groupedTrees[groupedTrees.length - 1] uzunluğu 20 olunca yeni bir array oluştur ve içine tree'yi ekle
          if (groupedTrees[groupedTrees.length - 1].length === 25) {
            groupedTrees.push([tree]);
          } else {
            groupedTrees[groupedTrees.length - 1].push(tree);
          }
        }
      } else {
        groupedTrees.push([tree]);
      }
    });

    return groupedTrees;
  };

  const groupedTrees = groupTrees();

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {groupedTrees.map((groupedTree, index) => {
          return (
            <View style={styles.table} break={index > 0}>
              <View style={styles.tableRow} fixed>
                {mappedHeaders.map((header, index) => (
                  <View
                    style={[
                      styles.tableColHeader,
                      { width: `${100 / mappedHeaders.length}%` },
                    ]}
                    key={index}
                  >
                    <Text style={styles.tableCellHeader}>{header.label}</Text>
                  </View>
                ))}
              </View>
              {groupedTree.map((row, index) => {
                return (
                  <View style={styles.tableRow} key={index} wrap>
                    {mappedHeaders.map((header, index) => (
                      <View
                        style={[
                          styles.tableCol,
                          { width: `${100 / mappedHeaders.length}%` },
                        ]}
                        key={index}
                        wrap
                      >
                        <Text style={styles.tableCell}>{row[header.key]}</Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default MusteriAdetSiraliMadenAyarlamaRaporu;
