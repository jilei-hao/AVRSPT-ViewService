import IconStepForward_Idle from '@assets/icons/step-forward_idle.svg';
import IconStepBack_Idle from '@assets/icons/step-back_idle.svg';
import IconPlay_Idle from '@assets/icons/play_idle.svg';
import IconPause_Idle from '@assets/icons/pause_idle.svg';
import IconExit_Idle from '@assets/icons/exit_idle.svg';
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

export function BtnPlay({ isReplayOn, onClick }) {
  return (
    <IconButton
      iconSrc={ isReplayOn ? IconPause_Idle : IconPlay_Idle}
      onClick={onClick}
      className=''
    />
  );
}

export function BtnExit({ onClick }) {
  return (
    <IconButton
      iconSrc={IconExit_Idle}
      onClick={onClick}
      className=''
    />
  );
}