import { Button } from 'antd';
import { connect } from 'umi';

type Props = {
  value?: number;
  onChange: (value: number) => void;
  loading?: boolean;
};
const RandomButton = (props: Props) => {
  const { loading, value = 0, onChange: _onChange, dispatch } = props;
  const onClick = () => {
    try {
      let test = dispatch({ type: 'formTest/getRandomNumber' })
      console.log(test);
      
    } catch (error) {
      console.error('获取随机数失败:', error);
    }
  };
  return (
    <>
      {value}
      <Button onClick={onClick} loading={loading}>
        随机数
      </Button>
    </>
  );
};

export default connect(({ formTest: _formTest, loading }: any) => ({
  loading: loading.effects['formTest/getRandomNumber'],
}))(RandomButton);
