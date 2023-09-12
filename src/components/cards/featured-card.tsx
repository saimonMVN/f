import Heading from '@components/ui/heading';
import Link from '@components/ui/link';
import cn from 'classnames';
import { LinkProps } from 'next/link';
import { useTranslation } from 'next-i18next';
import { IoCaretForward } from 'react-icons/io5';
import Text from "@components/ui/text";
import {useRouter} from "next/router";
import {getDirection} from "@utils/get-direction";

interface ItemProps {
  icon: JSX.Element;
  title: string;
  href: LinkProps['href'];
  description: string;
}

interface Props {
  className?: string;
  layout?: string;
  item: ItemProps;
}


const FeaturedCard: React.FC<Props> = ({ item, className,layout }) => {
  const { t } = useTranslation('common');
  const { icon, title, href, description } = item;

  const {locale} = useRouter();
  const dir = getDirection(locale);
  const borderRTL = (dir=='rtl') ? 'border-l':'border-r';

  return (
    <Link href={href} className="w-full ">
      <div
        className={cn('group px-5 xl:px-5 2xl:px-8  flex items-center justify-center  border-black/10',borderRTL, className)}
      >
        <div className="flex flex-shrink-0 items-center justify-center">
          {icon}
        </div>

        {layout == "home4" ? (
            <div className="ps-4">
              <Heading variant="base" className="sm:text-sm hover:text-skin-primary">
                {t(title)}
              </Heading>
              <Text  className={"text-13px lg:leading-[22px]"}>{t(description)}</Text>
            </div>
        ): (
            <div className="ps-4">
              <Heading variant="base" className="hover:text-skin-primary">
                {t(title)}
              </Heading>
              <Text>{t(description)}</Text>
            </div>
        )}

      </div>
    </Link>
  );
};

export default FeaturedCard;
