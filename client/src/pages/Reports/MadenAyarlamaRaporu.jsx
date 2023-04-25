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

function MadenAyarlamaRaporu({
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
        label: "No: " + jobGroup.number,
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
                  <MadenAyarlamaRaporuPDF
                    trees={trees}
                    jobGroup={getJobGroupValue()}
                  />
                </PDFViewer>
              ) : (
                <Alert apperance={"warning"}>
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
    fontSize: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 2,
    fontSize: 8,
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
    alignItems: "center",
    justifyContent: "center",
    height: "32px",
  },
  tableCol: {
    height: "50px",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  tableCellHeader: {
    margin: "auto",
    marginTop: 5,
    fontSize: 8,
    textAlign: "center",
  },
  tableCell: {
    fontSize: 7,
    minHeight: "40px",
    // textAlign: "center",
    // backgroundColor: "#eaeaea",
  },
  pageNumber: {
    position: "absolute",
    fontSize: 12,
    bottom: 0,
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

const MadenAyarlamaRaporuPDF = ({ trees, jobGroup }) => {
  let mineralWaxTotalWeights = {};
  const groupTrees = () => {
    const groupedTrees = [];

    // mineralWaxTotalWeights ["option.optionText"] = {totalMineralWeight: 0, totalWaxWeight: 0}

    // option.optionText'e göre grupla
    trees.forEach((tree, index) => {
      console.log(tree);
      if (mineralWaxTotalWeights[tree["option.optionText"]] === undefined) {
        mineralWaxTotalWeights[tree["option.optionText"]] = {
          totalMineralWeight: tree.mineralWeight,
          totalWaxWeight: tree.waxWeight,
        };
      } else {
        mineralWaxTotalWeights[tree["option.optionText"]] = {
          totalMineralWeight:
            mineralWaxTotalWeights[tree["option.optionText"]]
              .totalMineralWeight + tree.mineralWeight,
          totalWaxWeight:
            mineralWaxTotalWeights[tree["option.optionText"]].totalWaxWeight +
            tree.waxWeight,
        };
      }
      if (index !== 0) {
        if (
          trees[index - 1] !== undefined &&
          trees[index - 1]["option.optionText"] !== tree["option.optionText"]
        ) {
          groupedTrees.push([tree]);
        } else {
          // eklenen ağaç uzunluğu max 20 olunca yeni sayfaya geç

          if (groupedTrees.length === 0) {
            groupedTrees.push([tree]);
          } else {
            if (groupedTrees[groupedTrees.length - 1].length === 15) {
              groupedTrees.push([tree]);
            } else {
              groupedTrees[groupedTrees.length - 1].push(tree);
            }
          }

          // if (groupedTrees[groupedTrees.length - 1].length === 20) {
          //   groupedTrees.push([tree]);
          // } else {
          //   groupedTrees[groupedTrees.length - 1].push(tree);
          // }
        }
      } else {
        groupedTrees.push([tree]);
      }
    });

    return groupedTrees;
  };

  const groupedTrees = groupTrees();
  console.log(mineralWaxTotalWeights);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {groupedTrees !== null &&
          groupedTrees.map((groupedTree, index) => {
            return (
              <View break={index > 0}>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View fixed>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {jobGroup.label}
                    </Text>
                  </View>
                  <View fixed>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      {groupedTree[0]["option.optionText"]}
                    </Text>
                  </View>
                  <View fixed style={{ display: "flex", flexDirection: "row" }}>
                    <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                      Toplam Mum Ağırlık :
                      {
                        mineralWaxTotalWeights[
                          groupedTree[0]["option.optionText"]
                        ].totalWaxWeight
                      }
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        marginLeft: "12px",
                      }}
                    >
                      Toplam Maden Ağırlık :
                      {
                        mineralWaxTotalWeights[
                          groupedTree[0]["option.optionText"]
                        ].totalMineralWeight
                      }
                    </Text>
                  </View>
                </View>
                <View style={styles.table}>
                  <View style={styles.tableRow} fixed>
                    <View style={[styles.tableColHeader, { width: 20 }]}>
                      <Text style={styles.tableCellHeader}>Ağaç No</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 90 }]}>
                      <Text style={styles.tableCellHeader}>Ağaç Tipi</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 30 }]}>
                      <Text style={styles.tableCellHeader}>Müş. Adet</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 35 }]}>
                      <Text style={styles.tableCellHeader}>Ayar</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 40 }]}>
                      <Text style={styles.tableCellHeader}>Kalınlık</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 30 }]}>
                      <Text style={styles.tableCellHeader}>Renk</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 40 }]}>
                      <Text style={styles.tableCellHeader}>Mum Ağırlık</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 40 }]}>
                      <Text style={styles.tableCellHeader}>Maden Ağırlık</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 79 }]}>
                      <Text style={[styles.tableCellHeader]}>Gelen Maden</Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 79 }]}>
                      <Text style={styles.tableCellHeader}>
                        Gönderilen Maden
                      </Text>
                    </View>
                    <View style={[styles.tableColHeader, { width: 79 }]}>
                      <Text style={styles.tableCellHeader}>Cüruf</Text>
                    </View>
                  </View>
                  {groupedTree.map((row, index) => {
                    return (
                      <View style={styles.tableRow} key={index} wrap={false}>
                        <View
                          style={[styles.tableCol, { width: 20 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["treeNo"]}</Text>
                        </View>

                        <View
                          style={[
                            styles.tableCol,
                            {
                              width: 90,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "flex-start",
                            },
                          ]}
                        >
                          <View
                            style={[
                              {
                                display: "flex",
                                flexDirection: "row",
                              },
                            ]}
                          >
                            {row["isImmediate"] ? (
                              <Text wrap style={{ color: "red" }}>
                                (A)
                              </Text>
                            ) : null}

                            {row["isOld"] ? (
                              <Text wrap style={{ color: "red" }}>
                                (E)
                              </Text>
                            ) : null}
                            <Text wrap>{row["treeType"]}</Text>
                          </View>

                          <View style={{ overflow: "hidden" }}>
                            <Text
                              style={{
                                color: "blue",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {row["desc"] !== null
                                ? row["desc"].slice(0, 65)
                                : ""}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 30 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["customerQuantity"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 35 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["option.optionText"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 40 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["thick.thickName"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 30 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["color.colorName"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 40 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["waxWeight"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 40 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{row["mineralWeight"]}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 79 }]}
                          wrap={false}
                        >
                          <Text wrap={false}>{""}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 79 }]}
                          key={index}
                          wrap={false}
                        >
                          <Text wrap={false}>{""}</Text>
                        </View>
                        <View
                          style={[styles.tableCol, { width: 79 }]}
                          key={index}
                          wrap={false}
                        >
                          <Text wrap={false}>{""}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
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

export default MadenAyarlamaRaporu;
