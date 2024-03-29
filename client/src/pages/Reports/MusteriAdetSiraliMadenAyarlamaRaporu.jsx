import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { Document, Font, Page, PDFViewer, StyleSheet, Text, View } from '@react-pdf/renderer';
import Alert from '../../components/Alert/Alert';

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
        label: 'No: ' + jobGroup.number,
      };
    });
  }, [jobGroups]);

  const getJobGroupValue = () => {
    if (selectedJobGroup !== '') {
      return jobGroupOptions.find((option) => option.value === selectedJobGroup);
    } else {
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      const res = await axiosPrivate.get(Endpoints.REPORTS.MUSTERIADETSIRALIMADENAYARLAMARAPORU, {
        params: {
          jobGroupId: selectedJobGroup,
        },
        signal: controller.signal,
      });

      if (isMounted) {
        setTrees(res.data.musteriAdetSiraliMadenAyarlamaRaporu);
        setLoading(false);
      }
    };
    selectedJobGroup !== null && fetchData();
  }, [selectedJobGroup]);

  return (
    <div className='flex flex-col space-y-4'>
      <div className=''>
        <Select
          className='w-1/2'
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
                <PDFViewer className='w-full' style={{ height: '79vh' }}>
                  <MadenAyarlamaRaporuPDF trees={trees} jobGroup={getJobGroupValue()} />
                </PDFViewer>
              ) : (
                <Alert apperance={'warning'}>Seçilen iş grubunda ağaç girilmemiş.</Alert>
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
    fontFamily: 'Roboto',
    fontSize: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 8,
    fontSize: 8,
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    fontWeight: 'medium',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '32px',
  },
  tableCol: {
    height: '32px',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tableCellHeader: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 8,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 7,
    minHeight: '40px',
    // textAlign: "center",
    // backgroundColor: "#eaeaea",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 12,
    bottom: 0,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'grey',
  },
});
// Register Font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf',
});

