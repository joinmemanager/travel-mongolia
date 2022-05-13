import cn from 'classnames';
import logo from 'images/logo-full-white.png';
import Link, { LinkProps } from 'next/link';
import React, { FC } from 'react';

import styles from './AuthHeader.module.less';

type AuthHeaderProps = LinkProps & {
  linkQ?: string;
  linkA?: string;
};

const AuthHeader: FC<AuthHeaderProps> = ({ linkQ, linkA = '', href }) => (
  <div
    className={cn('auth-form-header', { [styles.header || '']: styles.header })}
  >
    <Link href="/" passHref>
      <img src={logo?.src} alt="" className="logo" height={50} />
    </Link>
    <Link href={href} passHref>
      <div className="register-link">
        {!!linkQ && <span className="q">{linkQ}</span>}
        {!!linkA && <span className="a">{linkA}</span>}
      </div>
    </Link>
  </div>
);

export default AuthHeader;
