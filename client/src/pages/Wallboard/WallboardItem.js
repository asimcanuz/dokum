import React, {useEffect, useState} from 'react';
import statusColor from "../../utils/StatusColor";

/**
 * hazırlanıyor - dökümde - döküldü - kesimde
 * Hazırlanıyor durumundan sonra saymaya bailar
 * adım sürelerinin geri sayımını yapar
 *
 */

const WallboardItem = ({wallboard}) => {
  const [remainingTime, setRemainingTime] = useState();
  const [colorClass, setColorClass] = useState('');

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
      let hours = milliseconds / (1000 * 60 * 60);
      let absoluteHours = Math.ceil(hours);
      h = absoluteHours === 0 ? "-" + absoluteHours : absoluteHours;
      m = (Number(m) - 60) * -1;
      s = (Number(s) - 60) * -1;
      s = s > 9 ? s : '0' + s;
      m = m > 9 ? m : '0' + m;
    }

    return h + ':' + m + ':' + s;
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

    let _status = wallboard.treeStatus.treeStatusName;
    let _color = statusColor(_status);
   
    if(duration<0 && _status!=='Hazırlanıyor') {
      setColorClass("bg-red-300")
    }else{
      setColorClass(_color);
    }
    
    
    setRemainingTime(time);

  };

  useEffect(() => {
    let intervalId = setInterval(() => {
      remaininTime();
    }, 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [wallboard]);
  


  return (
    <div
      className={`rounded-md inline-grid grid-cols-2 gap-2 justify-items-start  px-2 py-4 border border-gray-400 text-xl font-medium ${colorClass}`}
    >
      <div className={'rounded-md w-16 text-center'}>

        <p className={'font-bold text-5xl text-black'}>{wallboard.treeNo}</p>
      </div>


      <div
        className={`rounded-md  w-24 ${wallboard.isImmediate ? 'bg-red-700  text-white' : 'bg-transparent'}  font-bold text-4xl text-center`}>

        {wallboard.isImmediate && (
          <p>ACİL</p>
        )}
      </div>


      <div className={'text-center'}>
        <p className={'text-center'}> {wallboard.option.optionText}</p>
      </div>
      <div>
        <p className={'text-center'}>{wallboard.color.colorName}</p>
      </div>

      <div>

        <p className={'text-center'}>{wallboard.treeStatus.treeStatusName}</p>


      </div>

      <div>
        <p className={'text-center'}>({wallboard.statusDate?.updatedAt?.slice(11, 16)})</p>
      </div>
      <div></div>
      <div>
        <p className={`${wallboard.treeStatus.treeStatusName==='Hazırlanıyor' && 'text-transparent'}`}> {remainingTime} </p>
      </div>

    </div>
  );
};


export default WallboardItem;
