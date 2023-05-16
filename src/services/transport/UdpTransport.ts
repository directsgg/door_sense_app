import dgram from 'react-native-udp';
import UdpSocket from 'react-native-udp/lib/types/UdpSocket';
//const MAX_UDP_SIZE = 1436;

export class UdpTransport {
  private udpSocket: UdpSocket;
  private isSend: boolean;
  private port: number;
  //last_packet: number;
  constructor(puerto = 12345) {
    this.udpSocket = dgram.createSocket({type: 'udp4'});
    this.isSend = false;
    this.udpSocket.bind(puerto);
    this.port = puerto;
    //this.udpSocket.setBroadcast(true);
    /*this.udpSocket.once('listening', () => {
      this.udpSocket.send(
        'Hello world, listening...',
        undefined,
        undefined,
        12345,
        '255.255.255.255',
        e => {
          if (e) {
            throw e;
          }
          console.log('message sent!, listening');
        },
      );
    });*/
    //output_buffer
  }

  flagIsSend(state: boolean) {
    this.isSend = state;
  }

  send(m_buffer: Buffer) {
    this.udpSocket.send(
      m_buffer,
      undefined,
      undefined,
      this.port,
      '255.255.255.255',
    );
  }
  onReceiveMessage(callbackReceiveM: (arg0: any, arg1: any) => void) {
    this.udpSocket.on('message', (msg, rinfo) => {
      if (!this.isSend) {
        callbackReceiveM(msg, rinfo);
      }
    });
  }
}

/*const socket = dgram.createSocket({type: 'udp4'});
socket.bind(12345);
socket.once('listening', () => {
  socket.send('Hello world', undefined, undefined, 12345, undefined, e => {
    if (e) {
      throw e;
    }
    console.log('message sent!');
  });
});

socket.on('message', (msg, rinfo) => {
  console.log('message received', msg);
});*/
