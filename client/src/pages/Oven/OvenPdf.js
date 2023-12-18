import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: '9pt',
    margin: 10,
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
  },

  tableContainer: {
    width: '33%',
    height: '90%',
    display: 'flex',
    padding: 10,
    flexDirection: 'column',
  },
});
// Register Font
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf',
});

function ListTable({ liste, sira, konum }) {
  return (
    <View style={{ height: '50%' }}>
      <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
        {sira + ' - ' + konum.toLocaleUpperCase()}
      </Text>

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          width: '100%',
          border: '1px solid black',
          borderBottom: 0,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottom: '1px solid black',
            width: '100%',
          }}
        >
          <Text
            style={{
              width: '33.33333333333333%',
              textAlign: 'center',
            }}
          >
            Konum
          </Text>
          <Text
            style={{
              width: '33.33333333333333%',
              borderLeft: '1px solid black',
              textAlign: 'center',

              borderRight: '1px solid black',
            }}
          >
            Ağaç Numarası
          </Text>
          <Text
            style={{
              width: '33.33333333333333%',
              textAlign: 'center',
            }}
          >
            Yerleşmesi Gereken
          </Text>
        </View>
        {liste.length === 0 && (
          <View style={{ alignItems: 'center', textAlign: 'center' }}>
            <Text style={{ alignItems: 'center', textAlign: 'center', fontWeight: 'bold' }}>
              Fırın boştur
            </Text>
          </View>
        )}
        {liste.map((firin, index) => {
          return (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                fontSize: '7pt',
                borderBottom: '1px solid black',

                width: '100%',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <Text
                  style={{
                    width: '33.333333333333%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {index + 1 > 13 ? index + 1 + ' iç' : index + 1}
                </Text>
                <Text
                  style={{
                    width: '33.33333333333333333%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderLeft: '1px solid black',
                    borderRight: '1px solid black',
                  }}
                >{firin.treeNo}
  
                </Text>

                <Text
                  style={{
                    width: '33.33333333%',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {firin.yerlesmesiGerekenFirin || firin.yerlesmesiGerekenFirin !== ''
                    ? firin.yerlesmesiGerekenFirin
                    : '-'}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function OvenPdf({ firinListesi, erkenGrupDisabled, selectedJobGroupName }) {
  let toplam =
    firinListesi[1].ust.length +
    firinListesi[1].alt.length +
    firinListesi[2].ust.length +
    firinListesi[2].alt.length +
    firinListesi[3].ust.length +
    firinListesi[3].alt.length;
  return (
    <Document>
      <Page size={'A4'} orientation='landscape' style={styles.page}>
        <View
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            padding: 10,
          }}
        >
          <Text>
            Toplam: {toplam} Ağaç / İş Grubu : {selectedJobGroupName}
          </Text>
        </View>
        <View style={{ display: 'flex', flexDirection: 'row' }}>
          <View style={styles.tableContainer}>
            <ListTable konum={'UST'} sira={1} liste={firinListesi[1].ust} />
            <ListTable konum={'ALT'} sira={1} liste={firinListesi[1].alt} />
          </View>
          <View style={styles.tableContainer}>
            <ListTable konum={'UST'} sira={2} liste={firinListesi[2].ust} />
            <ListTable konum={'ALT'} sira={2} liste={firinListesi[2].alt} />
          </View>
          <View style={styles.tableContainer}>
            <ListTable konum={'UST'} sira={3} liste={firinListesi[3].ust} />
            <ListTable konum={'ALT'} sira={3} liste={firinListesi[3].alt} />
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default OvenPdf;
