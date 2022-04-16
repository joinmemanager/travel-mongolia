import cn from 'classnames';
import Email from 'icons/email.svg';
import React, { FC, HTMLProps } from 'react';

import styles from './input.module.less';

export type InputProps = HTMLProps<HTMLInputElement> & {
  prefix?: any;
  suffix?: any;
};

export const Input: FC<InputProps> = ({ prefix, suffix, ...props }) => {
  return (
    <div className={cn({ [styles.input || '']: styles.input })}>
      {prefix}
      <span>
        <Email />
      </span>
      <input
        {...props}
        className={cn({
          [props.className || '']: props.className,
        })}
      />
      {suffix}
    </div>
  );
};
