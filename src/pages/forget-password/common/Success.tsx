import shield from 'images/vector/shield-up.png';
import React from 'react';

import AuthHeader from '@/pages/login/common/AuthHeader';

import styles from '../forget-password.module.less';

const Success = () => (
  <div className={styles.success}>
    <div className={styles.success}>
      <AuthHeader href="#" />
      <div className="content">
        <img src={shield?.src} alt="" />
        <p>Нууц үг амжилттай шинэчлэгдлээ</p>
      </div>
    </div>
  </div>
);

export default Success;
