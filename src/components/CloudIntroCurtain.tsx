import React from 'react';
import { CloudCurtain, CloudCurtainProps } from './CloudCurtain';

export interface CloudIntroCurtainProps {
  /** Whether the curtain is currently active/visible */
  isOpen: boolean;
  /** Callback fired once clouds have fully parted and screen is revealed */
  onRevealed?: () => void;
  /** Allow manual dismissal or re-trigger */
  onClose?: () => void;
  /** Whether to auto-part after a short delay (default: false - require scrolling to open) */
  autoPart?: boolean;
}

/**
 * CloudIntroCurtain proxy component ensuring backward compatibility
 * while powering the full 3D Depth & Mouse Scroll Wheel Cloud Curtain experience.
 */
export const CloudIntroCurtain: React.FC<CloudIntroCurtainProps> = ({
  isOpen,
  onRevealed,
  onClose,
  autoPart = false,
}) => {
  return (
    <CloudCurtain
      isOpen={isOpen}
      onRevealed={onRevealed}
      onClose={onClose}
      autoPart={autoPart}
      autoFlyTimeout={autoPart ? 2.6 : 999999}
    />
  );
};

export { CloudCurtain };
export default CloudIntroCurtain;
