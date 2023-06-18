import React, { useState } from 'react';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ModalFooter from '../../components/Modal/ModalFooter';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';

function AddNewDescriptionModal({ visible, onVisibleHandler, setDescriptions, descriptions }) {
  const [newDescription, setNewDescription] = useState('');
  const axiosPrivate = useAxiosPrivate();

  const onSubmit = async () => {
    try {
      let descRes = await axiosPrivate.post(
        Endpoints.DESCRIPTION,
        { descriptionText: newDescription },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        },
      );

      if (descRes.status === 200) {
        const { descriptionId, descriptionText } = descRes.data.description;

        descriptions.push({
          descriptionId,
          descriptionText,
        });

        setDescriptions(descriptions);
        onVisibleHandler();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Modal open={visible} toogle={onVisibleHandler}>
      <ModalHeader title={'Yeni açıklama ekle'} toogle={onVisibleHandler} />
      <ModalBody>
        <form>
          <label htmlFor='newDescription'>Açıklama</label>
          <Input
            type={'text'}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
        </form>
      </ModalBody>
      <ModalFooter>
        <Button appearance={'danger'} onClick={onVisibleHandler}>
          İptal Et
        </Button>
        <Button appearance={'success'} onClick={onSubmit}>
          Kaydet
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default AddNewDescriptionModal;
