import FacebookIcon from 'icons/socials/facebook-circle.svg';
import GoogleIcon from 'icons/socials/google-circle.svg';
import React from 'react';

import styles from './AuthOr.module.less';

const AuthOr = () => (
  <div className={styles['auth-or']}>
    <p className="or-text">эсвэл</p>
    <div className="links">
      <button>
        <FacebookIcon />
      </button>
      <button>
        <GoogleIcon />
      </button>
    </div>
  </div>
);

export default AuthOr;
