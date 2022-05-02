import cn from 'classnames';
import React from 'react';
import styled from 'styled-components';

const CardWrapper = styled.div`
  background-color: #fff;
  border-radius: 10px;
`;

export const Card = ({
  children,
  className,
}: {
  children?: any;
  className?: string;
}) => (
  <CardWrapper className={cn('card-wrapper', className)}>
    {children}
  </CardWrapper>
);
