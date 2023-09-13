import {useEffect} from 'react'
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm, useWatch } from "react-hook-form"
import { useTranslation } from 'next-i18next';
import { useAccount } from '@lib/context/account-context';
import { Customer } from '@medusajs/medusa';
import { useUpdateMe } from 'medusa-react';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { medusaClient } from '@lib/config';


type MyInformationProps = {
  customer: Omit<Customer, "password_hash">
}

type UpdateCustomerPersonalDetailsFormData = {
  first_name: string
  last_name: string
  phone: string
}

type UpdateCustomerAccountChangeFormData = {
  old_password: string,
  new_password: string,
  confirm_password: string
}


const AccountDetails: React.FC<MyInformationProps> = ({ customer }) => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { refetchCustomer } = useAccount()

  // personal details update
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<UpdateCustomerPersonalDetailsFormData>({
    defaultValues: {
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
    },
  })

  useEffect(() => {
    reset({
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone: customer.phone,
    })
  }, [customer, reset])

  const {
    mutate: update,
    isLoading
  } = useUpdateMe()

  const firstName = useWatch({
    control,
    name: "first_name",
  })
  const lastName = useWatch({
    control,
    name: "last_name",
  })
  const phoneNumber = useWatch({
    control,
    name: "phone",
  })

  const onSubmitPersonalDetails = (data: UpdateCustomerPersonalDetailsFormData) => {
    return update(
      {
        id: customer.id,
        ...data,
      },
      {
        onSuccess: () => {
          refetchCustomer();
          toast(t("common:text-user-update-success"), {
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
        toast(t("common:text-user-update-success"), {
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
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      <form
        onSubmit={handleSubmit(onSubmitPersonalDetails)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                defaultValue={firstName}
                label={t('forms:label-first-name')}
                {...register('first_name', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.first_name?.message}
              />

              <Input
                defaultValue={lastName}
                label={t('forms:label-last-name')}
                {...register('last_name', {
                  required: 'forms:last-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.last_name?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="tel"
                defaultValue={phoneNumber}
                label={t('forms:label-phone')}
                {...register('phone', {
                  required: 'forms:phone-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.phone?.message}
              />
            </div>
          </div>
        </div>
        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>


      <form onSubmit={handleSubmitAccountChange(onSubmitAccountChange)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate>
        <Heading
          variant="titleLarge"
          className="mb-5 xl:mb-8 pt-6 md:pt-7 lg:pt-8"
        >
          {t('common:text-account-details-account')}
        </Heading>
        <div className="border-skin-base border-b pb-7 md:pb-9 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="email"
                name='email'
                defaultValue={customer.email}
                readOnly
                label={t('forms:label-email-star')}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
            <PasswordInput
                type="tel"
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
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errorsAccountChange.confirm_password?.message}
              />
            </div>
          </div>
        </div>
        {/* <div className="relative flex pt-6 md:pt-8 lg:pt-10">
          <div className="pe-2.5">
            <Heading className="font-medium mb-1">
              {t('common:text-share-profile-data')}
            </Heading>
            <Text variant="small">
              {t('common:text-share-profile-data-description')}
            </Text>
          </div>
          <div className="ms-auto">
            <Controller
              name="shareProfileData"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div> */}
        {/* <div className="relative flex mt-5 md:mt-6 lg:mt-7 mb-1 sm:mb-4 lg:mb-6">
          <div className="pe-2.5">
            <Heading className="font-medium mb-1">
              {t('common:text-ads-performance')}
            </Heading>
            <Text variant="small">
              {t('common:text-ads-performance-description')}
            </Text>
          </div>
          <div className="ms-auto">
            <Controller
              name="setAdsPerformance"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div> */}
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
  );
};

export default AccountDetails;
