import { Tooltip } from '@nextui-org/react';

const CustomTooltip = ({ children, content }) => {
  return (
    <Tooltip 
      content={content}
      delay={0}
      closeDelay={0}
      motionProps={{
        variants: {
          exit: {
            opacity: 0,
            transition: {
              duration: 0.1,
              ease: "easeIn",
            }
          },
          enter: {
            opacity: 1,
            transition: {
              duration: 0.15,
              ease: "easeOut",
            }
          },
        },
      }}
    >
      {children}
    </Tooltip>
  );
};

export default CustomTooltip;
