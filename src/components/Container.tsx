import cn from 'classnames';
import React, { HTMLAttributes } from 'react';

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  isFluid?: boolean;
  relative?: boolean;
}

const Container: React.FC<ContainerProps> = ({
  children,
  isFluid,
  relative,
  className,
  ...rest
}) => (
  <div
    className={cn('container', className, { 'is-fluid': isFluid, relative })}
    {...rest}
  >
    {children}
  </div>
);

export default Container;
