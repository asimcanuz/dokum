import React, { useEffect, useRef, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Endpoints } from '../../constants/Endpoints';
import Button from '../../components/Button';
import { AiOutlineDelete, AiOutlinePlus, AiOutlineSave } from 'react-icons/ai';
import EditableText from '../../components/Input/EditableText';
import Alert from '../../components/Alert/Alert';

function Renkler() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [colors, setColors] = useState([]);

  const colorsRef = useRef(null);
  useEffect(() => {
    const controller = new AbortController();

    let isMounted = true;

    const getColors = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.COLOR, {
          signal: controller.signal,
        });

        if (isMounted) {
          setColors(response.data.colors);
          colorsRef.current = response.data.colors;
        }
      } catch (error) {
        console.error(error);
        navigate('/login', {
          state: { from: location },
          replace: true,
        });
      }
    };

    // getTreeStatus();
    getColors();
    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, []);

  //#region color request
  const saveColor = async (name) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.post(
        Endpoints.COLOR,
        { colorName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const updateColor = async (id, name) => {
    const controller = new AbortController();
    try {
      await axiosPrivate.put(
        Endpoints.COLOR,
        { colorId: id, colorName: name },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
    } catch (error) {
      console.error(error);
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
    controller.abort();
  };
  const deleteColor = async (id) => {
    const controller = new AbortController();

    try {
      await axiosPrivate.delete(
        Endpoints.COLOR,
        { data: { colorId: id } },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );
      const response = await axiosPrivate.get(Endpoints.COLOR, {
        signal: controller.signal,
      });

      setColors(response.data.colors);
      colorsRef.current = response.data.colors;
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
      <h4 className='text-lg'>Renkler</h4>
      <Button
        appearance={'primary'}
        onClick={() => {
          const lastColorId = colors[colors.length - 1]?.colorId + 1 || 1;
          const newColorItem = {
            colorId: lastColorId,
            colorName: 'Yeni Renk',
          };
          setColors([...colors, newColorItem]);
          saveColor(newColorItem.colorName);
        }}
      >
        <AiOutlinePlus color='white' size={'16px'} />
        Yeni Renk Ekle
      </Button>
      {colors.length > 0 ? (
        <div
          style={{ height: '60vh' }}
          className='flex flex-col overflow-y-auto scroll-m-1 scroll-smooth'
        >
          <div className='grid grid-flow-row-dense grid-cols-2'>
            <p>Renk</p>
            <p>İşlemler</p>
          </div>
          {colors.map((color, index) => {
            return (
              <div
                key={color.colorId}
                className={` grid grid-flow-row-dense grid-cols-2 gap-2 py-4 ${
                  index + 1 !== colors.length && 'border-b border-gray-200'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <EditableText
                    id={color.colorId}
                    type={'text'}
                    value={color.colorName}
                    onChange={(e) => {
                      let newColorList = [...colors];
                      let _color = newColorList.find((c) => c.colorId === color.colorId);
                      _color.colorName = e.target.value;
                      setColors(newColorList);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        updateColor(color.colorId, color.colorName);
                      }
                    }}
                  />
                </div>
                <div className='flex flex-row space-x-4 '>
                  <AiOutlineSave
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      updateColor(color.colorId, color.colorName);
                    }}
                    data-bs-toggle='tooltip'
                    data-bs-placement='right'
                    title={'Kaydet'}
                  />
                  <AiOutlineDelete
                    size={'24px'}
                    className='hover:cursor-pointer hover:animate-pulse '
                    onClick={() => {
                      deleteColor(color.colorId);
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

export default Renkler;
