import React, {useEffect, useState, useMemo} from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {useLocation, useNavigate} from 'react-router-dom';
import {Endpoints} from '../../constants/Endpoints';
import WallboardItem from './WallboardItem';
import Header from '../../components/Header';
import WallboardFilter from './WallboardFilter';
import {JobGroupSelect} from "../../components/JobGroupSelect";
import Alert from "../../components/Alert/Alert";

function Wallboard() {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();
  const [wallboards, setWallboards] = useState([]);
  const [filter, setFilter] = useState({
    filterText: '',
    filterField: '',
  });

  const [jobGroupId, setJobGroupId] = useState(null);


  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const getWallboardTree = async () => {
      if (jobGroupId !== null && jobGroupId !== undefined) {
        try {
          const response = await axiosPrivate.get(Endpoints.WALLBOARD, {
            params: {
              jobGroupId: jobGroupId
            },
            signal: controller.signal,
          });

          if (isMounted) {
            let treeStatusDate = response.data.treeStatusDate;
            let trees = [];
            response.data.trees.forEach((wallboard) => {
              let treeStatus = treeStatusDate.find(
                (statusDate) => parseInt(statusDate.treeId) === wallboard.treeId,
              );
              wallboard['statusDate'] = treeStatus;
              trees.push(wallboard);
            });
            setWallboards(trees);
          }
        } catch (error) {
          console.error(error);
          navigate('/login', {
            state: {from: location},
            replace: true,
          });
        }
      }
    };
    const getTreeStatus = async ()=>{
      
    };

    getWallboardTree();
    let interval = setInterval(() => {
      getWallboardTree();
    }, 30000);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, [jobGroupId]);

  const filteredWallboard = useMemo(() => {
    let wallboardItems = wallboards;


    if (filter.filterField !== '' && filter.filterText !== '' && wallboards.length > 0) {
      if (filter.filterField === 'optionId') {
        wallboardItems = wallboardItems.filter(wallboard => wallboard.option.optionText.toLowerCase().includes(filter.filterText.toLowerCase())
        );
      } else if (filter.filterField === 'colorId') {
        wallboardItems = wallboardItems.filter(wallboard => wallboard.color.colorName.toLowerCase().includes(filter.filterText.toLowerCase()));
      }
    }
    return wallboardItems;
    
  }, [wallboards, filter.filterField, filter.filterText]);

  console.log(filteredWallboard)

  return (
    <div className='space-y-4 h-full'>
      <Header title={'Wallboard'}/>
      <div className={"flex flex-row justify-between"}>
        <JobGroupSelect setJobGroupId={setJobGroupId}/>
        <WallboardFilter filter={filter} setFilter={setFilter}/>
      </div>

      {jobGroupId !== null && jobGroupId !== undefined ?
        <div className={'grid xs:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-9 gap-2 '}>
          {filteredWallboard.length > 0
            ? filteredWallboard.map((wallboard) => (
              <WallboardItem key={wallboard.treeId} wallboard={wallboard}/>
            ))
            : 'BOŞTUR'}
        </div> : <Alert apperance={"danger"}>
          İş Grubu Seçiniz
        </Alert>}
    </div>
  );
}

export default Wallboard;
