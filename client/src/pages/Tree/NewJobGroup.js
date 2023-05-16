import React from "react";
import Input from "../../components/Input";
import ReactDatePicker from "react-datepicker";
import Button from "../../components/Button";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Endpoints } from "../../constants/Endpoints";
import moment from "moment/moment";
import { locale } from "../../utils/DatePickerLocale";

function NewJobGroup({ jobGroups, setJobGroups, setSelectedJobGroup }) {
  const [newJobGroup, setNewJobGroup] = React.useState({
    date: new Date(),
  });
  const axiosPrivate = useAxiosPrivate();

  const formSubmit = async (e) => {
    e.preventDefault();
    try {
      const findJobGroupCount = jobGroups.filter(
        (jobGroup) =>
          jobGroup.date === moment(newJobGroup.date).format("YYYY-MM-DD")
      ).length;
      if (findJobGroupCount === 1) {
        throw new Error("Aynı tarihli iş grubu zaten oluşturulmuş!");
      }

      if (jobGroups.length === 2) {
        throw new Error("En fazla 2 iş grubu oluşturabilirsiniz!");
      }
      console.log(newJobGroup);
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
      window.alert(err);
    }
  };

  return (
    <>
      <form className="space-y-4" onSubmit={formSubmit}>
        <p className="col-span-12 md:col-span-1">Tarih</p>
        <div className="col-span-12 md:col-span-4">
          <ReactDatePicker
            locale={locale}
            inline
            minDate={new Date()}
            selected={newJobGroup.date}
            onChange={(date) => {
              setNewJobGroup({ ...newJobGroup, date: date });
            }}
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" appearance={"primary"}>
            İş Grubu Ekle
          </Button>
        </div>
      </form>
    </>
  );
}

export default NewJobGroup;
