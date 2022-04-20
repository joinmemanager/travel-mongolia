import React, { FC, useState } from 'react';

import AuthHeader from '@/pages/login/common/AuthHeader';
import { AuthMeta } from '@/templates/AuthMeta';

import DefaultType from './common/Default';
import PasswordType from './common/Password';
import SuccessType from './common/Success';
import styles from './forget-password.module.less';

const ForgetPassword: FC<any> = () => {
  const [type, setType] = useState('');
  return (
    <AuthMeta title="TESLATRADERS | Нууц үг сэргээх">
      <div className={styles['forget-password']}>
        {type !== 'success' && (
          <AuthHeader
            linkQ="Аль хэдийн бүртгэлтэй юу?"
            linkA="Нэвтрэх"
            href="/register"
          />
        )}

        {!type && <DefaultType onSubmit={() => setType('password')} />}
        {type === 'password' && (
          <PasswordType onSubmit={() => setType('success')} />
        )}
        {type === 'success' && <SuccessType />}
      </div>
    </AuthMeta>
  );
};

export default ForgetPassword;
