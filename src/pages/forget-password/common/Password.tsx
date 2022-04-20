import { Input } from 'components';
import Eye from 'icons/eye.svg';
import Lock from 'icons/lock.svg';
import React from 'react';

import AuthTitle from '@/pages/login/common/AuthTitle';
import SubmitButton from '@/pages/login/common/SubmitButton';

const Password = ({ onSubmit }: { onSubmit: () => void }) => (
  <div>
    <AuthTitle title="Шинэ нууц үг" />
    <div className="inputs">
      <Input
        label="Шинэ нууц үг"
        prefix={<Lock style={{ width: 15 }} />}
        suffix={<Eye />}
        placeholder="Шинэ нууц үг"
        type="password"
        name="password"
      />
      <Input
        label="Шинэ нууц үг баталгаажуулах"
        prefix={<Lock style={{ width: 15 }} />}
        suffix={<Eye />}
        placeholder="Шинэ нууц үг баталгаажуулах"
        type="password"
        name="password_repeat"
      />
    </div>
    <SubmitButton onClick={onSubmit}>Илгээх</SubmitButton>
  </div>
);

export default Password;
