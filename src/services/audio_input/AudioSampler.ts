import AudioRecord, {
  IAudioRecord,
  Options,
} from 'react-native-live-audio-stream';
import {Buffer} from 'buffer';
/*const options: Options = {
  channels: 1,
  bitsPerSample: 8,
  audioSource: 6,
  bufferSize: 4096,
};*/
const optionsAudioRecord: Options = {
  sampleRate: 16000,
  channels: 1,
  bitsPerSample: 16,
  audioSource: 6,
  bufferSize: 1436,
  wavFile: '',
};
export class AudioSampler {
  private audioRecord: IAudioRecord;
  constructor() {
    this.audioRecord = AudioRecord;
    this.audioRecord.init(optionsAudioRecord);
  }

  read(callbackAudioData: (bufferChunck: Buffer) => void) {
    this.audioRecord.on('data', data => {
      // base64-encoded audio data chuncks
      const chunck = Buffer.from(data, 'base64');
      callbackAudioData(chunck);
    });
  }

  start() {
    //this.audioRecord.init(optionsAudioRecord);
    this.audioRecord.start();
  }

  stop() {
    return this.audioRecord.stop(); //.then(val => console.log(val));
  }
}

/*import getUserMedia from 'utilities/getUserMedia';
import binaryToBase64 from 'utilities/binaryToBase64';
const mediarecorder = new MediaRecorder();
interface Props {
  onRecordAudio: (base64: string) => void;
};*/
