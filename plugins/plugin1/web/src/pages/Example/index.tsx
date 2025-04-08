import React from 'react';
import { Button, message } from 'antd';
import styles from './index.less';

const Example: React.FC = () => {
  return (
    <div className={styles.example}>
      <Button onClick={() =>  {
        message.info('hello world')
      }}>hello world</Button>
    </div>
  );
};

export default Example;
