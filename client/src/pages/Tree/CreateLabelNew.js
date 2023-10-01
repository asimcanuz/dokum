import React, {Fragment, useEffect, useRef, useState} from 'react';
import {Page, Text, View, Document, StyleSheet, PDFViewer, Font} from '@react-pdf/renderer';
import Button from '../../components/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useLocation, useNavigate} from 'react-router-dom';
import {Endpoints} from '../../constants/Endpoints';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';

// Herma 5051 etiket boyutları (mm cinsinden)
//const labelWidth = 50.0;
//const labelHeight = 26.2;
const labelWidth = 48.5;
const labelHeight = 25.4;

// Sayfa boyutları (A4)
const pageWidth = 210; // Sağ ve sol kenarlarda 8.48mm boşluk bırakılıyor
const pageHeight = 297; // Üst ve alt kenarlarda 8.8mm boşluk bırakılıyor

// Her satırda 4 etiket, toplamda 11 satır
const labelsPerRow = 4;
const labelsPerColumn = 11;

const styles = StyleSheet.create({
  page: {

    fontFamily: 'Roboto',
    fontSize: '8pt',
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: `${pageWidth}mm`,
    height: `${pageHeight}mm`,
    marginLeft: '8mm', // Sol kenar boşluğu
  //  marginRight: '8mm', // Sağ kenar boşluğu
   marginTop: '8.8mm', // Üst kenar boşluğu
  }, section: {

   // flexGrow: 1,
  },


});
// Register Font
Font.register({
  family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf',
});

const Box = ({children}) => {
  return (<View
    wrap={false}
    // debug={true}
    style={{
      // sayfanın 4 eşit parçasına bölünmesi için
      //  border: '1px solid black',
      width: `${labelWidth}mm`,
      height: `${labelHeight}mm`,
    //  padding: '0.3mm',
     // display: 'flex',
   //   flexDirection: 'column',
   //   justifyContent: 'flex-start',
    //  border: '1px solid black',
      margin: '0px',

    }}
  >
    {children}
  </View>);
};

const MyDocument = ({data}) => {
  return (<Document>
    <Page size='A4' style={styles.page}>
      ´{Object.keys(data).map((key, index1) => {
      return Object.keys(data[key]).map((key2, index) => {
        return <Box>
          <Text style={{
            textAlign: 'center', fontWeight: 'bold', borderBottom: '1px solid black', fontSize: '10pt'
          }}>
            {key
              .slice(0, key.indexOf('#') === -1 ? key.length : key.indexOf('#'))
              .slice(0, 17)}
          </Text>
          <Text style={{
            fontSize: '9pt',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: 0,
            margin: 0,
            borderBottom: '1px solid black',

          }}>
            {key2}
          </Text>
          <View
            style={{
              display: 'flex', flexDirection: 'row', flexGrow: 1
            }}
          >
            <View
              style={{
                width: '100%', display: 'flex', flexDirection: 'column',
              }}
            >
              <View
                style={{
                  borderBottom: '1px solid black', textAlign: 'center',

                }}
              >
                <Text>B</Text>
              </View>
              <View style={{textAlign: 'center'}}>
                <Text>

                  {data[key][key2]['Beyaz'] !== undefined
                    ? data[key][key2]['Beyaz'].map((item, index) => {
                      if (index > 19) {
                        return '';
                      }
                      return index === data[key][key2]['Beyaz']?.length - 1
                        ? item
                        : index === 19
                          ? item
                          : item + ',';
                    })
                    : ''}
                </Text>
              </View>
            </View>
            <View
              style={{
                width: '100%', borderRight: '1px solid black', borderLeft: '1px solid black',

              }}
            >
              <View
                style={{
                  borderBottom: '1px solid black', textAlign: 'center',
                }}
              >
                <Text>K</Text>
              </View>
              <View
                style={{
                  textAlign: 'center', overflow: 'hidden',
                }}
              >
                <Text>
                  {data[key][key2]['Kırmızı'] !== undefined
                    ? data[key][key2]['Kırmızı'].map((item, index) => {
                      if (index > 19) {
                        return '';
                      }
                      return index === data[key][key2]['Kırmızı']?.length - 1
                        ? item
                        : index === 19
                          ? item
                          : item + ',';
                    })
                    : ''}
                </Text>
              </View>
            </View>
            <View style={{width: '100%'}}>
              <View
                style={{
                  borderBottom: '1px solid black', textAlign: 'center',
                }}
              >
                <Text>Y</Text>
              </View>
              <View style={{textAlign: 'center', flexGrow: 0}}>
                <Text>
                  {data[key][key2]['Yeşil'] !== undefined
                    ? data[key][key2]['Yeşil'].map((item, index) => {
                      if (index > 19) {
                        return '';
                      }

                      return index === data[key][key2]['Yeşil']?.length - 1
                        ? item
                        : index === 19
                          ? item
                          : item + ',';
                    })
                    : ''}
                </Text>
              </View>
            </View>
          </View>
        </Box>
      });
    })

    }


    </Page>
  </Document>);
};

export default function CreateLabelNew({open, toggle, jobGroupId}) {
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
          }, signal: controller.signal,
        });
        // data'yı sırala
        var ordered = {};
        Object.keys(res.data.ordersByCustomer).forEach(function (key) {
          Object.keys(res.data.ordersByCustomer[key]).forEach(function (key2, index) {
            // key2 gelince yeni ordered[key] oluştur
            if (ordered[key] === undefined) {
              ordered[key] = {};
              ordered[key][key2] = res.data.ordersByCustomer[key][key2];
            } else {
              ordered[key + `#${index}#`] = {};
              ordered[key + `#${index}#`][key2] = res.data.ordersByCustomer[key][key2];
            }
            // ordered key varsa yeni bir tane daha ekle
          });
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
        setData(sortedObj);
      } catch (error) {
        console.error(error);
        navigate('/login', {state: {from: location}, replace: true});
      }
    };

    getCreateLabel();
    return () => controller.abort();
  }, [jobGroupId]);

  return (<Modal open={open} size={'normal'}>
    <ModalHeader title={'Etiket Oluştur'} toogle={toggle}/>
    <ModalBody>
      {Object.keys(data).length > 0 && (<Fragment>
        <PDFViewer style={{width: '720px', height: '720px'}}>
          <MyDocument data={data}/>
        </PDFViewer>
      </Fragment>)}
    </ModalBody>
    <ModalFooter>
      <Button appearance={'danger'} onClick={toggle}>
        Kapat
      </Button>
    </ModalFooter>
  </Modal>);
}
