import React, { useEffect, useState } from 'react';

const WallboardItem = ({ wallboard }) => {
  const [remainingTime, setRemainingTime] = useState();
  function parseMillisecondsIntoReadableTime(milliseconds) {
    //Get hours from milliseconds
    var hours = milliseconds / (1000 * 60 * 60);
    var absoluteHours = Math.floor(hours);
    var h = absoluteHours;
    //Get remainder from hours and convert to minutes
    var minutes = (hours - absoluteHours) * 60;
    var absoluteMinutes = Math.floor(minutes);
    var m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes;

    //Get remainder from minutes and convert to seconds
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

  return (
    <div
      className={
        'flex flex-col justify-items-start  px-2 py-4 border border-gray-400 space-y-2 text-xl font-medium'
      }
    >
      <div className={' w-full flex flex-col items-center justify-start'}>
        <h4 className={'text-xl'}>Ağaç Numarası</h4>
        <p className={'font-bold text-4xl'}>{wallboard.treeNo}</p>
      </div>
      {wallboard.isImmediate && (
        <p className={'font-bold text-red-700 text-3xl text-center'}>ACİL</p>
      )}
      <div className={'w-full flex flex-col items-start justify-start'}>
        <p>Ayar : {wallboard.option.optionText}</p>
        <p>Renk : {wallboard.color.colorName}</p>
        <p>Müşteri Adeti : {wallboard.customerQuantity}</p>
      </div>
      <div className={'w-full flex flex-col items-start justify-start'}>
        <p>İşlem Adımı : {wallboard.treeStatus.treeStatusName}</p>
        <p>Son İşlem Saati : {wallboard.statusDate?.treeStatusDate?.slice(11, 16)}</p>
        <p>Tahmini Kalan Süre: {remainingTime} </p>
      </div>
    </div>
  );
};
export default WallboardItem;
