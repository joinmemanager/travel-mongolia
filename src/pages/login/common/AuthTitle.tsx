import React from 'react';

import styles from './AuthTitle.module.less';

const AuthTitle = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => (
  <div className={styles['auth-form-title']}>
    {!!title && <h1 className={styles.title}>{title}</h1>}
    {!!description && <p className={styles.description}>{description}</p>}
  </div>
);

export default AuthTitle;
