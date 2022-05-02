import { Input } from 'components';
import EmailIcon from 'icons/email.svg';

import AuthTitle from '@/pages/login/common/AuthTitle';
import SubmitButton from '@/pages/login/common/SubmitButton';

const Default = ({ onSubmit }: { onSubmit: () => void }) => (
  <div>
    <AuthTitle
      title="Нууц үг сэргээх"
      description="Та бүртгэлтэй имэйл хаягаа оруулна уу. Нууц үгээ сэргээхэд тань туслах болно."
    />
    <div className="inputs">
      <Input
        label="Имэйл хаягаа оруулна уу"
        prefix={<EmailIcon style={{ width: 15 }} />}
        placeholder="Имэйл хаяг"
        name="email"
      />
    </div>
    <SubmitButton onClick={onSubmit}>Илгээх</SubmitButton>
  </div>
);

export default Default;
