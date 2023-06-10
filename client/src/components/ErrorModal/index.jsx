import React from 'react';
import Modal from '../Modal/Modal';
import ModalHeader from '../Modal/ModalHeader';
import ModalBody from '../Modal/ModalBody';
import ModalFooter from '../Modal/ModalFooter';
import Button from '../Button';

function ErrorModal({ apperance, visible, title, onCancel, children }) {
  return (
    <Modal open={visible} size={'small'} toogle={onCancel}>
      <ModalHeader title={title} toogle={() => onCancel()} />
      <ModalBody>{children}</ModalBody>
      <ModalFooter>
        <Button appearance={'success'} onClick={() => onCancel()}>
          Tamam
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default ErrorModal;
