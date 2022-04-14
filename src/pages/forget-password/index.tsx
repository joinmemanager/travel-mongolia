import { Input } from 'components';
import { FC } from 'react';

import { AuthMeta } from '@/templates/AuthMeta';

import styles from './forget-password.module.css';

const ForgetPassword: FC<any> = () => (
  <AuthMeta title="TESLATRADERS | Нууц үг сэргээх">
    <div className={styles.ForgetPassword}>
      <Input />
      <h1>ForgetPassword</h1>
    </div>
  </AuthMeta>
);

export default ForgetPassword;
