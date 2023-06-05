import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Button from '../../components/Button';
import OvenTable from './OvenTable';
import { DataGrid } from 'devextreme-react';
import { Column, Export } from 'devextreme-react/data-grid';
import Firinlar from '../../constants/firinlar';
import { Workbook } from 'exceljs';
import { exportDataGrid } from 'devextreme/excel_exporter';
import { saveAs } from 'file-saver';

const initialFirinListesi = {
  1: {
    ust: [],
    alt: [],
  },
  2: {
    ust: [],
    alt: [],
  },
  3: {
    ust: [],
    alt: [],
  },
};

function OvenMainPage() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [jobGroups, setJobGroups] = React.useState([]);
  const [selectedJobGroup, setSelectedJobGroup] = React.useState(null);
  const [erkenGrupDisabled, setErkenGrupDisabled] = React.useState(false);
  const [checkedGroup, setCheckedGroup] = React.useState(null);
  const [firinListesi, setFirinListesi] = React.useState(initialFirinListesi);
  const [allDisabled, setAllDisabled] = React.useState(false);
  const [trees, setTrees] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const getFirinListesi = async () => {
      try {
        const res = await axiosPrivate.post(
          Endpoints.OVEN + '/query',
          { jobGroupId: selectedJobGroup },
          {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
          },
        );

        if (isMounted) {
          setFirinListesi(res.data.firinListesi);
        }
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    const getJobGroups = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal,
        });
        isMounted && setJobGroups(response.data.jobGroupList);
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        });

        if (isMounted) {
          setTrees(res.data.trees);
        }
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getJobGroups();
    if (selectedJobGroup) {
      getFirinListesi();
      getTrees();
    }

    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, [selectedJobGroup]);

  const jobGroupOptions = useMemo(() => {
    return jobGroups.map((jobGroup) => {
      return {
        value: jobGroup.id,
        label: 'No: ' + jobGroup.date,
        erkenGrupOlusturulduMu: jobGroup.erkenFırınGrubuOlusturulduMu,
        normalFırınGrubuOlusturulduMu: jobGroup.normalFırınGrubuOlusturulduMu,
      };
    });
  }, [jobGroups]);

  function onChangeValue(event) {
    setCheckedGroup(event.target.value);
  }

  const tableDivRef = useRef(null);

  function onExporting(e) {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Main sheet');

    exportDataGrid({
      component: e.component,
      worksheet,
      autoFilterEnabled: true,
    }).then(() => {
      workbook.xlsx.writeBuffer().then((buffer) => {
        saveAs(
          new Blob([buffer], { type: 'application/octet-stream' }),
          selectedJobGroup + '-IsGrubuFirinListesi.xlsx',
        );
      });
    });
    e.cancel = true;
  }

  return (
    <div>
      <section className='space-y-4'>
        <Header title='Fırın' description='Fırınlarınızı bu sayfadan yönetebilirsiniz.' />
        <iframe
          title='#'
          id='ifmcontentstoprint'
          style={{ height: 0, width: 0, position: 'absolute' }}
        ></iframe>

        <div className='space-y-4'>
          {/* seçilen iş grubu erkenFırınGrubuOlusturulduMu false ise erken firin oluştur button disabled:false  */}
          <Select
            className='hover:cursor-pointer md:w-1/4'
            options={jobGroupOptions}
            value={jobGroupOptions.filter((option) => option.value === selectedJobGroup)[0]}
            onChange={(e) => {
              setErkenGrupDisabled(e.erkenGrupOlusturulduMu);
              setSelectedJobGroup(e.value);
              if (e.erkenGrupOlusturulduMu) {
                setCheckedGroup('normal');
              } else if (e.normalFırınGrubuOlusturulduMu) {
                setAllDisabled(true);
              } else {
                setFirinListesi(initialFirinListesi);
              }
              if (!e.normalFırınGrubuOlusturulduMu) {
                setAllDisabled(false);
              }
            }}
          />

          {selectedJobGroup !== null && (
            <div
              style={{ display: allDisabled ? 'none' : 'block' }}
              className='space-y-4 mt-3 flex flex-col'
              onChange={onChangeValue}
            >
              <div className='space-x-4 flex flex-row'>
                <div>
                  <input
                    type='radio'
                    value='erken'
                    name='firinType'
                    id='erkenFirin'
                    disabled={erkenGrupDisabled}
                    checked={checkedGroup === 'erken'}
                  />
                  <label htmlFor='erkenFirin'> Erken Fırın Grubu </label>
                </div>
                <div>
                  <input
                    type='radio'
                    id='normalFirin'
                    value='normal'
                    name='firinType'
                    checked={checkedGroup === 'normal'}
                  />
                  <label htmlFor='normalFirin'> Normal Fırın Grubu </label>
                </div>
              </div>
              <Button
                appearance={'primary'}
                disabled={!checkedGroup || allDisabled}
                onClick={async () => {
                  if (checkedGroup === 'erken') {
                    setErkenGrupDisabled(true)
                    await axiosPrivate.post(Endpoints.OVEN + '/erken', {
                      jobGroupId: selectedJobGroup,
                    });
                  } else if (checkedGroup === 'normal') {
                    setAllDisabled(true)
                    await axiosPrivate.post(Endpoints.OVEN + '/normal', {
                      jobGroupId: selectedJobGroup,
                    });
                  }
                  const res = await axiosPrivate.post(
                    Endpoints.OVEN + '/query',
                    { jobGroupId: selectedJobGroup },
                    {
                      headers: { 'Content-Type': 'application/json' },
                      withCredentials: true,
                    },
                  );

                  if (res.status === 200) {
                    setFirinListesi(res.data.firinListesi);
                  }
                }}
              >
                Oluştur
              </Button>
            </div>
          )}
        </div>
        <button
          onClick={(e) => {
            console.log(tableDivRef.current);
            // pdf tabloları oluştur
          }}
        >
          yazdır!
        </button>
        <div className='flex flex-row justify-between' ref={tableDivRef}>
          <OvenTable
            ovenList={firinListesi[1]}
            ovenNumber={1}
            erkenGrupDisabled={erkenGrupDisabled}
          />
          <OvenTable
            ovenList={firinListesi[2]}
            ovenNumber={2}
            erkenGrupDisabled={erkenGrupDisabled}
          />
          <OvenTable
            ovenList={firinListesi[3]}
            ovenNumber={3}
            erkenGrupDisabled={erkenGrupDisabled}
          />
        </div>
        
          <DataGrid
            dataSource={trees}
            showBorders={true}
            rowAlternationEnabled={true}
            showRowLines={true}
            onExporting={onExporting}
          >
            <Export enabled={true} />
            <Column dataField={'treeNo'} caption={'Ağaç Numarası'} alignment={'center'} />
            <Column
              dataField={'fırınId'}
              caption={'Yerleştiği Fırın'}
              cellRender={({ data }) => {
                
                if (data.fırınId===null) {
                  return JSON.stringify(data)
                }
                const selectedOven = Firinlar?.find((firin) => {
                 return firin?.firinId === data?.fırınId});
                
                 return selectedOven?.firinSira + ' - ' + selectedOven?.firinKonum;
              }}
            />
            <Column dataField={'yerlesmesiGerekenFirin'} caption={'Yerleşmesi Gereken Fırın'} />
            <Column
              dataField={'erkenFirinGrubunaEklendiMi'}
              caption={'Fırın Tipi'}
              cellRender={({ data }) => {
                return data?.erkenFirinGrubunaEklendiMi ? 'Erken' : 'Normal';
              }}
            />
            <Column dataField={'color.colorName'} caption={'Renk'} />
            <Column dataField={'option.optionText'} caption={'Ayar'} />
            <Column dataField={'thick.thickName'} caption={'Kalınlık'} />
          </DataGrid>
      </section>
    </div>
  );
}

export default OvenMainPage;
