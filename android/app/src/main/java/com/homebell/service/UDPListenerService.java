package com.homebell.service;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

//import org.apache.http.util.ExceptionUtils;

import android.app.Service;
import android.content.Intent;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;

import android.content.Context;
import android.os.Bundle;
import android.content.Intent;
import android.os.Build;
//import com.facebook.react.HeadlessJsTaskService;


//import android.app.NotificationManager;
//import android.support.v4.app.NotificationCompat;
/*import android.Manifest;
import android.annotation.TargetApi;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.pm.PackageManager;
import javax.annotation.Nullable;
import android.support.v4.app.NotificationCompat;
import android.support.v4.content.ContextCompat;*/
//import com.homebell.service.LocationService;

import com.facebook.react.bridge.ReactApplicationContext;

import io.invertase.notifee.NotifeeApiModule;
public class UDPListenerService extends Service {
    static String UDP_BROADCAST = "UDPBroadcast";

    //Boolean shouldListenForUDPBroadcast = false;
    DatagramSocket socket;

    //NotificationManager notificationManager;
    /*int notifification_id = 1234;
    private static int GEOLOCATION_NOTIFICATION_ID = 123456789;
    private NotificationManager notifManager;*/
    private void listenAndWaitAndThrowIntent(InetAddress broadcastIP, Integer port) throws Exception {
        byte[] recvBuf = new byte[15000];
        if(socket == null || socket.isClosed()) {
            socket = new DatagramSocket(port, broadcastIP);
            socket.setBroadcast(true);
        }
        //socket.setSoTimeout(1000);
        DatagramPacket packet = new DatagramPacket(recvBuf, recvBuf.length);
        Log.e("UDP", "Waiting for UDP broadcast");
        socket.receive(packet);

        String senderIP = packet.getAddress().getHostAddress();
        String message = new String(packet.getData()).trim();

        Log.e("UDP", "Got UDP broadcast from " + senderIP + ", message: " + message);

        //Intent myIntentLoc = new Intent(getApplicationContext(), LocationService.class);
        //getApplicationContext().startService(myIntentLoc);
       // HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());

        broadcastIntent(senderIP, message);
        socket.close();
    }

    private void broadcastIntent(String senderIP, String message) {
        Intent intent = new Intent(UDPListenerService.UDP_BROADCAST);
        intent.putExtra("sender", senderIP);
        intent.putExtra("message", message);
        sendBroadcast(intent);
    }

    Thread UDPBroadcastThread;

    void startListenForUDPBroadcast() {
        UDPBroadcastThread = new Thread(new Runnable() {
            public void run() {
                try {
                    //InetAddress broadcastIP = InetAddress.getByName("172.16.238.255"); //172.16.238.45 //192.168.1.255
                    InetAddress broadcastIP = InetAddress.getByName("255.255.255.255"); //172.16.238.45 //192.168.1.255
                    Integer port = 11111;
                    while (shouldRestartSocketListen) {
                        listenAndWaitAndThrowIntent(broadcastIP, port);
                    }
                    // if (!shouldListenForUDPBroadcast) throw new ThreadDeath();

                } catch (Exception e) {
                    Log.i("UDP", "no longer listening for UDP broadcasts cause of error: " + e.getMessage());
                }
            }
        });
        UDPBroadcastThread.start();
    }

    private Boolean shouldRestartSocketListen = true;

    void stopListen() {
        shouldRestartSocketListen = false;
        socket.close();
    }

    @Override
    public void onCreate() {
        //notificationManager = (NotificationManager)getSystemService(NOTIFICATION_SERVICE);
    }

    @Override
    public void onDestroy() {
        stopListen();
    }

    /*public Notification createNotification(String aMessage, Context context) {
        final int NOTIFY_ID = 0; // ID of notification
        String id = "wafito"; // default_channel_id
        String title = "Toca para ir a la aplicación"; // Default Channel
        Intent intent;
        PendingIntent pendingIntent;
        NotificationCompat.Builder builder;
        if (notifManager == null) {
            notifManager = (NotificationManager) context
                .getSystemService(Context.NOTIFICATION_SERVICE);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            int importance = NotificationManager.IMPORTANCE_LOW;
            NotificationChannel mChannel = notifManager
                             .getNotificationChannel(id);
            if (mChannel == null) {
                mChannel = new NotificationChannel(id, title, importance);
                //mChannel.enableVibration(true);
                //mChannel.setVibrationPattern(
                          //new long[]{100, 200, 300, 400, 500, 
                                     //400, 300, 200, 400});
                notifManager.createNotificationChannel(mChannel);
            }
            builder = new NotificationCompat.Builder(context, id);
        } else {
            builder = new NotificationCompat.Builder(context, id);
        }

        try {
            intent = new Intent(context, Class.forName(
                                "com.test.MainActivity"));
            intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP 
                | Intent.FLAG_ACTIVITY_SINGLE_TOP);
            pendingIntent = PendingIntent.getActivity(context, 0, intent, 0);
            builder.setContentTitle(aMessage)
                    .setSmallIcon(android.R.drawable.ic_dialog_map)
                    .setContentText(context.getString(android.R.string.app_name))
                    .setContentText("Toca para ir a la aplicación.")
                    .setDefaults(Notification.DEFAULT_ALL)
                    .setAutoCancel(true)
                    .setContentIntent(pendingIntent)
                    .setTicker(aMessage)
                    .setPriority(Notification.PRIORITY_LOW);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        return builder.build();
    }*/

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        shouldRestartSocketListen = true;
        startListenForUDPBroadcast();
        Log.i("UDP", "Service started");
        //NotifeeApiModule nt = new NotifeeApiModule((ReactApplicationContext) getApplicationContext());

        //nt.displayNotification(dsf, sdf);
        return START_STICKY;
        //final NotificationCompat.Builder builder = new NotificationCompat.Builder(this)
        //    .setSmallIcon(android.R.drawable.ic_launcher)
        //    .setContentTitle("UDP servicico");
        //notificationManager.cancel(notification_id);
        //notificationManager.notify(notifification_id, builder.build());
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }
}
