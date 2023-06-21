import React, { useEffect, useRef, useState } from 'react';
import { Endpoints } from '../../constants/Endpoints';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import Button from '../../components/Button';
import EditableText from '../../components/Input/EditableText';
import Alert from '../../components/Alert/Alert';

function Kalinlik() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [thicks, setThicks] = useState([]);
  const thicksRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getThick = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.THICK, {
          signal: controller.signal,
        });
        if (isMounted) {
          setThicks(response.data.thicks);
          thicksRef.current = response.data.thicks;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };
    isMounted && getThick();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  const saveThick = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.THICK,
        { thickName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateThick = async (id, name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.THICK,
        { thickId: id, thickName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const deleteThick = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.THICK,
        { data: { thickId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.THICK, {
        signal: controller.signal,
      });

      setThicks(response.data.thicks);
      thicksRef.current = response.data.thicks;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  //#endregion thick requests
  return (
    <div
      id='configurationTable'
      className='px-6 py-4 rounded space-y-4 max-h-full border border-gray-400 border-spacing-4'
    >
      <h4 className='text-lg'>Kalınlık</h4>
      <Button
        appearance={'primary'}
        onClick={() => {
          const lastThickId = thicks[thicks.length - 1]?.thickId + 1 || 1;
          const newThickItem = {
            thickId: lastThickId,
            thickName: 'Yeni Kalınlık',
          };
          setThicks([...thicks, newThickItem]);
          saveThick(newThickItem.thickName);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Kalınlık Ekle
      </Button>
      {thicks.length > 0 ? (
        <div
          style={{ height: '70vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
        >
          <div className='grid grid-flow-row-dense grid-cols-2'>
            <p>Kalınlık</p>
            <p>İşlemler</p>
          </div>
          {thicks.map((thick, index) => {
            return (
              <div
                key={thick.thickId}
                className={`grid grid-flow-row-dense grid-cols-2 gap-2 py-4 ${
                  index + 1 !== thicks.length && 'border-b border-gray-200 '
                }`}
              >
                <div className='flex items-center justify-between'>
                  <EditableText
                    id={thick.thickId}
                    type={'text'}
                    value={thick.thickName}
                    onChange={(e) => {
                      let newThickList = [...thicks];
                      let _thick = newThickList.find((t) => t.thickId === thick.thickId);
                      _thick.thickName = e.target.value;
                      setThicks(newThickList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateThick(thick.thickId, thick.thickName);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateThick(thick.thickId, thick.thickName);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={'Kaydet'}
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteThick(thick.thickId);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title='Sil'
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

export default Kalinlik;
