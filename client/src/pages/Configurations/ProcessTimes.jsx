import React, { Fragment, useEffect, useRef, useState } from 'react';
import { LoadPanel } from 'devextreme-react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Endpoints } from '../../constants/Endpoints';
import Alert from '../../components/Alert/Alert';
import { AiOutlineSave } from 'react-icons/ai';
import EditableText from '../../components/Input/EditableText';
import getSecondsFromHHMMSS from '../../utils/getSecondsFromHHMMSS';
import toHHMMSS from '../../utils/toHHMMSS';
import Input from '../../components/Input';

function ProcessTimes() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [treeStatuses, setTreeStatuses] = useState([]);
  const treeStatuesRef = useRef(null);
  const getTreeStatus = async (controller, isMounted) => {
    try {
      const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
        signal: controller.signal,
      });
      if (isMounted) {
        setTreeStatuses(response.data.treeStatuses);
        treeStatuesRef.current = response.data.treeStatuses;
        setLoading(false);
      }
    } catch (error) {
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    getTreeStatus(controller, isMounted);

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);

  function onChangeTime(e, treeStatus) {
    let value = e.target.value;

    let newTreeStatusList = [...treeStatuses];
    let _treeStatuses = newTreeStatusList.find((ts) => ts.treeStatusId === treeStatus.treeStatusId);
    _treeStatuses.statusCompleteTime = value;
    setTreeStatuses(newTreeStatusList);
  }

  const updateStatusTime = async (id, time) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.TREESTATUS,
        { treeStatusId: id, statusCompleteTime: time },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.TREESTATUS, {
        signal: controller.signal,
      });

      setTreeStatuses(response.data.treeStatuses);
      treeStatuesRef.current = response.data.treeStatues;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };

  return (
    <Fragment>
      <div
        id='configurationTable'
        className='px-6 py-4 rounded space-y-4 max-h-full border border-gray-400 border-spacing-4'
      >
        <h4 className='text-lg'>İşlem Zamanı</h4>

        {treeStatuses.length > 0 ? (
          <div
            style={{ height: '60vh' }}
            className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
          >
            <div className='grid grid-flow-row-dense grid-cols-3 gap-2 border-b border-gray-600 py-4'>
              <b>Ağaç Durumları</b>
              <b>İşlem Zamanları</b>
              <b>İşlemler</b>
            </div>
            {treeStatuses.map((treeStatus, index) => {
              return (
                <div
                  key={treeStatus.treeStatusId}
                  className={`grid grid-flow-row-dense grid-cols-3 gap-2 py-4 ${
                    index + 1 !== treeStatuses.length && 'border-b border-gray-200 '
                  }`}
                >
                  <div>
                    <b>{treeStatus.treeStatusName}</b>
                  </div>

                  <div className='flex items-center justify-between'>
                    <Input
                      style={{ width: '50%' }}
                      id={treeStatus.treeStatusId}
                      type={'time'}
                      value={treeStatus.statusCompleteTime}
                      onChange={(e) => {
                        onChangeTime(e, treeStatus);
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          updateStatusTime(treeStatus.treeStatusId, e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div className='flex flex-row space-x-4 '>
                    <AiOutlineSave
                      size={'24px'}
                      className='hover:cursor-pointer hover:animate-pulse '
                      onClick={() => {
                        updateStatusTime(treeStatus.treeStatusId, treeStatus.statusCompleteTime);
                      }}
                      data-bs-toggle='tooltip'
                      data-bs-placement='right'
                      title={'Güncelle'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <Alert apperance={'warning'}>Veriler Henüz Girilmemiş!</Alert>
        )}
      </div>
      <LoadPanel
        shadingColor='rgba(0,0,0,0.4)'
        position={'center'}
        onHiding={() => {
          setLoading(false);
        }}
        visible={loading}
        showIndicator={true}
        shading={true}
        showPane={true}
        hideOnOutsideClick={false}
      />
    </Fragment>
  );
}

export default ProcessTimes;
