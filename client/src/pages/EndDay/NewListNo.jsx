import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal/Modal';
import ModalHeader from '../../components/Modal/ModalHeader';
import ModalBody from '../../components/Modal/ModalBody';
import ModalFooter from '../../components/Modal/ModalFooter';
import Button from '../../components/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { useLocation, useNavigate } from 'react-router-dom';
import Input from '../../components/Input';

function NewListNo({ open, toggle, replaceJobGroup, replacedTree, getTrees }) {
  const [treeNo, setTreeNo] = useState(1);
  const [treeNoList, setTreeNoList] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const controller = new AbortController();

    const getTrees = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.JOBGROUP + '/listNo', {
          params: {
            jobGroupId: replaceJobGroup,
          },
          signal: controller.signal,
        });

        setTreeNoList(res.data);
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getTrees();
  }, [replaceJobGroup]);
  return (
    <Modal open={open}>
      <ModalHeader title={'Ağaç Numarası güncelle'} toggle={toggle} />
      <ModalBody>
        <Input
          type={'number'}
          placeholder={'Ağaç numarası'}
          value={treeNo}
          min='1'
          onChange={(e) => setTreeNo(e.target.value)}
        />
        <span
          className={
            treeNo === ''
              ? 'text-red-500'
              : treeNoList?.includes(parseInt(treeNo))
              ? 'text-red-600'
              : 'text-green-600'
          }
        >
          {treeNo === ''
            ? 'Taşımaya uygun değildir. Lütfen geçerli bir sayı giriniz'
            : treeNoList?.includes(parseInt(treeNo))
            ? 'Yeni iş grubunda aynı ağaç numarası vardı'
            : 'Taşımaya uygundur'}
        </span>
      </ModalBody>
      <ModalFooter>
        <Button appearance={'danger'} onClick={() => toggle()}>
          İptal
        </Button>
        <Button
          appearance={'success'}
          disabled={treeNoList?.includes(parseInt(treeNo)) || treeNo === 0 || treeNo === ''}
          onClick={async () => {
            await axiosPrivate
              .put(Endpoints.FINISHDAY + '/date', {
                treeId: replacedTree.treeId,
                jobGroupId: replaceJobGroup,
                treeNo: treeNo,
              })
              .then(async () => {
                await getTrees();
                await toggle();
              });
          }}
        >
          Güncelle
        </Button>
      </ModalFooter>
    </Modal>
  );
}

export default NewListNo;
