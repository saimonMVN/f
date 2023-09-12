import { onlyUnique } from '@lib/util/only-unique';
import { ProductOption } from '@medusajs/medusa';
import clsx from 'classnames';
import Image from 'next/image';
import React from 'react';

type OptionSelectProps = {
  option: ProductOption;
  current: string;
  updateOption: (option: Record<string, string>) => void;
  title: string;
  handleSetSelectedVarientImage: (image: string) => void;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  handleSetSelectedVarientImage,
  title,
}) => {
  const filteredOptions = option.values.map((v) => v.value).filter(onlyUnique);

  const getPropsValueFormMetaData = (value: string): string | null => {
    // this code works for imported product that imported from moveOn inventory

    const metaData = option.metadata as {
      values: Array<{ name: string; thumb?: string; color?: string }>;
    };

    if (
      metaData &&
      Object.keys(metaData.values).length > 0 &&
      Array.isArray(metaData.values) &&
      metaData.values.length > 0
    ) {
      const metaDataValue = metaData.values.find((item) => item.name === value);
      if (metaDataValue) {
        return metaDataValue.thumb || metaDataValue.color || null;
      }
    }

    return null;
  };

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-base-semi">{title}</span>
      <div className="flex flex-wrap gap-2">
        {filteredOptions.map((v) => {
          const propsValue = getPropsValueFormMetaData(v);
          const isImage = propsValue && propsValue.startsWith('http'); // Check if propsValue is an image URL
          const isColor = propsValue && !isImage; // Check if propsValue is a color code

          return (
            <button
              onClick={() => {
                updateOption({ [option.id]: v });
                if (propsValue && isImage) {
                  handleSetSelectedVarientImage(propsValue);
                }
              }}
              key={v}
              className={clsx(
                'border-gray-200 border-[2px] text-xsmall-regular h-auto min-h-[40px] min-w-[40px] transition-all duration-200 flex items-center justify-center',
                {
                  '!border-skin-primary  box-content	': v === current,
                }
              )}
            >
              <div
                className={clsx('rounded-md flex justify-center', {
                  'bg-gray-300': isColor,
                  'p-2': !propsValue,
                })}
                style={{
                  minWidth: '40px',
                  height: '40px',
                  flex: '0 0 auto',
                }}
              >
                {isImage && (
                  <Image
                    src={propsValue}
                    alt={v}
                    width={40}
                    height={40}
                    className=""
                  />
                )}
                {isColor && (
                  <div
                    className="h-8 w-8 "
                    style={{
                      backgroundColor: propsValue,
                      borderRadius: '5px',
                    }}
                  ></div>
                )}
                {!isImage && !isColor && v}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelect;
