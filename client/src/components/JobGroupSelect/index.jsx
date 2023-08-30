import {SelectBox} from "devextreme-react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {Endpoints} from "../../constants/Endpoints";

export const JobGroupSelect = ({setJobGroupId}) => {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  const [jobGroups, setJobGroups] = useState([]);
  useEffect(() => {
    let isMount = true;
    const controller = new AbortController();
    
    const getJobGroups = async () => {
      try {
        const res = await axiosPrivate.get(Endpoints.JOBGROUP, {
          signal: controller.signal
        });
      isMount && setJobGroups(res.data.jobGroupList);
        
      }catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    }

    getJobGroups();
    

  }, []);
  return (
    <SelectBox placeholder={'İş grubu'} dataSource={jobGroups} displayExpr={"date"} valueExpr={"id"} onValueChanged={(e)=>{
      setJobGroupId(e.value)
    }}  />
  )
}
