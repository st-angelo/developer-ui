import { SvgIconComponent } from '@material-ui/icons';
import React, { useMemo } from 'react';
import Portal from './ReactPortal';

interface FloatingActionButtonProps {
  icon: SvgIconComponent;
  color?: 'primary' | 'secondary' | 'none';
  size?: 'small' | 'medium' | 'large';
  hPlacement?: 'left' | 'center' | 'right';
  vPlacement?: 'top' | 'center' | 'bottom';
  onClick?: (event?: React.MouseEvent<HTMLElement>) => void;
}

const FloatingActionButton = React.forwardRef<HTMLDivElement, FloatingActionButtonProps>(({
  icon: Icon,
  color = 'primary',
  size = 'medium',
  hPlacement = 'right',
  vPlacement = 'bottom',
  onClick,
}, ref) => {
  const colorClasses = useMemo(
    () => ({
      primary: 'bg-lime-500',
      secondary: 'bg-pink-500',
      none: 'bg-transparent',
    }),
    []
  );

  const sizeClasses = useMemo(
    () => ({
      small: 'w-7 h-7',
      medium: 'w-10 h-10',
      large: 'w-12 h-12',
    }),
    []
  );

  const hPlacementClasses = useMemo(
    () => ({
      left: 'left-8',
      center: 'left-1/2 -translate-x-1/2',
      right: 'right-8',
    }),
    []
  );

  const vPlacementClasses = useMemo(
    () => ({
      top: 'top-8',
      center: 'top-1/2 -translate-y-1/2',
      bottom: 'bottom-8',
    }),
    []
  );

  return (
    <Portal>
      <div
        ref={ref}
        className={`text-white ${colorClasses[color]} fixed flex ${sizeClasses[size]} ${hPlacementClasses[hPlacement]} ${vPlacementClasses[vPlacement]} cursor-pointer items-center justify-center rounded-full`}
        onClick={onClick}
      >
        <Icon fontSize={size} />
      </div>
    </Portal>
  );
});

export default FloatingActionButton;
