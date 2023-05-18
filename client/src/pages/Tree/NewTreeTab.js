import React, { useState } from 'react';
import Button from '../../components/Button';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Endpoints } from '../../constants/Endpoints';
import { Capitalize } from '../../utils/Capitalize';
import AddNewTreeOptions from './AddNewTreeOptions';
import { CheckBox, NumberBox, SelectBox, TextBox } from 'devextreme-react';

function NewTreeTab({
  colors,
  options,
  thicks,
  creators,
  waxes,
  todayTrees,
  setTodayTrees,
  jobGroups,
  selectedJobGroup,
  setSelectedJobGroup,
}) {
  const initialState = {
    newTree: {
      treeNo: '',
      listeNo: '',
      agacAuto: false,
      listeAuto: false,
      renkId: '',
      ayarId: '',
      kalınlıkId: '',
      hazırlayanId: '',
      mumTurId: '',
      desc: '',
      date: new Date(),
      jobGroupId: selectedJobGroup,
      isImmediate: false,
    },
    descriptions: [],
    options: [],
    creators: [],
    thicks: [],
    waxes: [],
    treeStatuses: [],
  };
  const [newTree, setNewTree] = useState(initialState.newTree);
  const [addNewTreeOptions, setAddNewTreeOptions] = useState({
    open: false,
    type: '',
  });
  const axiosPrivate = useAxiosPrivate();

  function getBiggestNumber(key) {
    if (!todayTrees || todayTrees.length === 0) {
      return 0;
    }

    let biggest = Number(todayTrees[0][key]);

    todayTrees.forEach((tree) => {
      if (biggest < tree[key]) {
        biggest = Number(tree[key]);
      }
    });
    return biggest;
  }

  const onFormSubmit = async (e) => {
    e.preventDefault();

    let _agacNo = newTree?.treeNo;
    let _listeNo = newTree?.listeNo;
    try {
      if (newTree.jobGroupId === '') {
        throw new Error('İş grubu seçilmedi!');
      }
      if (newTree.agacAuto) {
        _agacNo = getBiggestNumber('treeNo') + 1;
        // set New tree with prev State

        // setNewTree({ ...newTree, treeNo: _agacNo });
      } else {
        todayTrees.forEach((tree) => {
          if (
            tree['treeNo'] === Number(newTree.treeNo) &&
            tree['jobGroupId'] === selectedJobGroup
          ) {
            throw new Error(
              `Tekrar eden bir Agaç numarası girdiniz!. ${
                getBiggestNumber('treeNo') + 1
              } numarasını girebilirsiniz. `,
            );
          }
        });
      }

      if (newTree.listeAuto) {
        _listeNo = getBiggestNumber('listNo') + 1;
      } else {
        todayTrees.forEach((tree) => {
          if (
            tree['listNo'] === Number(newTree.listeNo) &&
            tree['jobGroupId'] === selectedJobGroup
          ) {
            throw new Error(
              `Tekrar eden bir Liste numarası girdiniz!. ${
                getBiggestNumber('listNo') + 1
              } numarasını girebilirsiniz. `,
            );
          }
        });
      }

      if (newTree.agacNo === '' && newTree.agacAuto === false) {
        throw new Error('Agaç Numarası Girilmedi!');
      }
      if (newTree.listeNo === '' && newTree.listeAuto === false) {
        throw new Error('Liste Numarası Girilmedi!');
      }
      if (newTree.renkId === '') {
        throw new Error('Renk Seçilmedi!');
      }
      if (newTree.ayarId === '') {
        throw new Error('Ayar Seçilmedi!');
      }
      if (newTree.kalınlıkId === '') {
        throw new Error('Kalınlık Seçilmedi!');
      }
      if (newTree.hazırlayanId === '') {
        throw new Error('Hazırlayan Seçilmedi!');
      }
      if (newTree.mumTurId === '') {
        throw new Error('Mum Turu Seçilmedi');
      }
      setNewTree({ ...newTree, treeNo: _agacNo, listeNo: _listeNo });
      const treeDate = jobGroups.filter((jobGroup) => jobGroup.id === newTree.jobGroupId)[0].date;

      var treeBody = {
        optionId: newTree.ayarId,
        waxId: newTree.mumTurId,
        creatorId: newTree.hazırlayanId,
        thickId: newTree.kalınlıkId,
        colorId: newTree.renkId,
        date: treeDate,
        listNo: _listeNo,
        treeNo: _agacNo,
        treeStatusId: 1,
        isImmediate: newTree.isImmediate,
        active: true,
        jobGroupId: newTree.jobGroupId,
        desc: newTree.desc,
      };

      await axiosPrivate.post(Endpoints.TREE.MAIN, treeBody, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });

      const controller = new AbortController();
      const res = await axiosPrivate.get(Endpoints.TREE.TODAY, {
        params: {
          jobGroupId: selectedJobGroup,
        },

        signal: controller.signal,
      });
      setTodayTrees(res.data.trees);
      controller.abort();
    } catch (err) {
      window.alert(err);
    }
  };

  const jobGroupOptions = jobGroups.map((jobGroup) => {
    return {
      value: jobGroup.id,
      label: 'No: ' + jobGroup.number,
    };
  });

  return (
    <>
      <form className='space-y-1 border-r border-gray-700 px-4 text-sm' onSubmit={onFormSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-6 '>
          <p className='col-span-12 md:col-span-1 items-center flex flex-row justify-center'>
            İş Grubu
          </p>
          <div className='col-span-12 md:col-span-5'>
            <SelectBox
              className='hover:cursor-pointer text-sm'
              dataSource={jobGroupOptions}
              displayExpr={'label'}
              valueExpr='value'
              value={
                jobGroupOptions?.filter((option) => option.value === selectedJobGroup)[0]?.value
              }
              onValueChanged={(e) => {
                setNewTree({ ...newTree, jobGroupId: e.value });
                setSelectedJobGroup(e.value);
              }}
            />
          </div>
        </div>
        <div className='flex items-center w-full'>
          <TextBox
            className={'text-sm w-full'}
            label={'Açıklama'}
            labelMode={'floating'}
            mode={'text'}
            value={newTree?.desc}
            onValueChanged={(e) => setNewTree({ ...newTree, desc: e.value })}
          />
        </div>
        <div className='flex flex-row items-center justify-between'>
          <NumberBox
            label={'Agaç No'}
            labelMode={'floating'}
            value={newTree?.treeNo}
            min='0'
            onValueChanged={(e) => setNewTree({ ...newTree, treeNo: e.value })}
          />
          <CheckBox
            id='treeNoAuto'
            htmlFor='treeNo'
            text={'Otomatik Artır'}
            value={newTree.agacAuto}
            onValueChanged={(e) => setNewTree({ ...newTree, agacAuto: !newTree.agacAuto })}
          />
        </div>
        <div className='flex flex-row items-center justify-between '>
          <NumberBox
            label={'Liste No'}
            labelMode={'floating'}
            value={newTree?.listeNo}
            min='0'
            onValueChanged={(e) => setNewTree({ ...newTree, listeNo: e.value })}
          />
          <CheckBox
            id={'listeNoAuto'}
            text={'Otomatik Artır'}
            defaultValue={newTree.listeAuto}
            onValueChanged={(e) => setNewTree({ ...newTree, listeAuto: !newTree.listeAuto })}
          />
        </div>

        <div className='grid grid-cols-3 grid-rows-2 '>
          <div className='border border-slate-400'>
            <div className='font-bold flex flex-row items-center justify-around border-b border-slate-400'>
              Renk
            </div>
            <ul
              className={`mt-1 max-h-48  ${
                colors.length > 7 && 'overflow-y-scroll'
              } scroll-m-1 scroll-smooth scroll`}
            >
              {colors.map((color) => {
                return (
                  <li
                    key={color.colorId}
                    className={`${
                      newTree.renkId === color.colorId ? 'bg-gray-300 dark:bg-slate-800' : ''
                    } p-1 hover:cursor-pointer`}
                    onClick={() => {
                      setNewTree({ ...newTree, renkId: color.colorId });
                    }}
                  >
                    {Capitalize(color.colorName)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className='border-r border-t border-b border-slate-400 '>
            <div className='font-bold flex flex-row items-center justify-around border-b border-slate-400'>
              Ayar
            </div>
            <ul
              className={`mt-1 max-h-52  ${
                options.length > 7 && 'overflow-y-scroll'
              } scroll-m-1 scroll-smooth`}
            >
              {options.map((option) => {
                return (
                  <li
                    key={option.optionId}
                    className={`${
                      newTree.ayarId === option.optionId ? 'bg-gray-300 dark:bg-slate-800' : ''
                    } p-1 hover:cursor-pointer`}
                    onClick={() => {
                      setNewTree({ ...newTree, ayarId: option.optionId });
                    }}
                  >
                    {Capitalize(option.optionText)}
                  </li>
                );
              })}
            </ul>
          </div>

          <div className='border border-l-0 border-slate-400'>
            <div className=' font-bold flex flex-row items-center justify-around border-b border-slate-400 '>
              Kalınlık
            </div>
            <ul
              className={`mt-1 max-h-60  ${
                thicks.length > 7 && 'overflow-y-scroll'
              } scroll-m-1 scroll-smooth`}
            >
              {thicks.map((thick) => {
                return (
                  <li
                    key={thick.thickId}
                    className={`${
                      newTree.kalınlıkId === thick.thickId ? 'bg-gray-300 dark:bg-slate-800' : ''
                    } p-1 hover:cursor-pointer`}
                    onClick={() => {
                      setNewTree({ ...newTree, kalınlıkId: thick.thickId });
                    }}
                  >
                    {Capitalize(thick.thickName)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='border border-t-0 border-slate-400'>
            <div className='font-bold flex flex-row items-center justify-around border-b border-slate-400'>
              Hazırlayan
            </div>
            <ul
              className={`mt-1 max-h-60 ${
                creators.length > 9 && 'overflow-y-scroll'
              } scroll-m-1 scroll-smooth`}
            >
              {creators.map((creator) => {
                return (
                  <li
                    key={creator.creatorId}
                    className={`${
                      newTree.hazırlayanId === creator.creatorId
                        ? 'bg-gray-300 dark:bg-slate-800'
                        : ''
                    } p-1 hover:cursor-pointer `}
                    onClick={() => {
                      setNewTree({
                        ...newTree,
                        hazırlayanId: creator.creatorId,
                      });
                    }}
                  >
                    {Capitalize(creator.creatorName)}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className='border-r border-b border-slate-400 col-span-2 md:col-span-1'>
            <div className=' font-bold flex flex-row items-center justify-around border-b border-slate-400 '>
              Mum Türü
            </div>
            <ul
              className={`mt-1 max-h-44  ${
                waxes.length > 7 && 'overflow-y-scroll'
              } scroll-m-1 scroll-smooth`}
            >
              {waxes.map((wax) => {
                return (
                  <li
                    key={wax.waxId}
                    className={`${
                      newTree.mumTurId === wax.waxId ? 'bg-gray-300 dark:bg-slate-800' : ''
                    } p-1 hover:cursor-pointer`}
                    onClick={() => {
                      setNewTree({ ...newTree, mumTurId: wax.waxId });
                    }}
                  >
                    {Capitalize(wax.waxName)}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div className='flex justify-between flex-row items-end'>
          <CheckBox
            id={'isImmediate'}
            name={'isImmediate'}
            text={'Acil mi?'}
            onValueChanged={(e) => {
              setNewTree({ ...newTree, isImmediate: e.value });
            }}
            checked={newTree.isImmediate}
          />

          <Button type='submit' appearance={'primary'}>
            Agaç Ekle
          </Button>
        </div>
      </form>
      {addNewTreeOptions.open ? (
        <AddNewTreeOptions
          open={addNewTreeOptions.open}
          type={addNewTreeOptions.type.toUpperCase()}
          setAddNewTreeOptions={setAddNewTreeOptions}
          toggle={() => setAddNewTreeOptions({ open: false, type: '' })}
        />
      ) : null}
    </>
  );
}

export default NewTreeTab;
