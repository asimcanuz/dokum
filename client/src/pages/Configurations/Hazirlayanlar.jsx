import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import Button from '../../components/Button';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import EditableText from '../../components/Input/EditableText';
import Alert from '../../components/Alert/Alert';

function Hazirlayanlar() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [creators, setCreators] = useState([]);

  const creatorsRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCreator = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.CREATOR, {
          signal: controller.signal,
        });

        if (isMounted) {
          setCreators(response.data.creators);
          creatorsRef.current = response.data.creators;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };
    isMounted && getCreator();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  //#region creator request
  const saveCreator = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.CREATOR,
        { creatorName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateCreator = async (id, name) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.CREATOR,
        { creatorId: id, creatorName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const deleteCreator = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.CREATOR,
        { data: { creatorId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.CREATOR, {
        signal: controller.signal,
      });

      setCreators(response.data.creators);
      creatorsRef.current = response.data.creators;
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
      <h4 className='text-lg'>Hazırlayan</h4>
      <Button
        appearance={'primary'}
        onClick={() => {
          const lastCreatorId = creators[creators.length - 1]?.creatorId + 1 || 1;
          const newCreatorItem = {
            creatorId: lastCreatorId,
            creatorName: 'Yeni Hazırlayan Kişi',
          };

          setCreators([...creators, newCreatorItem]);
          saveCreator(newCreatorItem.creatorName);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Hazırlayan Ekle
      </Button>
      {creators.length > 0 ? (
        <div
          style={{ height: '75vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
        >
          <div className='grid grid-flow-row-dense grid-cols-2'>
            <p>Hazırlayan</p>
            <p>İşlemler</p>
          </div>
          {creators.map((creator, index) => {
            return (
              <div
                key={creator.creatorId}
                className={`grid grid-flow-row-dense grid-cols-2 gap-2 py-4 ${
                  index + 1 !== creators.length && 'border-b border-gray-200 '
                }`}
              >
                <div className='flex items-center justify-between'>
                  <EditableText
                    id={creator.creatorId}
                    type={'text'}
                    value={creator.creatorName}
                    onChange={(e) => {
                      let newCreatorList = [...creators];
                      let _creator = newCreatorList.find((c) => c.creatorId === creator.creatorId);
                      _creator.creatorName = e.target.value;
                      setCreators(newCreatorList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateCreator(creator.creatorId, creator.creatorName);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateCreator(creator.creatorId, creator.creatorName);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={'Kaydet'}
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteCreator(creator.creatorId);
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

export default Hazirlayanlar;
