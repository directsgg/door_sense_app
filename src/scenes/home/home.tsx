import React, {useState, useEffect, useCallback, useRef} from 'react';
import {StyleSheet, ActivityIndicator, ToastAndroid} from 'react-native';
import {Colors, View, Button, ConnectionStatusBar} from 'react-native-ui-lib';
import {WebView} from 'react-native-webview';
import {UdpTransport} from '../../services/transport/UdpTransport';
import {AudioSampler} from '../../services/audio_input/AudioSampler';
import {AudioOutput} from '../../services/audio_output/AudioOutput';
//import {onDisplayNotificationTocToc} from '../../services/notification/notification';
import {Buffer} from 'buffer';
import {
  MicIcon,
  MicOffIcon,
  VolumeUpIcon,
  VolumeOffIcon,
  VideoCamIcon,
  VideoCamOffIcon,
} from '../../components/icons';
import {NetworkInfo} from 'react-native-network-info';
//import ViewGradient from '../../components/viewgradient.component';
const audioInputSampler = new AudioSampler();
const audioOutput = new AudioOutput();
const udpTransport = new UdpTransport();
const udpSearchIp = new UdpTransport(12344);

const HomeScreen = () => {
  //const udpTransport = useMemo(() => new UdpTransport(), []);
  const refWebView = useRef(null);
  const [uriWebView, setUriWebView] = useState<string>('');
  const [streamState, setStreamState] = useState<string>('');
  const [ipAddressLocal, setIpAddressLocal] = useState<string>('');
  const [recordingTelefono, setRecordingTelefono] = useState<boolean>(false);
  const [recordingAudioEsp32, setRecordingAudioEsp32] =
    useState<boolean>(false);
  const [recordingVideoEsp32, setRecordingVideoEsp32] =
    useState<boolean>(false);

  const showToastShort = (message: string) => {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  };

  const searchIpEsp32 = () => {
    if (uriWebView === '' && ipAddressLocal !== '') {
      udpSearchIp.send(Buffer.from('ip', 'ascii'));
    }
  };

  // validar la ip que se pasa
  const validarIp = (ip: string) => {
    var patronIp = new RegExp(
      '^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$',
    );
    var valores;

    // early return si la ip no tiene el formato correcto.
    if (ip.search(patronIp) !== 0) {
      return false;
    }

    valores = ip.split('.');

    return (
      valores[0] <= 255 &&
      valores[1] <= 255 &&
      valores[2] <= 255 &&
      valores[3] <= 255
    );
  };
  const callbackreceiveMsgSearch = (msg: any, rinfo: any) => {
    //console.log('rinfo: ', rinfo);
    //console.log('mensaje: ', Buffer.from(msg).toString());
    if (rinfo.address) {
      if (validarIp(Buffer.from(msg).toString())) {
        setUriWebView(rinfo.address);
        //console.log('mensaje: ip valida');
        //console.log('ip address: ', rinfo.address);
      } else {
        setTimeout(() => {
          if (uriWebView === '') {
            showToastShort('Error al recibir direccion ip');
            //console.log('Error al recibir direccion ip');
            //setUriWebView('');
          }
        }, 4000);
      }
    }
    /*setTimeout(() => {
      console.log('uriwebview: ', uriWebView);
    }, 4000);*/
  };

  const callbackreceiveAudio = (msg: any) => {
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
    udpSearchIp.onReceiveMessage(callbackreceiveMsgSearch);
    udpTransport.onReceiveMessage(callbackreceiveAudio);
    audioInputSampler.read(sendAudioData);
    setTimeout(() => {
      searchIpEsp32();
    }, 2000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestOptions = (body: string) => {
    return {
      method: 'PUT',
      body: body,
    };
  };
  const startRecordingTelefono = () => {
    //console.log('start uri web view: ', uriWebView);
    if (uriWebView) {
      fetch(`http://${uriWebView}:80/ctrl`, requestOptions('b'))
        .then(() => {
          udpTransport.flagIsSend(true);
          setRecordingTelefono(true);
          audioInputSampler.start();
          onChangeAudioRecordingEsp32(false);
        })
        .catch(() => {
          showToastShort('Error al establecer conexion');
          setUriWebView('');
          searchIpEsp32();
        });
    } else {
      searchIpEsp32();
      setTimeout(() => {
        if (uriWebView) {
          fetch(`http://${uriWebView}:80/ctrl`, requestOptions('b'))
            .then(() => {
              udpTransport.flagIsSend(true);
              setRecordingTelefono(true);
              audioInputSampler.start();
              onChangeAudioRecordingEsp32(false);
            })
            .catch(() => {
              showToastShort('Error al establecer conexion');
              setUriWebView('');
              searchIpEsp32();
            });
        } else {
          showToastShort('No se detecto ningun dispositivo');
        }
      }, 2000);
    }
  };
  const endRecordingTelefono = () => {
    setRecordingTelefono(false);
    audioInputSampler.stop();
    onChangeAudioRecordingEsp32(true, true);
    setTimeout(() => {
      udpTransport.flagIsSend(false);
    }, 500);
  };

  const onChangeAudioRecordingEsp32 = (
    iconNewState?: boolean,
    esp32NewState?: boolean,
  ) => {
    let _iconNewState = !recordingAudioEsp32;
    if (iconNewState !== undefined) {
      _iconNewState = iconNewState;
    } else {
      esp32NewState = _iconNewState;
    }
    if (esp32NewState !== undefined) {
      if (uriWebView) {
        fetch(
          `http://${uriWebView}:80/ctrl`,
          requestOptions(esp32NewState ? 'm' : 'x'),
        )
          .then(() => {
            setRecordingAudioEsp32(_iconNewState);
          })
          .catch(() => {
            //console.error(e);
            showToastShort('Error al establecer conexion');
            setUriWebView('');
            searchIpEsp32();
          });
      } else {
        searchIpEsp32();
      }
    } else {
      setRecordingAudioEsp32(_iconNewState);
    }
  };

  const onChangeVideoRecordingEsp32 = () => {
    if (uriWebView) {
      const _recordinVideoEsp32 = !recordingVideoEsp32;

      //iniciar video
      if (_recordinVideoEsp32) {
        fetch(`http://${uriWebView}:80/ctrl`, requestOptions('c'))
          .then(() => {
            setTimeout(() => {
              if (streamState) {
                refWebView.current.reload();
              } else {
                setStreamState('stream');
              }

              setRecordingVideoEsp32(!recordingVideoEsp32);
            }, 2000);
          })
          .catch(() => {
            //console.error(e);
            showToastShort('Error al establecer conexion');
            setUriWebView('');
            searchIpEsp32();
          });
      } else {
        // detener video
        refWebView.current.stopLoading();
        setRecordingVideoEsp32(_recordinVideoEsp32);
      }
    } else {
      showToastShort('No hay conexion, reintentado...');
      setUriWebView('');
      searchIpEsp32();
      setTimeout(() => {
        if (uriWebView) {
          const _recordinVideoEsp32 = !recordingVideoEsp32;

          //iniciar video
          if (_recordinVideoEsp32) {
            fetch(`http://${uriWebView}:80/ctrl`, requestOptions('c'))
              .then(() => {
                setTimeout(() => {
                  if (streamState) {
                    refWebView.current.reload();
                  } else {
                    setStreamState('stream');
                  }

                  setRecordingVideoEsp32(!recordingVideoEsp32);
                }, 2000);
              })
              .catch(() => {
                //console.error(e);
                showToastShort('Error al establecer conexion');
                setUriWebView('');
                searchIpEsp32();
              });
          } else {
            // detener video
            refWebView.current.stopLoading();
            setRecordingVideoEsp32(_recordinVideoEsp32);
          }
        }
      }, 2000);
    }
  };

  const connectionChange = (isConnected: boolean) => {
    //console.log('isConnected: ', isConnected);
    if (isConnected) {
      NetworkInfo.getIPV4Address().then(ipv4Address => {
        if (ipv4Address !== null) {
          setIpAddressLocal(ipv4Address);
          setTimeout(() => {
            searchIpEsp32();
          }, 2000);
        }
      });
    } else {
      setIpAddressLocal('');
    }
  };
  const IconVolumeState = useCallback(() => {
    if (recordingAudioEsp32) {
      return <VolumeUpIcon color={Colors.white} size={32} />;
    } else {
      return <VolumeOffIcon color={Colors.white} size={32} />;
    }
  }, [recordingAudioEsp32]);

  const IconVideoCameraState = useCallback(() => {
    if (recordingVideoEsp32) {
      return <VideoCamIcon color={Colors.white} size={32} />;
    } else {
      return <VideoCamOffIcon color={Colors.white} size={32} />;
    }
  }, [recordingVideoEsp32]);

  const IconTelefonoRecording = useCallback(() => {
    if (recordingTelefono) {
      return <MicIcon color={Colors.white} size={64} />;
    } else {
      return <MicOffIcon color={Colors.white} size={64} />;
    }
  }, [recordingTelefono]);
  const htmlWebView = `<meta name="viewport" content="width=device-width" />
                <body style="background-color: #02132F;">
                  <h2 style="color: #fff;">Door Sense</h2>
                  <div id="stream-container"  style="height: auto" >
                    <img id="stream" style="width:100%; height:auto;" src="http://${uriWebView}:81/${streamState}" crossorigin="">
                  </div>
                </body>`;
  return (
    <View useSafeArea flex backgroundColor={Colors.$backgroundPrimaryHeavy}>
      <View style={styles.containerConnectionStatus}>
        <ConnectionStatusBar
          label="Sin conexión, conéctese a wifi"
          onConnectionChange={connectionChange}
        />
      </View>
      <View
        style={styles.containerWebView}
        flex
        br40
        padding-16
        margin-16
        marginV-20
        backgroundColor="#02132F">
        <WebView
          ref={refWebView}
          style={styles.webView}
          source={{
            html: htmlWebView,
          }}
          startInLoadingState
          renderLoading={() => (
            <View useSafeArea>
              <ActivityIndicator size="large" color="lightskyblue" />
            </View>
          )}
        />
      </View>
      <View absF flex bottom>
        <View row centerH>
          <View>
            <Button
              iconSource={IconVolumeState}
              onPress={() => onChangeAudioRecordingEsp32()}
              round
              backgroundColor={Colors.grey30}
              disabled={recordingTelefono || ipAddressLocal === ''}
            />
          </View>
          <View marginH-16>
            <Button
              iconSource={IconTelefonoRecording}
              onPressIn={startRecordingTelefono}
              onPressOut={endRecordingTelefono}
              size="large"
              round
              disabled={ipAddressLocal === ''}
            />
          </View>
          <View>
            <Button
              iconSource={IconVideoCameraState}
              onPress={onChangeVideoRecordingEsp32}
              size="large"
              round
              backgroundColor={Colors.grey30}
              disabled={recordingTelefono || ipAddressLocal === ''}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerConnectionStatus: {
    zIndex: 1,
  },
  containerWebView: {
    zIndex: 0,
  },
  webView: {
    flex: 1,
  },
});

export default HomeScreen;