const MadenAyarlamaRaporuPDF = ({ trees, jobGroup }) => {
  let mineralWaxTotalWeights = {};

  const groupTrees = () => {
    let groupedTrees = [];

    // mineralWaxTotalWeights ["option.optionText"] = {totalMineralWeight: 0, totalWaxWeight: 0}

    // option.optionText'e göre grupla

    trees.forEach((tree, index) => {
      const key = tree['option.optionText'];

      if (mineralWaxTotalWeights[key] === undefined) {
        mineralWaxTotalWeights[key] = {
          totalMineralWeight: tree.mineralWeight,
          totalWaxWeight: tree.waxWeight,
        };
      } else {
        mineralWaxTotalWeights[key] = {
          totalMineralWeight: mineralWaxTotalWeights[key].totalMineralWeight + tree.mineralWeight,
          totalWaxWeight: mineralWaxTotalWeights[key].totalWaxWeight + tree.waxWeight,
        };
      }

      if (!groupedTrees[key]) {
        // Grup henüz oluşturulmamışsa, yeni bir dizi oluşturun
        groupedTrees[key] = [];
      }
      // Ağacı ilgili gruba ekleyin
      groupedTrees[key].push(tree);
    });

    groupedTrees = Object.keys(groupedTrees).map((key) => ({
      optionText: key,
      trees: groupedTrees[key],
    }));

    const eightAyarTrees = [];
    const gumusTrees = [];
    const bronzTrees = [];
    const otherTrees = [];
    // Her ağacı optionText'e göre ilgili diziye ekleyin

    groupedTrees.forEach((group) => {
      switch (group.optionText.toLowerCase()) {
        case '8 ayar':
          eightAyarTrees.push(...group.trees);
          break;
        case 'gümüş':
          gumusTrees.push(...group.trees);
          break;
        case 'bronz':
          bronzTrees.push(...group.trees);
          break;
        default:
          otherTrees.push(group);
          break;
      }
    });
    let revisedGroupedTreesArray = otherTrees;
    if (eightAyarTrees.length > 0) {
      revisedGroupedTreesArray.push({
        optionText: '8 Ayar',
        trees: eightAyarTrees,
      });
    }
    if (gumusTrees.length > 0) {
      revisedGroupedTreesArray.push({
        optionText: 'Gümüş',
        trees: gumusTrees,
      });
    }
    if (bronzTrees.length > 0) {
      revisedGroupedTreesArray.push({
        optionText: 'Bronz',
        trees: bronzTrees,
      });
    }

    revisedGroupedTreesArray.forEach((group) => {
      group.trees?.sort((a, b) => {
        if (a['color.colorName'] < b['color.colorName']) {
          return -1;
        }
        if (a['color.colorName'] < b['color.colorName']) {
          return 1;
        }
        return 0;
      });
    });

    return revisedGroupedTreesArray;
  };

  const groupedTree = groupTrees();
  var styler =
    groupedTree.optionText !== 'Gümüş' && groupedTree.optionText !== 'Bronz'
      ? "marginTop:'100px'"
      : '';
  return (
    <Document>
      <Page size='A4' style={styles.page} wrap>
        {groupedTree.length > 0
          ? groupedTree?.map((groupedTree, index) => {
              const breakLine =
                index > 0 &&
                groupedTree.optionText !== 'Gümüş' &&
                groupedTree.optionText !== 'Bronz';
              return (
                <View key={index} wrap={true} break={breakLine}>
                  <View
                    style={{
                      styler,
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '10px',
                    }}
                    wrap={true}
                  >
                    <View fixed>
                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {jobGroup.label} - (Maden Ayarlama)
                      </Text>
                    </View>
                    <View fixed>
                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        {groupedTree['optionText']}
                      </Text>
                    </View>
                    <View fixed style={{ display: 'flex', flexDirection: 'row' }}>
                      <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                        Mum Ağırlık :
                        {mineralWaxTotalWeights[groupedTree['optionText']]?.totalWaxWeight}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: 'bold',
                          marginLeft: '12px',
                        }}
                      >
                        Maden Ağırlık :
                        {mineralWaxTotalWeights[groupedTree['optionText']]?.totalMineralWeight}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.table}>
                    <View style={styles.tableRow} fixed>
                      <View style={[styles.tableColHeader, { width: 20 }]}>
                        <Text style={styles.tableCellHeader}>Ağaç No</Text>
                      </View>
                      <View style={[styles.tableColHeader, { width: 117 }]}>
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
                      <View style={[styles.tableColHeader, { width: 105 }]}>
                        <Text style={[styles.tableCellHeader]}></Text>
                      </View>

                      <View style={[styles.tableColHeader, { width: 105 }]}>
                        <Text style={styles.tableCellHeader}></Text>
                      </View>
                    </View>
                    {groupedTree.trees.map((row, index) => {
                      return (
                        <View style={styles.tableRow} key={index} wrap={false}>
                          <View style={[styles.tableCol, { width: 20 }]} wrap={false}>
                            <Text wrap={false}>{row['treeNo']}</Text>
                          </View>

                          <View
                            style={[
                              styles.tableCol,
                              {
                                width: 117,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                              },
                            ]}
                          >
                            <View
                              style={[
                                {
                                  display: 'flex',
                                  flexDirection: 'row',
                                },
                              ]}
                            >
                              {row['isImmediate'] ? (
                                <Text wrap style={{ color: 'red' }}>
                                  (A)
                                </Text>
                              ) : null}

                              {row['isOld'] ? (
                                <Text wrap style={{ color: 'red' }}>
                                  (E)
                                </Text>
                              ) : null}
                              <Text wrap>{row['treeType']}</Text>
                            </View>

                            <View style={{ overflow: 'hidden' }}>
                              <Text
                                style={{
                                  color: 'blue',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {row['desc'] !== null ? row['desc'].slice(0, 65) : ''}
                              </Text>
                            </View>
                          </View>
                          <View style={[styles.tableCol, { width: 30 }]} wrap={false}>
                            <Text wrap={false}>{row['customerQuantity']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 35 }]} wrap={false}>
                            <Text wrap={false}>{row['option.optionText']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 40 }]} wrap={false}>
                            <Text wrap={false}>{row['thick.thickName']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 30 }]} wrap={false}>
                            <Text wrap={false}>{row['color.colorName']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 40 }]} wrap={false}>
                            <Text wrap={false}>{row['waxWeight']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 40 }]} wrap={false}>
                            <Text wrap={false}>{row['mineralWeight']}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 105 }]} wrap={false}>
                            <Text wrap={false}>{''}</Text>
                          </View>
                          <View style={[styles.tableCol, { width: 105 }]} key={index} wrap={false}>
                            <Text wrap={false}>{''}</Text>
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </View>
              );
            })
          : null}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default MusteriAdetSiraliMadenAyarlamaRaporu;
