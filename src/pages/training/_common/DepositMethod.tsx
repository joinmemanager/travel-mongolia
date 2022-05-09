import ChevronDownIcon from 'icons/chevron-down.svg';
import CopyIcon from 'icons/copy.svg';
import WalletIcon from 'icons/wallet.svg';
import { useState } from 'react';
import QRCode from 'react-qr-code';

import styles from '../training.module.less';
import MethodButton from './MethodButton';

const usdtAddress = '0x47631b1a98724bc20fe2cd0e4af690783071c7c7';
const DepositMethod = () => {
  const [toggle, setToggle] = useState(false);
  const copy = () => {
    const el = document.createElement('textarea');
    el.value = usdtAddress;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
  return (
    <MethodButton
      icon={<WalletIcon />}
      label="Deposit USDT"
      suffix={<ChevronDownIcon width={11} />}
      onClick={() => setToggle(!toggle)}
    >
      {toggle && (
        <div className={styles['deposit-section']}>
          <div className="qr">
            <QRCode value={usdtAddress} size={248} />
          </div>
          <div className="items">
            <div className="item">
              <p className="key">USDT Deposit Address</p>
              <p className="value">
                {usdtAddress}{' '}
                <button className="copy" onClick={copy}>
                  <CopyIcon />
                </button>
              </p>
            </div>
            <div className="item">
              <p className="key">Network</p>
              <p className="value">BNB Smart (Chain BEP 20)</p>
            </div>
          </div>
        </div>
      )}
    </MethodButton>
  );
};
export default DepositMethod;
