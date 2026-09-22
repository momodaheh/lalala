import { Button } from 'antd';
import React from 'react';

const ChildComponent: React.FC = (props: any) => {
  return (
    <div>
      <Button onClick={() => props.setTest({ o: 123 })}>修改</Button>
    </div>
  );
};

export default ChildComponent;


