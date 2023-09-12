import Link from '@components/ui/link';
import React from 'react';
import cn from "classnames";

interface Props {
  className?: string;
  href: string;
  btnProps: React.ButtonHTMLAttributes<any>;
  isAuthorized: boolean;
}

const AuthMenu: React.FC<Props> = ({
  className,
  isAuthorized,
  href,
  btnProps,
  children,
}) => {
  return isAuthorized ? (
    <Link
      href={href}
      className={cn('text-sm text-white font-normal focus:outline-none ms-2', className)}
    >
      {children}
    </Link>
  ) : (
    <button
        className={cn('text-sm text-white font-normal focus:outline-none ms-2', className)}
      aria-label="Authentication"
      {...btnProps}
    />
  );
};

export default AuthMenu;
