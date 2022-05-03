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
  display: flex;
  align-items: center;
  justify-content: center;

  &.btn {
    &-secondary {
      background: #f4f4f4;
    }
  }

  &.flex {
    flex: 1;
  }
  &.block {
    width: 100%;
  }
`;

export interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  label?: ReactNode | string | number | null | undefined;
  type?: 'secondary' | null | undefined;
  flex?: boolean;
  block?: boolean;
}

export const Button = ({
  children,
  label,
  className,
  type,
  block,
  flex,
  ...rest
}: ButtonProps) => (
  <ButtonWrapper
    {...rest}
    className={cn('button-wrapper', className, {
      [`btn-${type}`]: type,
      block,
      flex,
    })}
  >
    {label}
    {children}
  </ButtonWrapper>
);
