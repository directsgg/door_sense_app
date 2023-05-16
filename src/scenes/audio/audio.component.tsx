import React, {useState, useEffect, useCallback} from 'react';
import {
  Colors,
  Text,
  View,
  Button,
  ConnectionStatusBar,
} from 'react-native-ui-lib';
import {UdpTransport} from '../../services/transport/UdpTransport';
import {AudioSampler} from '../../services/audio_input/AudioSampler';
import {AudioOutput} from '../../services/audio_output/AudioOutput';
//import {onDisplayNotificationTocToc} from '../../services/notification/notification';
import {Buffer} from 'buffer';
import {
  MicIcon,
  MicOffIcon,
  MicExternalOnIcon,
  MicExternalOffIcon,
} from '../../components/icons';
import {NetworkInfo} from 'react-native-network-info';
const audioInputSampler = new AudioSampler();
const audioOutput = new AudioOutput();
const udpTransport = new UdpTransport();
const AudioScreen = () => {
  //const udpTransport = useMemo(() => new UdpTransport(), []);
  const [ipAddressLocal, setIpAddressLocal] = useState<string>('');
  const [recordingTelefono, setRecordingTelefono] = useState<boolean>(false);
  const [recordingEsp32, setRecordingEsp32] = useState<boolean>(false);
  const callbackreceiveAudio = (msg: any, rinfo: any) => {
    //console.log('rinfo', rinfo.address);
    //console.log('ipaddress', ipAddressLocal.toString());
    const pcmData = Buffer.from(msg);
    //if (data.toString('utf8') === 'timbreInteligente') {
    //  onDisplayNotificationTocToc();
    //} else {
    // const pcmData = pcmData.toJSON();
    audioOutput.play(pcmData.toJSON());
    //}
  };
  const sendAudioData = (chunck: Buffer) => {
    udpTransport.send(chunck);
  };
  useEffect(() => {
    udpTransport.onReceiveMessage(callbackreceiveAudio);
    audioInputSampler.read(sendAudioData);
  }, []);

  const startRecordingTelefono = () => {
    udpTransport.flagIsSend(true);
    setRecordingTelefono(true);
    audioInputSampler.start();
  };
  const endRecordingTelefono = () => {
    setRecordingTelefono(false);
    audioInputSampler.stop();
    setTimeout(() => {
      udpTransport.flagIsSend(false);
    }, 500);
  };

  const startRecordingEsp32 = () => {
    setRecordingEsp32(true);
  };
  const endRecordingEsp32 = () => {
    setRecordingEsp32(false);
  };

  const connectionChange = (isConnected: boolean) => {
    //console.log('isConnected: ', isConnected);
    if (isConnected) {
      NetworkInfo.getIPV4Address().then(ipv4Address => {
        if (ipv4Address !== null) {
          setIpAddressLocal(ipv4Address);
        }
      });
    } else {
      setIpAddressLocal('');
    }
  };
  const IconEsp32Recording = useCallback(() => {
    if (recordingEsp32) {
      return <MicExternalOnIcon color={Colors.white} size={64} />;
    } else {
      return <MicExternalOffIcon color={Colors.white} size={64} />;
    }
  }, [recordingEsp32]);

  const IconTelefonoRecording = useCallback(() => {
    if (recordingTelefono) {
      return <MicIcon color={Colors.white} size={64} />;
    } else {
      return <MicOffIcon color={Colors.white} size={64} />;
    }
  }, [recordingTelefono]);
  return (
    <View useSafeArea flex>
      <ConnectionStatusBar
        label="Sin conexión, conéctese a wifi"
        onConnectionChange={connectionChange}
      />
      <View centerH flex spread marginV-40>
        <View centerH>
          <Button
            iconSource={IconEsp32Recording}
            onPressIn={startRecordingEsp32}
            onPressOut={endRecordingEsp32}
            size="large"
            round
            backgroundColor={Colors.orange40}
            disabled={recordingTelefono || ipAddressLocal === ''}
          />
          <Text>Esp32</Text>
        </View>

        <View centerH>
          <Text>Telefono</Text>
          <Button
            iconSource={IconTelefonoRecording}
            onPressIn={startRecordingTelefono}
            onPressOut={endRecordingTelefono}
            size="large"
            round
            disabled={ipAddressLocal === ''}
          />
        </View>
      </View>
    </View>
  );
};
export default AudioScreen;
