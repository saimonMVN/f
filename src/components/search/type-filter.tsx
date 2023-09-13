import { CheckBox } from '@components/ui/form/checkbox';
import { useBrandsQuery } from '@framework/brand/get-all-brands';
import { Disclosure } from '@headlessui/react';
import { useRouter } from 'next/router';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import React from 'react';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import {useCollections, useProductTypes} from "medusa-react";

export const TypeFilter = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, query } = router;
    const {isLoading,error, product_types} = useProductTypes({limit:100})

    const selectedCollections = React.useMemo(
        () => (query?.types ? (query.types as string).split(',') : []),
        [query?.types]
    );
    const [formState, setFormState] = React.useState<string[]>(selectedCollections);

    React.useEffect(() => {
        setFormState(selectedCollections);
    }, [selectedCollections]);

    if (isLoading) return <p>Loading...</p>;

    if (error) return <p>{error.message}</p>;

    function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
        const { value } = e.currentTarget;
        let currentFormState = formState.includes(value)
            ? formState.filter((i) => i !== value)
            : [...formState, value];
        setFormState(currentFormState);
        const { tags, ...restQuery } = query;
        router.push(
            {
                pathname,
                query: {
                    ...restQuery,
                    ...(!!currentFormState.length
                        ? { types: currentFormState.join(',') }
                        : {}),
                },
            },
            undefined,
            { scroll: false }
        );
    }
    const items = product_types;

  return (
    <div className="block">
      <Heading className="lg:text-xl mb-5 -mt-1 block-title">Product Type</Heading>
      <div className="flex flex-col ">
        {items?.slice(0, 3)?.map((item: any) => (
          <CheckBox
              key={`${item.value}-key-${item.id}`}
              label={item.value}
              name={item.value.toLowerCase()}
              checked={formState.includes(item.id)}
              value={item.id}
              onChange={handleItemClick}
          />
        ))}
        {items!.length > 3 && (
          <div className="w-full">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Panel className="pt-4 pb-2">
                    {items?.slice(3, items.length).map((item) => (
                      <CheckBox
                          key={`${item.value}-key-${item.id}`}
                          label={item.value}
                          name={item.value.toLowerCase()}
                          checked={formState.includes(item.id)}
                          value={item.id}
                          onChange={handleItemClick}
                      />
                    ))}
                  </Disclosure.Panel>
                  <Disclosure.Button className="flex justify-center items-center w-full px-4 pt-3.5 pb-1 text-sm font-medium text-center text-skin-primary focus:outline-none">
                    {open ? (
                      <>
                        <span className="inline-block pe-1">
                          {t('text-see-less')}
                        </span>
                        <IoIosArrowUp className="text-skin-base text-opacity-60 text-15px" />
                      </>
                    ) : (
                      <>
                        <span className="inline-block pe-1">
                          {t('text-see-more')}
                        </span>
                        <IoIosArrowDown className="text-skin-base text-opacity-60 text-15px" />
                      </>
                    )}
                  </Disclosure.Button>
                </>
              )}
            </Disclosure>
          </div>
        )}
      </div>
    </div>
  );
};
