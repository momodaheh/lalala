import Guide from '@/components/Guide';
import { trim } from '@/utils/format';
import { PageContainer } from '@ant-design/pro-components';
import { useModel } from '@umijs/max';
import { Select } from 'antd';
import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import ChildComponent from './ChildComponent';
import styles from './index.less';
import SecondComponents from './SecondComponents';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const [selectTest, setSelectTest] = useState([]);
  const testRef = useRef({});
  const setTest = (value: any) => {
    testRef.current = value;
    // setFlag(!flag)
  };
  const selectChange = (value: any) => {
    console.log(value, selectTest);
    setSelectTest(value);
  };
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <motion.div className="bg-lime-600 p-4 mb-4" animate={{ rotate: 360 }}>
          1333333
        </motion.div>
        <Select
          mode="multiple"
          allowClear
          style={{ width: 200 }}
          placeholder="请选择"
          value={selectTest}
          onChange={selectChange}
          labelInValue={true}
          options={[
            {
              label: '选项1',
              value: '1',
            },
            {
              label: '选项2',
              value: '2',
            },
            {
              label: '选项3',
              value: '3',
            },
          ]}
        />
        <Guide name={trim(name)} />
        <ChildComponent setTest={setTest} />
        <SecondComponents test={testRef.current} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            width: 200,
            height: 200,
            backgroundColor: 'red',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              // lineHeight: '200px',
            }}
          >
            666
          </div>
        </div>
        <div 
          style={{display: 'flex'}}
        >
          <div style={{width: 100, height: 100, backgroundColor: 'green'}} />
          <div style={{width: 100, height: 100, backgroundColor: 'blue'}} />
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
