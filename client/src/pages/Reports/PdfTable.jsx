import { StyleSheet, Text, View } from "@react-pdf/renderer";
import React from "react";

const styles = StyleSheet.create({
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
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#bfbfbf",
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  tableCol: {
    width: "25%",
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
});

function PdfTable({ data, headers }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableRow}>
        {headers.map((header, index) => (
          <View
            style={[
              styles.tableColHeader,
              { width: `${100 / headers.length}%` },
            ]}
            key={index}
          >
            <Text style={styles.tableCellHeader}>{header.label}</Text>
          </View>
        ))}
      </View>
      {data.map((row, index) => (
        <View style={styles.tableRow} key={index}>
          {headers.map((header, index) => (
            <View
              style={[styles.tableCol, { width: `${100 / headers.length}%` }]}
              key={index}
            >
              <Text style={styles.tableCell}>{row[header.key]}</Text>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default PdfTable;
