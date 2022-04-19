import cn from 'classnames';
import React, { FC, HTMLProps } from 'react';

import styles from './SubmitButton.module.less';

type SubmitButtonProps = HTMLProps<HTMLButtonElement> & { label: string };

const SubmitButton: FC<SubmitButtonProps> = ({ label, className }) => (
  <button
    className={cn('submit-button', {
      [styles.button || '']: styles.button,
      [className || '']: className,
    })}
  >
    {label}
  </button>
);

export default SubmitButton;
