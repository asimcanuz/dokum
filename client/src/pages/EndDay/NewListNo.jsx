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
  const [listNo, setListNo] = useState(1);
  const [listNoList, setListNoList] = useState([]);
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

        setListNoList(res.data);
      } catch (error) {
        console.error(error);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getTrees();
  }, [replaceJobGroup]);
  return (
    <Modal open={open}>
      <ModalHeader title={'Liste Numarası güncelle'} toggle={toggle} />
      <ModalBody>
        <Input
          type={'number'}
          placeholder={'Liste numarası'}
          value={listNo}
          min='1'
          onChange={(e) => setListNo(e.target.value)}
        />
        {console.log(listNo)}
        <span
          className={
            listNo === ''
              ? 'text-red-500'
              : listNoList?.includes(parseInt(listNo))
              ? 'text-red-600'
              : 'text-green-600'
          }
        >
          {listNo === ''
            ? 'Taşımaya uygun değildir. Lütfen geçerli bir sayı giriniz'
            : listNoList?.includes(parseInt(listNo))
            ? 'Yeni iş grubunda aynı liste numarası vardı'
            : 'Taşımaya uygundur'}
        </span>
      </ModalBody>
      <ModalFooter>
        <Button appearance={'danger'} onClick={() => toggle()}>
          İptal
        </Button>
        <Button
          appearance={'success'}
          disabled={listNoList?.includes(parseInt(listNo)) || listNo === 0 || listNo === ''}
          onClick={async () => {
            await axiosPrivate
              .put(Endpoints.FINISHDAY + '/date', {
                treeId: replacedTree.treeId,
                jobGroupId: replaceJobGroup,
                listNo: listNo,
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
