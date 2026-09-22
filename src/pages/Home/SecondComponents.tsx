import React from 'react';

type Props = {
  test: any;
};
const SecondComponents: React.FC<Props> = (props) => {
  return <div>test: {props.test.o}</div>;
};

export default SecondComponents;
