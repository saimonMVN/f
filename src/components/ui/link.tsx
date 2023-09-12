import Link, { LinkProps as NextLinkProps } from 'next/link';

const MVNLink: React.FC<NextLinkProps & { className?: string }> = ({
  href,
  children,
  ...props
}) => {
  return (
    <Link href={href} {...props}>{children}
    </Link>
  );
};

export default MVNLink;
