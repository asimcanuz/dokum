import React, { useEffect, useState } from 'react';

const WallboardItem = ({ wallboard }) => {
  const [remainingTime, setRemainingTime] = useState();
  function parseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours;
    //Get reminder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get reminder from minutes and convert to seconds
    var seconds = (minutes - absoluteMinutes) * 60;
    var absoluteSeconds = Math.floor(seconds);
    var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
    if (milliseconds < 0) {
      h = h * -1;
      m = (Number(m) - 60) * -1;
      s = (Number(s) - 60) * -1;
      s = s > 9 ? s : '0' + s;
      m = m > 9 ? m : '0' + m;
    }

    if (setRemainingTime > wallboard.treeStatus.statusCompleteTime) {
      return 'Zaman Doldu';

    }
    else {
      return h + ':' + m + ':' + s;
    }
  }

  let remaininTime = () => {
    const wallboardStatusDate = wallboard.statusDate.createdAt;

    const wallboardTreeStatus = wallboard.treeStatus.statusCompleteTime;
    const now = new Date();
    const wallboardStatusDateTime = new Date(wallboardStatusDate);
    let [hour, minutes, seconds] = wallboardTreeStatus.split(':');
    wallboardStatusDateTime.setHours(wallboardStatusDateTime.getHours() + parseInt(hour));
    wallboardStatusDateTime.setMinutes(wallboardStatusDateTime.getMinutes() + parseInt(minutes));
    wallboardStatusDateTime.setSeconds(wallboardStatusDateTime.getSeconds() + parseInt(seconds));

    let duration = wallboardStatusDateTime - now;
    let time = parseMillisecondsIntoReadableTime(duration);




    setRemainingTime(time);




  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      remaininTime();
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  //  return (
  //    <div 
  //      className={'rounded-md inline-grid grid-cols-2 gap-5 justify-items-start  px-2 py-4 border border-gray-400 space-y-2 text-xl font-medium'
  //      }
  //    >
  //      <div >

  //        <p className={'font-bold text-4xl'}>{wallboard.treeNo}</p>
  //      </div>
  //      <div >

  //      {wallboard.isImmediate && (
  //        <p className={'font-bold text-red-700 text-3xl text-center'}>ACİL</p>
  //        )}
  //      </div>


  //      {/*<div className={'w-full flex flex-col items-start justify-start'}>*/}
  //      <p >{/*Ayar :*/} {wallboard.option.optionText}</p>
  //        <p>{/*Renk :*/} {wallboard.color.colorName}</p>
  //      {/*  <p>Müşteri Adeti : {wallboard.customerQuantity}</p>*/}
  //      {/*</div>*/}
  //      <div className={'w-full flex flex-col items-start justify-start'}>
  //     {/* İŞLEM ADIMI*/}
  //        <p>{wallboard.treeStatus.treeStatusName}-{wallboard.statusDate?.updatedAt?.slice(11, 16)}</p>
  //{/*        <p>*/}{/*Son İşlem Saati :*/}{/* {wallboard.statusDate?.updatedAt?.slice(11, 16)}</p>*/}
  //        <p>{/*Tahmini Kalan Süre:*/} {remainingTime} </p>
  //      </div>
  //    </div>
  //  );
  //};



  return (
    <div
      className={'rounded-md inline-grid grid-cols-2 gap-2 justify-items-start  px-2 py-4 border border-gray-400 text-xl font-medium'
      }
    >
      <div className={'rounded-md border border-gray-400  w-16 bg-orange-300 text-center   '} >

        <p className={'font-bold text-4xl'}>{wallboard.treeNo}</p>
      </div>


      <div className={'rounded-md border border-red-400 w-24 bg-orange-300  text-red-700  font-bold text-4xl text-center'}>

        {wallboard.isImmediate && (
          <p>ACİL</p>
        )}
      </div>


      <div className={ 'text-center'} >
        <p className={'text-center'}  > {wallboard.option.optionText}</p>
      </div>
      <div>
        <p className={'text-center'} >{wallboard.color.colorName}</p>
      </div>

      <div >

        <p className={'text-center'} >{wallboard.treeStatus.treeStatusName}</p>


      </div>

      <div>
        <p className={'text-center'} >({wallboard.statusDate?.updatedAt?.slice(11, 16)})</p>
      </div>
      <div></div>
      <div>
        <p> {remainingTime} </p>
      </div>

    </div>
  );
};


export default WallboardItem;
