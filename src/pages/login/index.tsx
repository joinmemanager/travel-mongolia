import { Input } from 'components';
import Email from 'icons/email.svg';
import Eye from 'icons/eye.svg';
import Lock from 'icons/lock.svg';
import Link from 'next/link';
import React, { FC } from 'react';

import { AuthMeta } from '@/templates/AuthMeta';

import AuthHeader from './common/AuthHeader';
import AuthTitle from './common/AuthTitle';
import styles from './login.module.less';

const Login: FC<any> = () => {
  return (
    <AuthMeta title="TESLATRADERS | Нэвтрэх">
      <div className={styles.login}>
        <AuthHeader
          linkQ="Бүртгэлгүй юу?"
          linkA="Энд дарж бүртгүүлнэ үү."
          href="/register"
        />
        <AuthTitle title="Нэвтрэх" />
        <div className="inputs">
          <Input
            label="Имэйл хаяг"
            prefix={<Email />}
            placeholder="Имэйл хаяг"
            name="email"
          />
          <Input
            label="Нууц үг"
            prefix={<Lock style={{ width: 15 }} />}
            suffix={<Eye />}
            placeholder="Нууц үг"
            name="password"
          />
          <Link href="/forget-password">
            <span className="forget-password">Нууц үг сэргээх?</span>
          </Link>
        </div>
        <h1>Login</h1>
      </div>
    </AuthMeta>
  );
};

export default Login;
