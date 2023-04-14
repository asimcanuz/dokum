import React, { Fragment, useEffect, useRef, useState } from "react";
import ReactPDF, {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  PDFDownloadLink,
  BlobProvider,
  Font,
} from "@react-pdf/renderer";
import Button from "../../components/Button";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../../constants/Endpoints";
import Modal from "../../components/Modal/Modal";
import ModalHeader from "../../components/Modal/ModalHeader";
import ModalBody from "../../components/Modal/ModalBody";
import ModalFooter from "../../components/Modal/ModalFooter";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    fontFamily: "Roboto",
    fontSize: "13px",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});
// Register Font
Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
});

const Box = ({ children }) => {
  return (
    <View
      style={{
        // sayfanın 4 eşit parçasına bölünmesi için
        border: "1px solid black",
        width: "24%",
        margin: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {children}
    </View>
  );
};
const BoxItem = ({ children }) => {
  return (
    <View
      style={{
        borderBottom: "1px solid black",
        display: "flex",
        alignItems: "center",
      }}
    >
      {children}
    </View>
  );
};

const MyDocument = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            padding: "8mm",
            width: "100%",
          }}
        >
          {/* dinamik bir objeyi ekrana yazdır */}

          {Object.keys(data).map((key) => {
            // data?.sort((a, b) => a[key] - b[key]);

            return Object.keys(data[key]).map((key2, index) => {
              return (
                <Box key={index}>
                  <BoxItem>
                    <Text>
                      {key
                        .slice(
                          0,
                          key.indexOf("#") === -1
                            ? key.length
                            : key.indexOf("#")
                        )
                        .toLocaleLowerCase()
                        .slice(0, 17)}
                    </Text>
                  </BoxItem>
                  <BoxItem>
                    <Text>{key2}</Text>
                  </BoxItem>

                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "12px",
                      width: "100%",
                    }}
                  >
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                      >
                        <Text>B</Text>
                      </View>
                      <View style={{ textAlign: "center", fontSize: "13px" }}>
                        <Text>
                          {data[key][key2]["Beyaz"] !== undefined
                            ? data[key][key2]["Beyaz"].map((item, index) => {
                                return index ===
                                  data[key][key2]["Beyaz"]?.length - 1
                                  ? item
                                  : item + ",";
                              })
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        width: "100%",
                        borderRight: "1px solid black",
                        borderLeft: "1px solid black",
                      }}
                    >
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                      >
                        <Text>K</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          fontSize: "13px",
                          overflow: "hidden",
                        }}
                      >
                        <Text>
                          {data[key][key2]["Kırmızı"] !== undefined
                            ? data[key][key2]["Kırmızı"].map((item, index) => {
                                return index ===
                                  data[key][key2]["Kırmızı"]?.length - 1
                                  ? item
                                  : item + ",";
                              })
                            : ""}
                        </Text>
                      </View>
                    </View>
                    <View style={{ width: "100%" }}>
                      <View
                        style={{
                          borderBottom: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        }}
                      >
                        <Text>Y</Text>
                      </View>
                      <View style={{ textAlign: "center", fontSize: "13px" }}>
                        <Text>
                          {data[key][key2]["Yeşil"] !== undefined
                            ? data[key][key2]["Yeşil"].map((item, index) => {
                                return index ===
                                  data[key][key2]["Yeşil"]?.length - 1
                                  ? item
                                  : item + ",";
                              })
                            : ""}
                        </Text>
                      </View>
                    </View>
                    {/* {Object.keys(data[key][key2]).map((key3, index) => {
                      const length = Object.keys(data[key][key2]).length;
                      let borderStyle = {};
                      let bottomBorderStyle = {};
                      if (index !== 0) {
                        borderStyle = {
                          borderBottom: "1px solid black",
                          borderLeft: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        };
                        bottomBorderStyle = {
                          borderLeft: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        };
                      } else {
                        borderStyle = {
                          borderBottom: "1px solid black",
                          textAlign: "center",
                          fontSize: "13px",
                        };
                        bottomBorderStyle = {
                          textAlign: "center",
                          fontSize: "13px",
                        };
                      }

                      return (
                        <View key={index} style={{ width: "100%" }}>
                          <View style={borderStyle}>
                            <Text>{key3.substring(0, 1)}</Text>
                          </View>
                          <View style={bottomBorderStyle}>
                            <Text>{data[key][key2][key3]}</Text>
                          </View>
                        </View>
                      );
                    })} */}
                  </View>
                  {/* <BoxItem>
                    <Text>{key3}</Text>
                  </BoxItem> */}
                </Box>
              );
            });
          })}
        </View>
      </Page>
    </Document>
  );
};

export default function CreateLabel({ open, toggle, jobGroupId }) {
  const [data, setData] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const effectRun = useRef(false);

  // endpoint: /api/createLabel istek at verileri getir.
  useEffect(() => {
    const controller = new AbortController();
    const getCreateLabel = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.CREATELABEL, {
          params: {
            jobGroupId: jobGroupId,
          },
          signal: controller.signal,
        });
        // data'yı sırala
        var ordered = {};
        Object.keys(res.data.ordersByCustomer).forEach(function (key) {
          Object.keys(res.data.ordersByCustomer[key]).forEach(function (
            key2,
            index
          ) {
            // key2 gelince yeni ordered[key] oluştur
            if (ordered[key] === undefined) {
              ordered[key] = {};
              ordered[key][key2] = res.data.ordersByCustomer[key][key2];
            } else {
              ordered[key + `#${index}#`] = {};
              ordered[key + `#${index}#`][key2] =
                res.data.ordersByCustomer[key][key2];
            }
            // ordered key varsa yeni bir tane daha ekle
          });
          console.log(res.data.ordersByCustomer[key]);
        });

        // ordered objesini sırala  key2'ye göre
        const sortedKeys = Object.keys(ordered).sort((a, b) => {
          const a2Key = Object.keys(ordered[a])[0]; // birinci veya ikinci anahtar
          const b2Key = Object.keys(ordered[b])[0]; // birinci veya ikinci anahtar
          return a2Key.localeCompare(b2Key); // 2. anahtara göre karşılaştır
        });
        const sortedObj = {};
        for (let key of sortedKeys) {
          sortedObj[key] = ordered[key];
        }
        console.log(sortedObj);
        setData(sortedObj);
      } catch (error) {
        console.error(error);
        navigate("/login", { state: { from: location }, replace: true });
      }
    };

    getCreateLabel();
    return () => controller.abort();
  }, [jobGroupId]);

  return (
    <Modal open={open} size={"normal"}>
      <ModalHeader title={"Etiket Oluştur"} toogle={toggle} />
      <ModalBody>
        {Object.keys(data).length > 0 && (
          <Fragment>
            <PDFViewer style={{ width: "720px", height: "720px" }}>
              <MyDocument data={data} />
            </PDFViewer>
          </Fragment>
        )}
      </ModalBody>
      <ModalFooter>
        <Button appearance={"danger"} onClick={toggle}>
          Kapat
        </Button>
      </ModalFooter>
    </Modal>
  );
}
