import { useState } from 'react';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import { FieldValues, useForm } from 'react-hook-form';
import Link from '@components/ui/link';
import { useTranslation } from 'next-i18next';
import Image from '@components/ui/image';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import cn from 'classnames';
import { ROUTES } from '@utils/routes';
import { useAccount } from '@lib/context/account-context';
import { medusaClient } from '@lib/config';

interface SignUpFormProps {
  isPopup?: boolean;
  className?: string;
}
interface RegisterCredentials extends FieldValues {
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
}


const SignUpForm: React.FC<SignUpFormProps> = ({
  isPopup = true,
  className,
}) => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
  
    const { refetchCustomer } = useAccount()
    const [authError, setAuthError] = useState<string | undefined>(undefined)
  
    const handleError = (e: Error) => {
      if(e.message.includes("422")) {
        setAuthError(t("common:text-register-user-already-exist-error"))
      } else {
        setAuthError(t("common:text-server-error"))
      }
    }
  
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<RegisterCredentials>()
  
    const onSubmit = handleSubmit(async (credentials) => {
      await medusaClient.customers
        .create(credentials)
        .then(() => {
          refetchCustomer()
          closeModal()
        })
        .catch(handleError)
    })
  
  function handleSignIn() {
    return openModal('LOGIN_VIEW');
  }

  function handleForgetPassword() {
    return openModal('FORGET_PASSWORD');
  }

  return (
    <div
      className={cn(
        'flex bg-skin-fill mx-auto rounded-lg w-full lg:w-[1000px] 2xl:w-[1200px]',
        className
      )}
    >
      {isPopup === true && <CloseButton onClick={closeModal} />}
      <div className="flex bg-skin-fill mx-auto rounded-lg overflow-hidden w-full">
        <div className="md:w-[55%] xl:w-[60%] registration hidden md:block">
          <Image
            src="/assets/images/login.jpg"
            alt="sign up"
            width={800}
            height={620}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-[45%] xl:w-[40%] py-6 sm:py-10 px-4 sm:px-8 lg:px-12  rounded-md shadow-dropDown flex flex-col justify-center">
          <div className="text-center mb-6 pt-2.5">

            <h4 className="text-skin-base font-medium text-xl sm:text-2xl  sm:pt-3 ">
              {t('common:text-sign-up-for-free')}
            </h4>
            <div className="text-sm sm:text-base text-body text-center mt-3 mb-1">
              {t('common:text-already-registered')}
              <button
                type="button"
                className="ms-1 text-sm sm:text-base text-skin-primary  hover:no-underline focus:outline-none"
                onClick={handleSignIn}
              >
                {t('common:text-sign-in-now')}
              </button>
            </div>
          </div>
          <form
            onSubmit={onSubmit}
            className="flex flex-col justify-center"
            noValidate
          >
            <div className="flex flex-col space-y-4">
            <Input
                label={t('forms:label-first-name-star')}
                type="text"
                autoComplete="given-name"
                variant="solid"
                {...register('first_name', {
                  required: `${t('forms:first-name-required')}`,
                })}
                error={errors.first_name?.message}
              />
              <Input
                label={t('forms:label-last-name-star')}
                type="text"
                autoComplete="family-name"
                variant="solid"
                {...register('last_name', {
                  required: `${t('forms:last-name-required')}`,
                })}
                error={errors.last_name?.message}
              />
              <Input
                label={t('forms:label-email-star')}
                type="email"
                autoComplete="email"
                variant="solid"
                {...register('email', {
                  required: `${t('forms:email-required')}`,
                  pattern: {
                    value:
                      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: t('forms:email-error'),
                  },
                })}
                error={errors.email?.message}
              />
              <PasswordInput
                label={t('forms:label-password-star')}
                error={errors.password?.message}
                {...register('password', {
                  required: `${t('forms:password-required')}`,
                  pattern: {
                    value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                    message: t('forms:password-validation-error'),
                  },
                })}
              />

              <Input
                label={t('forms:label-phone')}
                type="text"
                autoComplete="tel"    
                variant="solid"
                {...register('phone')}
                error={errors.phone?.message}
              />
              <div className="flex items-center justify-center">
                <div className="flex ms-auto mt-[2px]" onClick={closeModal}>
                  <Link
                    href={ROUTES.PRIVACY}
                    className="text-end text-sm text-heading ps-3 hover:no-underline hover:text-skin-base focus:outline-none focus:text-skin-base"
                  >
                    {t('common:text-privacy-and-policy')}
                  </Link>
                </div>
              </div>

              {authError && (
          <div>
            <span className="text-rose-500 w-full text-small-regular">
              {authError}
            </span>
          </div>
        )}

              <div className="relative">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                  className="h-11 md:h-12 w-full mt-2 font-15px md:font-15px tracking-normal"
                  variant="formButton"
                >
                  {t('common:text-register')}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
