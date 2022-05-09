import React, { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

const MethodButtonWrapper = styled.div`
  background: #f6f8fd;
  border: 1px solid #f4f4f4;
  border-radius: 8px;
  text-align: left;
  transition: all 0.2s ease-in-out;

  .button-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 16px;
    width: 100%;
    text-align: left;

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1c182e;
      border-radius: 4px;
      width: 48px;
      height: 48px;

      svg {
        max-width: 25px;
        color: #fff;
      }
    }
    .label {
      flex: 1;
      font-weight: 700;
      font-size: 16px;
      color: #141414;
      margin-bottom: 0;
    }
    .suffix {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }

  &:hover,
  &.active {
    border-color: #91f322;
  }
`;

export interface MethodButtonProps extends HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  suffix?: ReactNode | string;
}

const MethodButton = ({
  icon,
  label,
  suffix,
  children,
  ...rest
}: MethodButtonProps) => (
  <MethodButtonWrapper>
    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
    <button className="button-section" {...rest}>
      <span className="icon">{icon}</span>
      <p className="label">{label}</p>
      <span className="suffix">{suffix}</span>
    </button>
    {children}
  </MethodButtonWrapper>
);

export default MethodButton;
