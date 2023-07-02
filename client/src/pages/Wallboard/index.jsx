import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useLocation, useNavigate } from 'react-router-dom';
import { Endpoints } from '../../constants/Endpoints';
import WallboardItem from './WallboardItem';
import Header from '../../components/Header';

function Wallboard() {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const navigate = useNavigate();

  const [wallboards, setWallboards] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    const getWallboardTree = async () => {
      try {
        const response = await axiosPrivate.get(Endpoints.WALLBOARD, {
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
          state: { from: location },
          replace: true,
        });
      }
    };

    getWallboardTree();
    let interval = setInterval(() => {
      getWallboardTree();
    }, 3000);

    return () => {
      clearInterval(interval);
      controller.abort();
    };
  }, []);

  return (
    <div className='space-y-4 h-full'>
      <Header title={'Wallboard'} />

      <div className={'grid xs:grid-cols-1 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-9 gap-2 '}>
        {wallboards.length > 0
          ? wallboards.map((wallboard) => (
              <WallboardItem key={wallboard.treeId} wallboard={wallboard} />
            ))
          : 'BOŞTUR'}
      </div>
    </div>
  );
}

export default Wallboard;
