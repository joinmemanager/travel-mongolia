import img from 'images/vector/big-bulb.png';
import React from 'react';

import AuthHeader from '@/pages/login/common/AuthHeader';
import { AuthMeta } from '@/templates/AuthMeta';

import styles from './success.module.less';

const Registered = () => (
  <AuthMeta title="TESLATRADERS | Бүртгүүлэх">
    <div className={styles.success}>
      <AuthHeader href="#" />
      <div className="content">
        <img src={img?.src} alt="" />
        <p>Амжилттай бүртгэл үүсгэлээ</p>
      </div>
    </div>
  </AuthMeta>
);

export default Registered;
