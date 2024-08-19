import { Image } from '@nextui-org/react';

const Icon = ({ icon, ...rest }: { icon?: string }) => {
  return <Image className="w-[20px] h-[20px]" radius="sm" src={icon} {...rest} />;
};

export default Icon;
