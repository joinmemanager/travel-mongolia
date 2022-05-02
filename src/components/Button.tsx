import cn from 'classnames';
import React, { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

const ButtonWrapper = styled.button`
  background: linear-gradient(262.53deg, #90ff12 -3.65%, #f9fc47 117.84%);
  border-radius: 4px;
  font-weight: 500;
  font-size: 16px;
  line-height: 19px;
  color: #141414;
  padding: 13px 20px;
`;

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label?: ReactNode | string | number | null | undefined;
}

export const Button = ({
  children,
  label,
  className,
  ...rest
}: ButtonProps) => (
  <ButtonWrapper {...rest} className={cn('button-wrapper', className)}>
    {label}
    {children}
  </ButtonWrapper>
);
