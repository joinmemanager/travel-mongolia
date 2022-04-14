import { Input } from 'components';
import { FC } from 'react';

import { AuthMeta } from '@/templates/AuthMeta';

import styles from './login.module.css';

const Login: FC<any> = () => (
  <AuthMeta title="TESLATRADERS | Нэвтрэх">
    <div className={styles.login}>
      <Input />
      <h1>Login</h1>
    </div>
  </AuthMeta>
);

export default Login;
