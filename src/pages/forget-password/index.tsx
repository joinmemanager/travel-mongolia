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
      {type === 'success' ? (
        <SuccessType />
      ) : (
        <div className={styles['forget-password']}>
          {type !== 'success' && (
            <AuthHeader
              linkQ="Аль хэдийн бүртгэлтэй юу?"
              linkA="Нэвтрэх"
              href="/login"
            />
          )}

          <div className="forget-password-section">
            {!type && <DefaultType onSubmit={() => setType('password')} />}
            {type === 'password' && (
              <PasswordType onSubmit={() => setType('success')} />
            )}
          </div>
        </div>
      )}
    </AuthMeta>
  );
};

export default ForgetPassword;
