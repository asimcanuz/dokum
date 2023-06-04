import React, { useEffect, useMemo, Fragment } from 'react';
import Header from '../../components/Header';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import Button from '../../components/Button';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

const printList = () => {
  var content = document.getElementById('treeList');
  var pri = document.getElementById('ifmcontentstoprint').contentWindow;
  pri.document.open();
  pri.document.write(content.innerHTML);
  pri.document.close();
  pri.focus();
  pri.print();
};

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

    getJobGroups();
    selectedJobGroup && getFirinListesi();

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
                    await axiosPrivate.post(Endpoints.OVEN + '/erken', {
                      jobGroupId: selectedJobGroup,
                    });
                  } else if (checkedGroup === 'normal') {
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
        <button onClick={() => printList()}>yazdır!</button>
        <div className='flex flex-row justify-between' id='treeList'>
          <div className='px-2 py-4 space-y-2 flex flex-col items-center border border-slate-400 w-1/3'>
            <h4>1. Fırın </h4>
            {erkenGrupDisabled && <h4 className='text-red-900'>Erken Fırın</h4>}
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h4>UST</h4>
                </th>
              </tr>

              {firinListesi[1]['ust'] && firinListesi[1]['ust'].length > 0 ? (
                <React.Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>
                  {firinListesi[1]['ust'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h4>ALT</h4>
                </th>
              </tr>
              {firinListesi[1]['alt'] && firinListesi[1]['alt'].length > 0 ? (
                <Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>

                  {firinListesi[1]['alt'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
          </div>
          <div className='px-2 py-4 space-y-2 flex flex-col items-center border border-slate-400 w-1/3'>
            <h4>2. Fırın</h4>
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h4>UST</h4>
                </th>
              </tr>
              {firinListesi[2]['ust'] && firinListesi[2]['ust'].length > 0 ? (
                <Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>

                  {firinListesi[2]['ust'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h4>ALT</h4>
                </th>
              </tr>
              {firinListesi[2]['alt'].length > 0 ? (
                <Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>

                  {firinListesi[2]['alt'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
          </div>
          <div className='px-2 py-4 space-y-2 flex flex-col items-center border border-slate-400 w-1/3'>
            <h4>3. Fırın</h4>
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h4>UST</h4>
                </th>
              </tr>
              {firinListesi[3]['ust']?.length > 0 ? (
                <Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>

                  {firinListesi[3]['ust'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
            <table className='w-full'>
              <tr>
                <th colSpan={'3'}>
                  <h3>ALT</h3>
                </th>
              </tr>
              {firinListesi[3]['alt'].length > 0 ? (
                <Fragment>
                  <tr>
                    <th align='center'>Ağaç No</th>
                    <th align='center'>Yerleştiği Fırın</th>
                    <th align='center'>Yerleşmesi Gereken</th>
                  </tr>

                  {firinListesi[3]['alt'].map((element) => {
                    return (
                      <tr>
                        <td align='center'>{element.treeNo}</td>
                        <td align='center'>
                          {element.yerlestigiFirin + '-' + element.yerlestigiKonum}
                        </td>
                        <td align='center'>
                          {element.yerlesmesiGerekenFirin || element.yerlesmesiGerekenFirin !== ''
                            ? element.yerlesmesiGerekenFirin
                            : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </Fragment>
              ) : (
                <div className='text-center'>Fırın Boştur!</div>
              )}
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OvenMainPage;
