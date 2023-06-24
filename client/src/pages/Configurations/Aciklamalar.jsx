import React, { useEffect, useRef, useState } from 'react';
import { Endpoints } from '../../constants/Endpoints';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import EditableText from '../../components/Input/EditableText';
import Alert from '../../components/Alert/Alert';

function Aciklamalar() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [descriptions, setDescriptions] = useState([]);
  const descriptionsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const getDescriptions = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
          signal: controller.signal,
        });
        if (isMounted) {
          setDescriptions(response.data.descriptions);
          descriptionsRef.current = response.data.descriptions;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };
    isMounted && getDescriptions();

    return () => {
      controller.abort();
      isMounted = false;
    };
  }, []);
  //#region description request
  const saveDescription = async (text) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.DESCRIPTION,
        { descriptionText: text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateDescription = async (id, text) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.DESCRIPTION,
        { descriptionId: id, descriptionText: text },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const deleteDescription = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.DESCRIPTION,
        { data: { descriptionId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.DESCRIPTION, {
        signal: controller.signal,
      });

      setDescriptions(response.data.descriptions);
      descriptionsRef.current = response.data.descriptions;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  //#endregion color requests

  return (
    <div
      id='configurationTable'
      className='px-6 py-4 rounded space-y-4 max-h-full border border-gray-400 border-spacing-4'
    >
      <h4 className='text-lg'>Açıklamalar</h4>
      <Button
        appearance={'primary'}
        onClick={() => {
          const lastDescriptionId = descriptions[descriptions.length - 1]?.descriptionId + 1 || 1;
          const newDescriptionItem = {
            descriptionId: lastDescriptionId,
            descriptionText: 'Yeni Açıklama',
          };
          setDescriptions([...descriptions, newDescriptionItem]);
          saveDescription(newDescriptionItem.descriptionText);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Açıklama Ekle
      </Button>
      {descriptions.length > 0 ? (
        <div
          style={{ height: '60vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth '
        >
          <div className='grid grid-cols-6 font-medium text-lg sticky'>
            <p className='col-span-4'>Açıklama</p>
            <p> İşlemler</p>
          </div>
          {descriptions.map((description, index) => {
            return (
              <div
                key={description.descriptionId}
                className={` grid grid-cols-6 gap-2 py-4 ${
                  index + 1 !== descriptions.length && 'border-b border-gray-200 '
                }`}
              >
                <div className='flex items-center justify-between col-span-4'>
                  <EditableText
                    id={description.descriptionId}
                    type={'text'}
                    value={description.descriptionText}
                    onChange={(e) => {
                      let newDescriptionList = [...descriptions];
                      let _description = newDescriptionList.find(
                        (d) => d.descriptionId === description.descriptionId,
                      );
                      _description.descriptionText = e.target.value;
                      setDescriptions(newDescriptionList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateDescription(description.descriptionId, description.descriptionText);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateDescription(description.descriptionId, description.descriptionText);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={'Kaydet'}
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteDescription(description.descriptionId);
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

export default Aciklamalar;
