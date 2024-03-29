import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useFormik } from 'formik';
import Select from 'react-select';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';

function UpdateTreeModal({
  updateClick,
  setTodayTrees,
  treeStatuses,
  options,
  creators,
  thicks,
  waxes,
  colors,
  todayTrees,
  customers,
  descriptions,
  toggle,
  selectedJobGroup,
}) {
  const axiosPrivate = useAxiosPrivate();

  const {
    active,
    colorId,
    creatorId,
    desc,
    isImmediate,
    listNo,
    open,
    optionId,
    processId,
    thickId,
    treeNo,
    treeStatusId,
    waxId,
    treeId,
  } = updateClick;
  const navigate = useNavigate();
  const location = useLocation();
  const [treeIndexes, setTreeIndexes] = useState([{ treeNo: '', listNo: '', treeId: '' }]);
  const [treeNoError, setTreeNoError] = useState({ show: false, message: '' });
  const [listNoError, setListNoError] = useState({ show: false, message: '' });

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getTreeIndexes = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.TREE.INDEXES, {
          params: {
            jobGroupId: selectedJobGroup,
          },
          signal: controller.signal,
        });

        if (isMounted) {
          setTreeIndexes(res.data.trees);
        }
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    isMounted && getTreeIndexes();
  }, []);

  const formik = useFormik({
    initialValues: {
      active,
      colorId,
      creatorId,
      desc,
      //  listNo,
      optionId,
      processId,
      thickId,
      treeNo,
      treeStatusId,
      // waxId,
      treeId,
    },

    onSubmit: async (values) => {
      // setTodayTrees([...todayTrees]);
      try {
        await axiosPrivate.put(Endpoints.TREE.MAIN, values);

        try {
          const controller = new AbortController();
          const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
            params: {
              jobGroupId: selectedJobGroup,
            },
            signal: controller.signal,
          });

          setTodayTrees(res.data.trees);
          controller.abort();
        } catch (error) {
          console.error(error);
          navigate('/login', { state: { from: location }, replace: true });
        }
      } catch (error) {}

      // toggle();
    },
  });

  // const waxOpts = waxes.map((wax) => {
  //   return { value: wax.waxId, label: wax.waxName };
  // });
  const colorOpts = colors.map((color) => {
    return { value: color.colorId, label: color.colorName };
  });

  const thickOpts = thicks.map((thick) => {
    return { value: thick.thickId, label: thick.thickName };
  });

  const creatorOpts = creators.map((creator) => {
    return { value: creator.creatorId, label: creator.creatorName };
  });

  const treeStatusOpts = treeStatuses.map((treeStatus) => {
    return { value: treeStatus.treeStatusId, label: treeStatus.treeStatusName };
  });

  const optionsOpts = options.map((option) => {
    return { value: option.optionId, label: option.optionText };
  });

  // options
  // todayTrees
  // descriptions
  return (
    <Modal open={updateClick.open} size={'large'}>
      <ModalHeader title={'Agacı Güncelle'} toogle={() => toggle()} />
      <ModalBody>
        <div className='flex flex-col'>
          <form>
            <div className='flex flex-col'>
              <div className='flex flex-row justify-between space-x-4'>
                <div>
                  <label htmlFor='treeNo'>Ağaç Numarası</label>
                  <Input
                    id='treeNo'
                    name='treeNo'
                    type={'text'}
                    value={formik.values.treeNo}
                    onChange={(e) => {
                      formik.setFieldValue('treeNo', e.target.value);

                      let sameNumber = treeIndexes.find(
                        (tree) => tree.treeNo === parseInt(e.target.value),
                      );
                      if (e.target.value !== treeNo.toString()) {
                        if (
                          sameNumber !== undefined &&
                          sameNumber !== null &&
                          e.target.value !== ''
                        ) {
                          setTreeNoError({
                            show: true,
                            message: 'İş grubunda aynı ağaç numarası bulunmaktadır.',
                          });
                        } else {
                          setTreeNoError({
                            show: false,
                            message: '',
                          });
                        }
                      } else {
                        setTreeNoError({
                          show: false,
                          message: '',
                        });
                      }
                    }}
                  />

                  {treeNoError.show ? (
                    <div className='text-red-600'>{treeNoError.message}</div>
                  ) : null}
                </div>
                {/*<div>*/}
                {/*  <label htmlFor='listNo'>Liste Numarası</label>*/}
                {/*  <Input*/}
                {/*    id='listNo'*/}
                {/*    name='listNo'*/}
                {/*    type={'text'}*/}
                {/*    value={formik.values.listNo}*/}
                {/*    onChange={(e) => {*/}
                {/*      formik.setFieldValue('listNo', e.target.value);*/}

                {/*      let sameNumber = treeIndexes.find(*/}
                {/*        (tree) => tree.listNo === parseInt(e.target.value),*/}
                {/*      );*/}
                {/*      if (sameNumber !== undefined || sameNumber !== null) {*/}
                {/*        setListNoError({*/}
                {/*          show: true,*/}
                {/*          message: 'İş grubunda aynı liste numarası bulunmaktadır.',*/}
                {/*        });*/}
                {/*      } else {*/}
                {/*        setListNoError({*/}
                {/*          show: false,*/}
                {/*          message: '',*/}
                {/*        });*/}
                {/*      }*/}
                {/*    }}*/}
                {/*  />*/}
                {/*  {listNoError.show ? (*/}
                {/*    <div className='text-red-600'>{listNoError.message}</div>*/}
                {/*  ) : null}*/}
                {/*</div>*/}
              </div>
              <div className='flex flex-row justify-between space-x-4'>
                {/* <div className='w-full'>
                  <label htmlFor='waxId'>Mum Türü</label>
                  <Select
                    type='select'
                    id='waxId'
                    name='waxId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={waxOpts}
                    value={waxOpts.find((wax) => wax.value === formik.values.waxId)}
                    onChange={(e) => {
                      formik.setFieldValue('waxId', e.value);
                    }}
                  />
                </div> */}
                <div className='w-full'>
                  <label htmlFor='thickId'>Kalınlık</label>
                  <Select
                    type='select'
                    id='thickId'
                    name='thickId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={thickOpts}
                    value={thickOpts.find((thick) => thick.value === formik.values.thickId)}
                    onChange={(e) => {
                      formik.setFieldValue('thickId', e.value);
                    }}
                  />
                </div>
                <div className='w-full'>
                  <label htmlFor='colorId'>Renk</label>
                  <Select
                    type='select'
                    id='colorId'
                    name='colorId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={colorOpts}
                    value={colorOpts.find((color) => color.value === formik.values.colorId)}
                    onChange={(e) => {
                      formik.setFieldValue('colorId', e.value);
                    }}
                  />
                </div>
              </div>
              <div className='flex flex-row justify-between space-x-4'>
                <div className='w-full'>
                  <label htmlFor='optionId'>Ayar</label>
                  <Select
                    type='select'
                    id='optionId'
                    name='optionId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={optionsOpts}
                    value={optionsOpts.find((opts) => opts.value === formik.values.optionId)}
                    onChange={(e) => {
                      formik.setFieldValue('optionId', e.value);
                    }}
                  />
                </div>
                <div className='w-full'>
                  <label htmlFor='creatorId'>Hazırlayan</label>
                  <Select
                    type='select'
                    id='creatorId'
                    name='creatorId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={creatorOpts}
                    value={creatorOpts.find((creator) => creator.value === formik.values.creatorId)}
                    onChange={(e) => {
                      formik.setFieldValue('creatorId', e.value);
                    }}
                  />
                </div>
                <div className='w-full'>
                  <label htmlFor='treeStatusId'>Ağaç Durumu</label>
                  <Select
                    type='select'
                    id='treeStatusId'
                    name='treeStatusId'
                    className='w-full'
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        height: '40px',
                        minHeight: '40px',
                        minWidth: "Math.ceil(100 / 3) + '%'",
                      }),
                    }}
                    options={treeStatusOpts}
                    value={treeStatusOpts.find(
                      (status) => status.value === formik.values.treeStatusId,
                    )}
                    onChange={(e) => {
                      formik.setFieldValue('treeStatusId', e.value);
                    }}
                  />
                </div>
              </div>
              <div className='flex flex-row justify-between space-x-4'>
                <div className='w-full'>
                  <label htmlFor='desc'>Ağaç Açıklaması</label>
                  <Input
                    id='desc'
                    name='desc'
                    type={'text'}
                    value={formik.values.desc}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button appearance={'danger'} onClick={() => toggle()}>
          İptal
        </Button>
        <Button
          appearance={'success'}
          disabled={listNoError.show && treeNoError.show}
          onClick={async () => {
            await formik.handleSubmit();

            await toggle();
          }}
        >
          Güncelle
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default UpdateTreeModal;
