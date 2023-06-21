import React, { useEffect, useRef, useState } from 'react';
import EditableText from '../../components/Input/EditableText';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Alert from '../../components/Alert/Alert';

function MumTuru() {
  const [waxes, setWaxes] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const waxesRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;
    const getWax = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.WAX, {
          signal: controller.signal,
        });

        if (isMounted) {
          setWaxes(response.data.waxes);
          waxesRef.current = response.data.waxes;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };
    isMounted && getWax();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);

  //#region wax requests
  const saveWax = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.WAX,
        { waxName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateWax = async (id, name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.WAX,
        { waxId: id, waxName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const deleteWax = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.WAX,
        { data: { waxId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.WAX, {
        signal: controller.signal,
      });

      setWaxes(response.data.waxes);
      waxesRef.current = response.data.waxes;
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
    <div
      id='configurationTable'
      className='px-6 py-4 rounded space-y-4 max-h-full border border-gray-400 border-spacing-4'
    >
      <h4 className='text-lg'>Mum Türü</h4>
      <Button
        appearance={'primary'}
        onClick={async (e) => {
          const lastWaxId = waxes[waxes.length - 1]?.waxId + 1 || 1;
          const newWaxItem = {
            waxId: lastWaxId,
            waxName: 'Yeni Mum türü',
          };
          setWaxes([...waxes, newWaxItem]);
          saveWax(newWaxItem.waxName);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Mum Türü Ekle
      </Button>
      {waxes.length > 0 ? (
        <div
          style={{ height: '70vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
        >
          <div className='grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4 '>
            <p>Mum Türü</p>
            <p>İşlemler</p>
          </div>
          {waxes.map((wax, index) => {
            return (
              <div
                key={wax.waxId}
                className={`grid grid-flow-row-dense grid-cols-2 gap-2 py-4 ${
                  index + 1 !== waxes.length && 'border-b border-gray-200 '
                }`}
              >
                <div className='flex items-center justify-between'>
                  <EditableText
                    id={wax.waxId}
                    type={'text'}
                    value={wax.waxName}
                    onChange={(e) => {
                      let newWaxList = [...waxes];
                      let _wax = newWaxList.find((w) => w.waxId === wax.waxId);
                      _wax.waxName = e.target.value;
                      setWaxes(newWaxList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateWax(wax.waxId, wax.waxName);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateWax(wax.waxId, wax.waxName);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={
                      waxesRef.current.find((wref) => wref.waxId === wax.waxId)?.waxName ===
                      undefined
                        ? 'Kaydet'
                        : 'Güncelle'
                    }
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteWax(wax.waxId);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title='Tooltip on right'
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
  );
}

export default MumTuru;
