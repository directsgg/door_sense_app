import PcmAudio, {
  PCMAPlayerOptions,
  PCMAudioProps,
} from 'react-native-pcm-audio';

const optionsAudioPlayer: PCMAPlayerOptions = {
  sampleRate: 16000,
  channelConfig: 1,
  bitsPerSample: 16,
  bufferSize: 1436,
};

export class AudioOutput {
  private audioOutput: PCMAudioProps;
  constructor() {
    this.audioOutput = PcmAudio;
    this.audioOutput.initializePCMPlayer(optionsAudioPlayer);
  }

  play(pcmData: any) {
    this.audioOutput.startPlayer(pcmData);
  }

  release() {
    return this.audioOutput.stopPlayer();
  }
}
