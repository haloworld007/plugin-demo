import React from 'react';
import { Button } from 'antd';
import styles from './index.less';

const Example: React.FC = () => {
  return (
    <div className={styles.example}>
      <Button>hello world</Button>
    </div>
  );
};

export default Example;
