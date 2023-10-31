import React, { Fragment, useEffect, useMemo, useState } from 'react';
import Select from 'react-select';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

import { Endpoints } from '../../constants/Endpoints';
import { Document, Font, PDFViewer, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import Alert from '../../components/Alert/Alert';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { statusColorStyle } from '../../utils/StatusColor';
import { Workbook } from 'exceljs';

// import PdfTable from "./PdfTable";
const days = ['Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct', 'Pz'];
const months = [
  'Ocak',
  'Şubat',
  'Mart',
  'Nisan',
  'Mayıs',
  'Haziran',
  'Temmuz',
  'Ağustos',
  'Eylül',
  'Ekim',
  'Kasım',
  'Aralık',
];

const locale = {
  localize: {
    day: (n) => days[n],
    month: (n) => months[n],
  },
  formatLong: {
    date: () => 'mm/dd/yyyy',
  },
};
function MusteriSiparisRaporu() {
  const axiosPrivate = useAxiosPrivate();
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minDate, setMinDate] = useState(new Date());
  const [maxDate, setMaxDate] = useState(new Date());
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const customerOptions = useMemo(() => {
    return customers.map((customer) => {
      return {
        value: customer.customerId,
        label: customer.customerName,
      };
    });
  }, [customers]);

  const getCustomerValue = () => {
    if (selectedCustomer !== '') {
      return customerOptions.find((option) => option.value === selectedCustomer);
    } else {
      return null;
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const res = await axiosPrivate.get(Endpoints.CUSTOMERS.GET_ALL);
      setCustomers(res.data.customers);
    };
    fetchData();
  }, []);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const fetchData = async () => {
      const res = await axiosPrivate.get(Endpoints.REPORTS.MUSTERISIPARISRAPORU, {
        params: {
          customer: selectedCustomer,
          minDate: minDate,
          maxDate: maxDate,
        },
        signal: controller.signal,
      });

      if (isMounted) {
        setTrees(res.data.musteriSiparis);
        setLoading(false);
      }
    };
    selectedCustomer !== null && fetchData();
  }, [selectedCustomer, minDate, maxDate]);

  const exportExcel = () => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Sipariş Raporu');

    worksheet.columns = [
      { header: 'Müşteri', key: 'customer' },
      { header: 'Sipariş Id', key: 'orderId' },
      { header: 'Sipariş Adeti', key: 'orderQuantity' },
      { header: 'İş grubu', key: 'jobGroup' },
      { header: 'Ağaç Id', key: 'treeId' },
      { header: 'Ağaç No', key: 'treeNo' },
      { header: 'Ayar', key: 'option' },
      { header: 'Renk', key: 'color' },
      { header: 'Kalınlık', key: 'thick' },
      { header: 'Durum', key: 'status' },
    ];

    trees.forEach((tree, index) => {
      const cellColor = statusColorStyle(tree['treeStatus.treeStatusName']);

      const newRow = worksheet.addRow({
        customer: tree['orders.customer.customerName'],
        orderId: tree['orders.orderId'],
        orderQuantity: tree['orders.quantity'],
        jobGroup: tree['jobGroup.date'],
        treeId: tree['treeId'],
        treeNo: tree['treeNo'],
        option: tree['option.optionText'],
        color: tree['thick.thickName'],
        thick: tree['color.colorName'],
        status: tree['treeStatus.treeStatusName'],
      });
      newRow.height = '10px';

      newRow.eachCell((cell, colNumber) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: cellColor.replace('#', '') },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'cccccc' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    workbook.xlsx.writeBuffer().then(function (data) {
      const blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'MusteriSiparisRaporu.xlsx';
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className='flex flex-col space-y-4'>
      <div className='flex flex-row space-x-4'>
        <div className='w-1/3 flex flex-col'>
          <label className='text-sm font-semibold'>Müşteri</label>
          <Select
            value={getCustomerValue()}
            options={customerOptions}
            onChange={(e) => {
              setSelectedCustomer(e.value);
            }}
          />
        </div>

        <div className='w-1/3 flex flex-col'>
          <label className='text-sm font-semibold'>Sipariş Başlangıç Tarihi</label>
          <DatePicker
            locale={locale}
            selected={minDate}
            onChange={(date) => setMinDate(date)}
            dateFormat='dd/MM/yyyy'
            maxDate={maxDate}
          />
        </div>
        <div className='w-1/3 flex flex-col'>
          <label className='text-sm font-semibold'>Sipariş Bitiş Tarihi</label>
          <DatePicker
            locale={locale}
            selected={maxDate}
            onChange={(date) => setMaxDate(date)}
            dateFormat='dd/MM/yyyy'
            minDate={minDate}
          />
        </div>
      </div>
      <div>
        {selectedCustomer !== null ? (
          loading ? (
            <div>Loading</div>
          ) : (
            <Fragment>
              {trees.length > 0 ? (
                <Fragment>
                  <button onClick={exportExcel}>Excel indir</button>
                  <PDFViewer className='w-full' style={{ height: '79vh' }}>
                    <MusteriSiparisPdf trees={trees} />
                  </PDFViewer>
                </Fragment>
              ) : (
                <Alert apperance={'warning'}>Seçilen tarih aralığında veri bulunamadı.</Alert>
              )}
            </Fragment>
          )
        ) : (
          <Alert apperance={'warning'}>Müşteri Seçiniz!</Alert>
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
    fontSize: 8,
    marginTop: '10px',
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
    width: '9%',
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '9%',
  },
  tableCellHeader: {
    margin: 'auto',
    marginTop: 5,
    fontSize: 8,
    textAlign: 'center',
  },
  tableCell: {
    fontSize: 7,

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

const MusteriSiparisPdf = ({ trees, jobGroup }) => {
  return (
    <Document>
      <Page size='A4' style={styles.page} wrap>
        <View>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          ></View>
          <View style={styles.table}>
            <View style={styles.tableRow} fixed>
              <View style={[styles.tableColHeader, { width: '10%' }]}>
                <Text style={styles.tableCellHeader}>Müşteri</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Sipariş Id</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Sipariş Adeti</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>İş grubu</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Ağaç Id</Text>
              </View>

              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Ağaç No</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Liste No</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Ayar</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Kalınlık</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Renk</Text>
              </View>
              <View style={[styles.tableColHeader]}>
                <Text style={styles.tableCellHeader}>Durum</Text>
              </View>
            </View>
            {trees.map((tree, index) => {
              return (
                <View
                  style={[
                    styles.tableRow,
                    {
                      backgroundColor: statusColorStyle(tree['treeStatus.treeStatusName']),
                    },
                  ]}
                  key={index}
                  wrap={false}
                >
                  <View style={[styles.tableCol, { width: '10%' }]} wrap={false}>
                    <Text wrap={false}>{tree['orders.customer.customerName']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['orders.orderId']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['orders.quantity']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['jobGroup.date']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['treeId']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['treeNo']}</Text>
                  </View>

                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['listNo']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['option.optionText']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['thick.thickName']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['color.colorName']}</Text>
                  </View>
                  <View style={[styles.tableCol]} wrap={false}>
                    <Text wrap={false}>{tree['treeStatus.treeStatusName']}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
};

export default MusteriSiparisRaporu;
