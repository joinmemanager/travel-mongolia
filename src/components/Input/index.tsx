import cn from 'classnames';
import React, { FC, HTMLProps } from 'react';

import styles from './input.module.less';

export const Input: FC<HTMLProps<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={cn({
      [styles.input || '']: styles.input,
      [props.className || '']: props.className,
    })}
  />
);
