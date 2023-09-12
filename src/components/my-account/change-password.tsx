import {useEffect} from "react"
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { Customer } from '@medusajs/medusa';
import { useAccount } from '@lib/context/account-context';
import useWindowSize from '@utils/use-window-size';
import { medusaClient } from '@lib/config';
import { useUpdateMe } from "medusa-react";
import { toast } from "react-toastify";

type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerAccountChangeFormData = {
  old_password: string,
  new_password: string,
  confirm_password: string
}

const ChangePassword: React.FC<MyInformationProps> = ({ customer }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { refetchCustomer } = useAccount()

    // account details update
    const {
      register: registerAccountChange,
      handleSubmit: handleSubmitAccountChange,
      reset: resetAccountChange,
      formState: { errors: errorsAccountChange },
      setError: setAccountChangeError
    } = useForm<UpdateCustomerAccountChangeFormData>();
  
    useEffect(() => {
      resetAccountChange()
    }, [customer, resetAccountChange])
  
    const {
      mutate: updateAccountChange,
      isLoading: isLoadingAccountChange,
      } = useUpdateMe()

  const onSubmitAccountChange = async(data: UpdateCustomerAccountChangeFormData) => {
    if(data.old_password){
    const isValid = await medusaClient.auth
    .authenticate({
      email: customer.email,
      password: data.old_password,
    })
    .then(() => true)
    .catch(() => false)

   if (!isValid) {
    setAccountChangeError("old_password", {
      type: "validate",
      message: "Old password is incorrect",
    })
    return
   }

   if (data.new_password !== data.confirm_password) {
    setAccountChangeError("confirm_password", {
      type: "validate",
      message: "Passwords do not match",
    })
    return
   }

   return updateAccountChange({
    id: customer.id,
    password: data.new_password,
  },
    {
      onSuccess: () => {
        refetchCustomer();
        toast(t("common:text-user-password-update-success"), {
          progressClassName: 'fancy-progress-bar',
          position: width! > 768 ? 'top-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      },
    }
  )
 }
}

  return (
    <>
      <Heading variant="titleLarge">
        {t('common:text-account-details-password')}
      </Heading>
      <div className="w-full flex  h-full lg:w-10/12 2xl:w-9/12 flex-col mt-6 lg:mt-7">
      <form onSubmit={handleSubmitAccountChange(onSubmitAccountChange)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate>
        <div className="border-skin-base border-b pb-7 md:pb-9 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
            <PasswordInput
                label={t('forms:label-old-password')}
                {...registerAccountChange('old_password', {
                  required: 'forms:password-old-required',
                })}
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errorsAccountChange.old_password?.message}
              />
              <PasswordInput
                label={t('forms:label-new-password')}
                {...registerAccountChange('new_password', {
                  required: 'forms:password-new-required',
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                    message: t('forms:password-validation-error'),
                  },
                })}
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errorsAccountChange.new_password?.message}
              />
              <PasswordInput
                label={t('forms:label-confirm-password')}
                {...registerAccountChange('confirm_password', {
                  required: 'forms:password-confirm-required',
                })}
                error={errorsAccountChange.confirm_password?.message}
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              />
            </div>
          </div>
        </div>
        
        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoadingAccountChange}
            disabled={isLoadingAccountChange}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
      </div>
    </>
  );
};

export default ChangePassword;
