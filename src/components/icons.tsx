import React from 'react';
import {ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
type IPropsIcon = {
  size: number;
  color: string;
};
export const LoadingIconAnimated: React.FC<IPropsIcon> = props => (
  <ActivityIndicator {...props} />
);
export const CheckIcon: React.FC<IPropsIcon> = props => (
  <Icon name="check" {...props} />
);
export const ArrowForwardIosIcon: React.FC<IPropsIcon> = props => (
  <Icon name="arrow-forward-ios" {...props} />
);

export const CloseIcon: React.FC<IPropsIcon> = props => (
  <Icon name="close" {...props} />
);

export const ExpandMoreIcon: React.FC<IPropsIcon> = props => (
  <Icon name="expand-more" {...props} />
);

export const MicIcon: React.FC<IPropsIcon> = props => (
  <Icon name="mic" {...props} />
);

export const MicExternalOffIcon: React.FC<IPropsIcon> = props => (
  <Icon name="mic-external-off" {...props} />
);

export const MicExternalOnIcon: React.FC<IPropsIcon> = props => (
  <Icon name="mic-external-on" {...props} />
);

export const MicNoneIcon: React.FC<IPropsIcon> = props => (
  <Icon name="mic-none" {...props} />
);

export const MicOffIcon: React.FC<IPropsIcon> = props => (
  <Icon name="mic-off" {...props} />
);

export const VolumeUpIcon: React.FC<IPropsIcon> = props => (
  <Icon name="volume-up" {...props} />
);

export const VolumeOffIcon: React.FC<IPropsIcon> = props => (
  <Icon name="volume-off" {...props} />
);

export const VideoCamIcon: React.FC<IPropsIcon> = props => (
  <Icon name="videocam" {...props} />
);

export const VideoCamOffIcon: React.FC<IPropsIcon> = props => (
  <Icon name="videocam-off" {...props} />
);
