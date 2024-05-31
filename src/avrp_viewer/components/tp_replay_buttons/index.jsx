import IconStepForward_Idle from '@assets/icons/step-forward_idle.svg';
import IconStepBack_Idle from '@assets/icons/step-back_idle.svg';
import { IconButton } from '@components';
import styles from './styles.module.css';

export function BtnStepBack({ onClick }) {
  return (
    <IconButton
      iconSrc={IconStepBack_Idle}
      onClick={onClick}
      className=''
    />
  );
}

export function BtnStepForward({ onClick }) {
  return (
    <IconButton
      iconSrc={IconStepForward_Idle}
      onClick={onClick}
      className=''
    />
  );
}