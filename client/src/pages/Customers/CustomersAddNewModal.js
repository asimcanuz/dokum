import React from 'react';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button';
import { useFormik } from 'formik';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/Input';
import CheckBox from '../../components/Input/CheckBox';
import { Endpoints } from '../../constants/Endpoints';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  accountNumber: Yup.number()
    .typeError('Sadece numara girilmelidr')
    .min(1)
    .required('Hesap numarası zorunludur.'),
  customerName: Yup.string().required('Müşteri adı zorunludur.'),
  email: Yup.string().email('Geçerli bir email adresi giriniz.'),
  phone: Yup.number()
    .typeError('Telefon numarası girilmelidir.')
    .positive('Telefon numarası negatif sayı olamaz.')
    .min(8, 'Telefon numarası minimum 8 karakter olmalıdır.')
    .required('Telefon numarası zorunludur.'),
});

function CustomerAddNewModal({ open, toggle, size, customers, setCustomers, setReqController }) {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const formik = useFormik({
    initialValues: {
      accountNumber: '',
      customerName: '',
      email: '',
      phone: '',
      isActive: 1,
    },

    validationSchema: FormSchema,
    onSubmit: async (values) => {
      var customer = {
        accountNumber: values.accountNumber,
        customerName: values.customerName,
        email: values.email,
        phone: values.phone,
        createdBy: auth.id,
        updatedBy: auth.id,
        isActive: values.isActive,
      };

      try {
        const response = await axiosPrivate.post(Endpoints.CUSTOMERS.ADD_NEW, customer, {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        });
        if (response.status === 200) {
          // customers.push(customer);
          // setCustomers([...customers]);
          setReqController(true);
        }
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Modal open={open} size={size}>
      <ModalHeader title={'Yeni Müşteri Ekle'} toogle={toggle} />
      <ModalBody>
        <div className='flex flex-col'>
          <form>
            <div className='flex flex-col'>
              <div className='mb-6'>
                <label htmlFor='accountNumber'> Hesap Numarası </label>
                <Input
                  id={'accountNumber'}
                  name={'accountNumber'}
                  type={'text'}
                  placeholder={'Hesap Numarası'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.accountNumber}
                  required
                />
                {formik.errors.accountNumber && formik.touched.accountNumber && formik.dirty ? (
                  <div className='text-red-500 text-sm'>{formik.errors.accountNumber}</div>
                ) : null}
              </div>
              <div className='mb-6'>
                <label htmlFor='customerName'> Müşteri Adı</label>
                <Input
                  id={'customerName'}
                  name={'customerName'}
                  type={'text'}
                  placeholder={'Müşteri Adı'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.customerName}
                  required
                />
                {formik.errors.customerName && formik.touched.customerName ? (
                  <div className='text-red-500 text-sm'>{formik.errors.customerName}</div>
                ) : null}
              </div>
              <div className='mb-6'>
                <label htmlFor='email'> Email </label>
                <Input
                  id={'email'}
                  name={'email'}
                  type={'text'}
                  placeholder={'Email'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  required
                />
                {formik.errors.email && formik.touched.email ? (
                  <div className='text-red-500 text-sm'>{formik.errors.email}</div>
                ) : null}
              </div>
              <div className='mb-6'>
                <label htmlFor='phone'> Telefon Numarası </label>
                <Input
                  id={'phone'}
                  name={'phone'}
                  type={'text'}
                  placeholder={'Hesap Numarası'}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  required
                />
                {formik.errors.phone && formik.touched.phone ? (
                  <div className='text-red-500 text-sm'>{formik.errors.phone}</div>
                ) : null}
              </div>
              <div className='mb-6'>
                <div className='form-group form-check'>
                  <CheckBox
                    id={'isActive'}
                    name={'isActive'}
                    label={'Aktif Müşteri'}
                    onChange={(e) => {
                      formik.setFieldValue('isActive', e.target.checked);
                    }}
                    checked={formik.values.isActive}
                    // checked
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button appearance={'danger'} onClick={toggle}>
          İptal
        </Button>

        <Button
          type='submit'
          appearance={'success'}
          disabled={
            !formik.isValid ||
            formik.values.accountNumber === '' ||
            formik.values.customerName === '' ||
            formik.values.email === '' ||
            formik.values.phone === ''
          }
          onClick={async () => {
            await formik.handleSubmit();

            await toggle();
          }}
        >
          Kaydet
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default CustomerAddNewModal;
