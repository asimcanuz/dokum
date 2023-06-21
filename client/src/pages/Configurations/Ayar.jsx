import React, { useEffect, useRef, useState } from 'react';
import Button from '../../components/Button';
import EditableText from '../../components/Input/EditableText';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import Alert from '../../components/Alert/Alert';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Endpoints } from '../../constants/Endpoints';

function Ayar() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [options, setOptions] = useState([]);
  const optionsRef = useRef(null);
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getOptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.OPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setOptions(response.data.options);
          optionsRef.current = response.data.options;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };
    isMounted && getOptions();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);
  //#region options request
  const saveOption = async (text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.OPTION,
        { optionText: text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateOption = async (id, text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.put(
        Endpoints.OPTION,
        { optionId: id, optionText: text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };

  const deleteOption = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.OPTION,
        { data: { optionId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.OPTION, {
        signal: controller.signal,
      });

      setOptions(response.data.options);
      optionsRef.current = response.data.options;
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
      <h4 className='text-lg'>Ayar</h4>
      <Button
        appearance={'primary'}
        onClick={() => {
          const lastOptionId = options[options.length - 1]?.optionId + 1 || 1;
          const newOptionItem = {
            optionId: lastOptionId,
            optionText: 'Yeni Ayar Türü',
          };
          setOptions([...options, newOptionItem]);
          saveOption(newOptionItem.optionText);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Ayar Ekle
      </Button>
      {options.length > 0 ? (
        <div
          style={{ height: '75vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
        >
          <div className='grid grid-flow-row-dense grid-cols-2 gap-2 border-b border-gray-600 py-4'>
            <p>Ayar Türü</p>
            <p>İşlemler</p>
          </div>
          {options.map((option, index) => {
            return (
              <div
                key={option.optionId}
                className={`grid grid-flow-row-dense grid-cols-2 gap-2 py-4 ${
                  index + 1 !== options.length && 'border-b border-gray-200 '
                }`}
              >
                <div className='flex items-center justify-between'>
                  <EditableText
                    id={option.optionId}
                    type={'text'}
                    value={option.optionText}
                    onChange={(e) => {
                      let newOptionList = [...options];
                      let _option = newOptionList.find((o) => o.optionId === option.optionId);
                      _option.optionText = e.target.value;
                      setOptions(newOptionList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateOption(option.optionId, option.optionText);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateOption(option.optionId, option.optionText);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={
                      optionsRef.current.find((oref) => oref.optionId === option.optionId)
                        ?.optionText === undefined
                        ? 'Kaydet'
                        : 'Güncelle'
                    }
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteOption(option.optionId);
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

export default Ayar;
