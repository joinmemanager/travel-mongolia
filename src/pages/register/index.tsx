import cn from 'classnames';
import { Input } from 'components';
import CheckmarkIcon from 'icons/checkmark.svg';
import Email from 'icons/email.svg';
import Eye from 'icons/eye.svg';
import Lock from 'icons/lock.svg';
import img from 'images/vector/big-bulb.png';
import React, { FC, useState } from 'react';

import AuthHeader from '@/pages/login/common/AuthHeader';
import AuthOr from '@/pages/login/common/AuthOr';
import AuthTitle from '@/pages/login/common/AuthTitle';
import SubmitButton from '@/pages/login/common/SubmitButton';
import { AuthMeta } from '@/templates/AuthMeta';

import styles from './register.module.less';

const Register: FC<any> = () => {
  const [check, setCheck] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <AuthMeta title="TESLATRADERS | Бүртгүүлэх">
      {success ? (
        <div className={styles.success}>
          <AuthHeader href="#" />
          <div className="content">
            <img src={img?.src} alt="" />
            <p>Амжилттай бүртгэл үүсгэлээ</p>
          </div>
        </div>
      ) : (
        <div className={styles.register}>
          <AuthHeader
            linkQ="Аль хэдийн бүртгэлтэй юу?"
            linkA="Нэвтрэх"
            href="/register"
          />
          <AuthTitle title="Бүртгүүлэх" />
          <div className="inputs">
            <div className="full_name">
              <div className="fn">
                <Input label="Овог" name="first_name" />
              </div>
              <div className="ln">
                <Input label="Нэр" name="last_name" />
              </div>
            </div>
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
              type="password"
              name="password"
            />
            <Input
              label="Нууц үг давтах"
              prefix={<Lock style={{ width: 15 }} />}
              suffix={<Eye />}
              placeholder="Нууц үг давтах"
              type="password"
              name="password_repeat"
            />
          </div>
          <div className="terms-cond" onClick={() => setCheck(!check)}>
            <span className={cn('check', { checked: check })}>
              <CheckmarkIcon />
            </span>
            <span className="term">
              <a href="#">Үйлчилгээний нөхцөл</a> болон{' '}
              <a href="#">Нууцлалын бодлогыг</a> хүлээн зөвшөөрч байна.
            </span>
          </div>
          <AuthOr />

          <SubmitButton onClick={() => setSuccess(true)} type="button">
            Бүртгүүлэх
          </SubmitButton>
        </div>
      )}
    </AuthMeta>
  );
};

export default Register;
