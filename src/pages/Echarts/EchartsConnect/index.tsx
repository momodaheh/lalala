import React, { useEffect, useRef, useState } from 'react';
import { CalendarPickerView } from 'antd-mobile';

const EchartsConnect = () => {
  // 设置一个较早的最小日期，允许选择之前的月份
  const [testValue] = useState(1);
  const minDate = new Date('2000-01-01');
  const calendarRef = useRef<any>(null);
  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.jumpToToday();
    }
  }, []);

  const testFun = (num: number) => {
    return new Promise((resolve, _reject) => {
      resolve(num);
    })
  }
  useEffect(() => {
    console.log('start');
    
  }, []);
  useEffect(() => {
    testFun(testValue).then((res) => {
      console.log('123',res);
    })
  }, [testValue]);
  
  return (
    <div>
      <h1>EchartsConnect</h1>
      <CalendarPickerView min={minDate} ref={calendarRef} />
    </div>
  );
};

export default EchartsConnect;
