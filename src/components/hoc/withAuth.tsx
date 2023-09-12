import { AccountProvider, useAccount } from "@lib/context/account-context";
import React, { useEffect } from "react";
import { FaSpinner } from "react-icons/fa";

interface WithAuthProps {
  children: React.ReactNode;
}

const WithAuthChild: React.FC<WithAuthProps> = ({ children }) => {
  const { customer, retrievingCustomer, checkSession } = useAccount();

  useEffect(() => {
    checkSession();
    // run checkSession on every focus changes
    window.addEventListener('focus', checkSession);
    return () => {
     window.removeEventListener('focus', checkSession);
    }
  }, [customer, retrievingCustomer, checkSession]);

  if (retrievingCustomer || !customer) {
    return (
      <div className="flex items-center justify-center w-full min-h-[640px] h-full text-gray-900">
        <FaSpinner size={36} />
      </div>
    );
  }

  return <>{children}</>;
};

const WithAuth = (WrappedComponent: React.ComponentType) => {
  // eslint-disable-next-line react/display-name
  return (props: any) => (
    <AccountProvider>
      <WithAuthChild>
        <WrappedComponent {...props} />
      </WithAuthChild>
    </AccountProvider>
  );
};
export default WithAuth;

// reference: https://github.com/theodorusclarence/nextjs-with-auth-hoc