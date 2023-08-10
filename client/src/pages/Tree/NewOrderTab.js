import React, { Fragment, useEffect, useState } from 'react';
import Select from 'react-select';
import Button from '../../components/Button';
import { AiOutlinePlus } from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import useAuth from '../../hooks/useAuth';
import { CheckBox, NumberBox, SelectBox } from 'devextreme-react';
import ErrorModal from '../../components/ErrorModal';
import AddNewDescriptionModal from './AddNewDescriptionModal';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactSelect from 'react-select';

function NewOrderTab({
  clickTree: tree,
  descriptions,
  setTodayTrees,
  selectedJobGroup,
  setDescriptions,
}) {
  const auth = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [errorModal, setErrorModal] = useState({
    visible: false,
    message: '',
    title: '',
  });

  const [order, setOrder] = React.useState({
    treeId: tree.agacId,
    customerId: '',
    descriptionId: null,
    quantity: '',
    createdBy: auth.auth.id,
    isImmediate: false,
  });

  const [customerName, setCustomerName] = useState('');
  const [customers, setCustomers] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [limit, setLimit] = useState(100);
  const [skip, setSkip] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getCustomers = async () => {
      try {
        const response = await axiosPrivate.post(Endpoints.CUSTOMERS.LIMIZATION, {
          limit: limit,
          skip: skip,
          filter: customerName,
          signal: controller.signal,
        });
        if (isMounted) {
          if (response.data.customers.length === 0) {
            response.data.customers[0] = {
              customerId: 1,
              customerName: 'Lütfen Geçerli Müşteri Giriniz!',
            };
          }
          setCustomers(response.data.customers);
        }
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    isMounted && getCustomers();

    return () => {
      isMounted = false;
      !isMounted && controller.abort();
    };
  }, [customerName]);

  useEffect(() => {
    setOrder({ ...order, treeId: tree.agacId });
  }, [tree]);

  const customerOptions = customers?.map((customer) => ({
    value: customer.customerId,
    label: customer.customerName,
  }));
  const descriptionOptions = descriptions.map((description) => ({
    value: description.descriptionId,
    label: description.descriptionText,
  }));
  descriptionOptions.unshift({ value: null, label: 'Açıklama Yok' });

  async function addOrder() {
    const controller = new AbortController();
    try {
      if (!tree.agacId) {
        throw new Error('Lütfen ağaç seçiniz!');
      }
      setLoading(false);
      if (order.customerId === '' || order.quantity === '') {
        throw new Error('Lütfen müşteri ve/veya adet alanlarını doldurunuz.');
      }

      await axiosPrivate.post(Endpoints.ORDER, order, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const response = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        params: {
          jobGroupId: selectedJobGroup,
        },
      });
      if (response.status === 200) {
        setLoading(true);
      }

      setTodayTrees(response.data.trees);
    } catch (error) {
      setLoading(true);

      setErrorModal({
        visible: true,
        message: error.message,
        title: 'Sipariş Ekleme Hatası',
      });

      // alert(error.message);
      // if (error.response.status === 401) {
      //   navigate('/login', { state: { from: location }, replace: true });
      // }
    }
    controller.abort();
  }

  const customFilter = async (option, searchText) => {
    setCustomerName(searchText);
  };
  return (
    <Fragment>
      <section className='flex flex-col space-y-4 '>
        <div className='grid grid-cols-4 gap-4'>
          <div className='flex flex-col '>
            <p className='font-bold text-red-400'>Id</p>
            <p className='text-blue-600'>{tree.agacId}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Agaç No</p>
            <p className='text-blue-600'>{tree.agacNo}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Liste No</p>
            <p className='text-blue-600'>{tree.listeNo}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Ağaçtaki Sipariş Adeti</p>
            <p className='text-blue-600'>{tree.siparisSayisi}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Renk</p>
            <p className='text-blue-600'>{tree.renk}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Ayar</p>
            <p className='text-blue-600'>{tree.ayar}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Kalınlık</p>
            <p className='text-blue-600'>{tree.kalinlik}</p>
          </div>
          <div className='flex flex-col'>
            <p className='font-bold text-red-400'>Ağaçtaki Müşteri Adeti</p>
            <p className='text-blue-600'>{tree.musteriSayisi}</p>
          </div>
        </div>

        <div className='grid grid-rows-3'>
          <div className='flex flex-col'>
            {/* <SelectBox
              className='hover:cursor-pointer text-sm'
              dataSource={customerOptions}
              displayExpr={'label'}
              valueExpr='value'
              label='Müşteri'
              labelMode='floating'
              value={
                customerOptions?.filter((option) => option.value === order.customerId)[0]?.value
              }
              onValueChanged={(e) => {
                setOrder({ ...order, customerId: e.value });
              }}

              searchEnabled={true}
              searchMode='startswith'
              searchExpr={'label'}
              minSearchLength={'2'}
            /> */}
            <ReactSelect
              className='hover:cursor-pointer text-sm'
              options={customerOptions}
              onChange={(e) => {
                setOrder({ ...order, customerId: e.value });
              }}
              value={customerOptions?.filter((option) => option.value === order.customerId)[0]}
              isSearchable={true}
              filterOption={customFilter}
            />
          </div>
          <div className='flex flex-col'>
            <NumberBox
              label={'Adet'}
              labelMode={'floating'}
              value={order.quantity}
              min='1'
              onValueChanged={(e) => {
                if (parseInt(e.value) <= 0) {
                }
                setOrder({ ...order, quantity: e.value });
              }}
            />
          </div>
          <div className='flex flex-col space-y-4'>
            <div className='flex flex-row justify-end'>
              <p
                onClick={() => {
                  setModalOpen(true);
                }}
                className='flex flex-row justify-between items-center text-blue-600 hover:cursor-pointer hover:animate-pulse'
              >
                <AiOutlinePlus /> <span>Yeni Açıklama</span>
              </p>
            </div>
            <SelectBox
              className='hover:cursor-pointer text-sm'
              dataSource={descriptionOptions}
              displayExpr={'label'}
              valueExpr='value'
              label='Açıklama'
              labelMode='floating'
              value={
                descriptionOptions?.filter((desc) => desc.value === order.descriptionId)[0]?.value
              }
              onValueChanged={(e) => {
                setOrder({ ...order, descriptionId: e.value });
              }}
            />
          </div>
        </div>
        <div className='flex justify-between flex-row items-end'>
          <CheckBox
            id={'isImmediate'}
            name={'isImmediate'}
            text={'Acil mi?'}
            onValueChanged={(e) => {
              setOrder({ ...order, isImmediate: e.value });
            }}
            checked={order.isImmediate}
          />
          <Button
            appearance={'primary'}
            disabled={Object.values(tree).includes('') ? false : !loading ? true : false}
            onClick={addOrder}
          >
            Sipariş Ekle
          </Button>
        </div>
      </section>{' '}
      {errorModal.visible && (
        <ErrorModal
          title={errorModal.title}
          visible={errorModal.visible}
          onCancel={() => {
            setErrorModal({
              message: '',
              title: '',
              visible: false,
            });
          }}
        >
          <p>{errorModal.message}</p>
        </ErrorModal>
      )}
      {modalOpen && (
        <AddNewDescriptionModal
          visible={modalOpen}
          onVisibleHandler={() => setModalOpen(false)}
          setDescriptions={setDescriptions}
          descriptions={descriptions}
        />
      )}
    </Fragment>
  );
}

export default NewOrderTab;
