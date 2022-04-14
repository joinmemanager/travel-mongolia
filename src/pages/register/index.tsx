import { Input } from 'components';
import { FC } from 'react';

import { AuthMeta } from '@/templates/AuthMeta';

import styles from './register.module.css';

const Register: FC<any> = () => (
  <AuthMeta title="TESLATRADERS | Бүртгүүлэх">
    <div className={styles.Register}>
      <Input />
      <h1>Register</h1>
    </div>
  </AuthMeta>
);

export default Register;
