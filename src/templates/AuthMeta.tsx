import { FC } from 'react';

import { IMetaProps, Meta } from '@/layout/Meta';

import styles from './AuthMeta.module.less';

export const AuthMeta: FC<IMetaProps & any> = ({
  children,
  title,
  description,
}) => (
  <div className={styles['login-wrapper']}>
    <Meta title={title} description={description} />
    <div className={styles['auth-section']}>{children}</div>
  </div>
);
