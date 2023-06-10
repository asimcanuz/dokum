import React from 'react';
import Button from '../../components/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import moment from 'moment/moment';
import { Calendar } from 'devextreme-react';
import { Endpoints } from '../../constants/Endpoints';
import ErrorModal from '../../components/ErrorModal';

function NewJobGroup({ jobGroups, setJobGroups, setSelectedJobGroup }) {
  const [newJobGroup, setNewJobGroup] = React.useState({
    date: new Date(),
  });

  const [errorModal, setErrorModal] = React.useState({
    visible: false,
    message: '',
    title: '',
  });
  const axiosPrivate = useAxiosPrivate();

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const findJobGroupCount = jobGroups.filter(
        (jobGroup) => jobGroup.date === moment(newJobGroup.date).format('YYYY-MM-DD'),
      ).length;
      if (findJobGroupCount === 1) {
        throw new Error('Aynı tarihli iş grubu zaten oluşturulmuş!');
      }

      if (jobGroups.length === 2) {
        throw new Error('En fazla 2 iş grubu oluşturabilirsiniz!');
      }
      const response = await axiosPrivate.post(Endpoints.JOBGROUP, newJobGroup);
      setSelectedJobGroup(response.data.jobGroup.id);

      if (response.status === 200) {
        const getJobGroups = async () => {
          try {
            const response = await axiosPrivate.get(Endpoints.JOBGROUP);
            setJobGroups(response.data.jobGroupList);
          } catch (err) {
            console.error(err);
          }
        };
        getJobGroups();
      }
    } catch (err) {
      setErrorModal({
        visible: true,
        message: err.message,
        title: 'Sipariş Ekleme Hatası',
      });
    }
  };

  return (
    <>
      <form className='space-y-4' onSubmit={formSubmit}>
        <p className='col-span-12 md:col-span-1'>Tarih</p>
        <div className='col-span-12 md:col-span-4'>
          <Calendar
            min={new Date()}
            value={newJobGroup.date}
            onValueChanged={(e) => {
              setNewJobGroup({ ...newJobGroup, date: e.value });
            }}
          />
        </div>
        <div className='flex justify-end'>
          <Button type='submit' appearance={'primary'}>
            İş Grubu Ekle
          </Button>
        </div>
      </form>
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
    </>
  );
}

export default NewJobGroup;
