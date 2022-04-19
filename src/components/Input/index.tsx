import cn from 'classnames';
import React, { FC, HTMLProps } from 'react';

import styles from './input.module.less';

export interface InputProps extends HTMLProps<HTMLInputElement> {
  prefix?: any;
  suffix?: any;
  label?: any;
  errorText?: string;
  error?: boolean;
}

export const Input: FC<InputProps> = ({
  prefix,
  suffix,
  label,
  name,
  errorText,
  error,
  ...props
}) => {
  return (
    <>
      {label && (
        <label htmlFor={label + name} className={styles.label}>
          {label}
        </label>
      )}
      <div
        className={cn('input-comp', {
          [styles.input || '']: styles.input,
          [name || '']: name,
          error: name,
        })}
      >
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          {...props}
          id={label + name || ''}
          className={cn('html-input', {
            [props.className || '']: props.className,
          })}
        />
        {suffix && <span className="suffix">{suffix}</span>}
        {!!error && <span className="error">{errorText}</span>}
      </div>
    </>
  );
};
