import { Input } from 'components';
import Email from 'icons/email.svg';
import Eye from 'icons/eye.svg';
import Lock from 'icons/lock.svg';
import Link from 'next/link';
import React, { FC } from 'react';

import { AuthMeta } from '@/templates/AuthMeta';

import AuthHeader from './common/AuthHeader';
import AuthOr from './common/AuthOr';
import AuthTitle from './common/AuthTitle';
import SubmitButton from './common/SubmitButton';
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
        <div className="login-section">
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
              type="password"
            />
            <Link href="/forget-password" passHref>
              <span className="forget-password">Нууц үг сэргээх?</span>
            </Link>
          </div>
          <AuthOr />
          <SubmitButton>Нэвтрэх</SubmitButton>
        </div>
      </div>
    </AuthMeta>
  );
};

export default Login;
