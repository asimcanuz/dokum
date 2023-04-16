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
    const fetchData = async () => {
      const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        params: {
          jobGroupId: selectedJobGroup,
        },
      });
      setTrees(res.data.trees);
      setLoading(false);
    };
    selectedJobGroup !== null && fetchData();
  }, [selectedJobGroup]);

  return (
    <div className="flex flex-col">
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
              <PDFViewer className="w-full" style={{ height: "70vh" }}>
                <MadenAyarlamaRaporuPDF trees={trees} />
              </PDFViewer>
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

const MadenAyarlamaRaporuPDF = ({ trees }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );
};

export default MadenAyarlamaRaporu;
