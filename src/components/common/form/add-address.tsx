import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useModalAction, useModalState } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { useTranslation } from 'next-i18next';
import { medusaClient } from '@lib/config';
import { useAccount } from '@lib/context/account-context';
import { useState } from 'react';
import CountrySelect from '@components/checkout/country-select';
import { FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';

type ContactFormValues = {
  first_name: string
  last_name: string
  city: string
  country_code: string
  postal_code: string
  province?: string
  address_1: string
  address_2?: string
  phone?: string
  company?: string
}

const AddAddressForm: React.FC = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();  
  const { data } = useModalState();
  const { closeModal } = useModalAction();

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const [countryCodeError, setCountryCodeError] = useState<string | undefined>(undefined)

  const { refetchCustomer } = useAccount()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>(
    {
      defaultValues: {
        address_1: data || data?.address_1 ? data?.address_1 : '',
        address_2: data || data?.address_2 ? data?.address_2 : '',
        city: data || data?.city ? data?.city : '',
        company: data || data?.company ? data?.company : '',
        country_code: data || data?.country_code ? data?.country_code : '',
        first_name: data || data?.first_name ? data?.first_name : '',
        last_name: data || data?.last_name ? data?.last_name : '',
        phone: data || data?.phone ? data?.phone : '',
        postal_code: data || data?.postal_code ? data?.postal_code : '',
        province: data || data?.province ? data?.province : '',
      },
    });
  

  const handleClose = () => {
    reset({
      first_name: "",
      last_name: "",
      city: "",
      country_code: "",
      postal_code: "",
      address_1: "",
      address_2: "",
      company: "",
      phone: "",
      province: "",
    })
  }

  const submit = handleSubmit(async (formData: ContactFormValues) => {
    if(formData.country_code===""){
      setCountryCodeError("Country required")
      return
    }
    setSubmitting(true)
    setError(undefined)
    
    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      company: formData.company || "Personal",
      address_1: formData.address_1,
      address_2: formData.address_2 || "",
      city: formData.city,
      country_code: formData.country_code,
      province: formData.province || "",
      postal_code: formData.postal_code,
      phone: formData.phone || "None",
      metadata: {},
    }

    if(!data.id){
      // Add address
    medusaClient.customers.addresses
      .addAddress({ address: payload })
      .then(() => {
        setSubmitting(false)
        refetchCustomer()
        handleClose()
        closeModal()
        toast(t("common:text-user-address-add-success"), {
          progressClassName: 'fancy-progress-bar',
          position: width! > 768 ? 'top-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(() => {
        setSubmitting(false)
        setError(t("common:text-user-address-add-failed"))
        toast(t("common:text-user-address-add-failed"), {
          progressClassName: 'fancy-progress-bar',
          position: width! > 768 ? 'top-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
    } else {
      // Update address
      medusaClient.customers.addresses
      .updateAddress(data.id, payload)
      .then(() => {
        setSubmitting(false)
        refetchCustomer()
        handleClose()
        closeModal()
        toast(t("common:text-user-address-update-success"), {
          progressClassName: 'fancy-progress-bar',
          position: width! > 768 ? 'top-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
      .catch(() => {
        setSubmitting(false)
        setError(t("common:text-user-address-update-failed"))
        toast(t("common:text-user-address-add-failed"), {
          progressClassName: 'fancy-progress-bar',
          position: width! > 768 ? 'top-right' : 'top-right',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      })
  }})

  const removeAddress = () => {
    medusaClient.customers.addresses.deleteAddress(data.id).then(() => {
      refetchCustomer()
      handleClose()
      closeModal()
      toast(t("common:text-user-address-delete-success"), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'top-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }).catch(() => {
      setSubmitting(false)
      setError(t("common:text-user-address-delete-failed"))
      toast(t("common:text-user-address-add-failed"), {
        progressClassName: 'fancy-progress-bar',
        position: width! > 768 ? 'top-right' : 'top-right',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    })
  }



  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <div className="grid grid-cols-1 gap-y-2">
            <div className="grid grid-cols-2 gap-x-2">
              <Input
                label="First name"
                {...register("first_name", {
                  required: "First name is required",
                })}
                required
                error={errors.first_name?.message}
                autoComplete="given-name"
              />
              <Input
                label="Last name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                required
                error={errors.last_name?.message}
                autoComplete="family-name"
              />
            </div>
            <Input label="Company" {...register("company")}
            error={errors.company?.message} 
            />
            <Input
              label="Address"
              {...register("address_1", {
                required: "Address is required",
              })}
              required
              error={errors.address_1?.message}
              autoComplete="address-line1"
            />
            <Input
              label="Apartment, suite, etc."
              {...register("address_2")}
              error={errors.address_2?.message}
              autoComplete="address-line2"
            />
            <div className="grid grid-cols-[144px_1fr] gap-x-2">
              <Input
                label="Postal code"
                {...register("postal_code", {
                  required: "Postal code is required",
                })}
                required
                error={errors.postal_code?.message}
                autoComplete="postal-code"
              />
              <Input
                label="City"
                {...register("city", {
                  required: "City is required",
                })}
                error={errors.city?.message}
                required
                autoComplete="locality"
              />
            </div>
            <Input
              label="Province / State"
              {...register("province")}
              error={errors.province?.message}
              autoComplete="address-level1"
            />
            <CountrySelect
              {...register("country_code", { required: true })}
              autoComplete="country"
              errors={errors}
            />
            <Input
              label="Phone"
              {...register("phone")}
              error={errors.phone?.message}
              autoComplete="phone"
            />
          </div>
          {error && (
            <div className="text-rose-500 text-small-regular py-2">{error}</div>
          )}

        <div className="flex w-full justify-end gap-4">
        {data.id && <Button className="h-11 md:h-12 mt-1.5" type="submit"  onClick={removeAddress}>
            {t('common:text-delete-address')}
            {submitting && <FaSpinner />}
          </Button>
          }
          <Button className="h-11 md:h-12 mt-1.5" type="submit"  onClick={submit}>
            {t('common:text-save-address')}
            {submitting && <FaSpinner />}
          </Button>
        </div>
    </div>
  );
};

export default AddAddressForm;
