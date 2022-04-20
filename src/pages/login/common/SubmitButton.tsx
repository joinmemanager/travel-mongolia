import cn from 'classnames';
import React, { FC, HTMLProps } from 'react';

import styles from './SubmitButton.module.less';

const SubmitButton: FC<HTMLProps<HTMLButtonElement> & { htmlType?: any }> = ({
  children,
  className,
  htmlType,
  ...props
}) => (
  <button
    {...props}
    type={htmlType}
    className={cn('submit-button', {
      [styles.button || '']: styles.button,
      [className || '']: className,
    })}
  >
    {children}
  </button>
);

export default SubmitButton;
