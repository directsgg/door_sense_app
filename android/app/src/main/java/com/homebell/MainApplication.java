package com.homebell;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

import android.location.LocationManager;
import android.location.LocationListener;
import android.location.Location;
import com.homebell.service.LocationService;
//import com.homebell.service.UDPListenerService;
//import com.homebell.service.ServicioMusica;
import android.content.Context;
import android.os.Bundle;
import android.content.Intent;
import com.facebook.react.HeadlessJsTaskService;

public class MainApplication extends Application implements ReactApplication {

  // when a location change update comes from system, this listener will handle it
  private final LocationListener listener = new LocationListener() {
    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    } 

    @Override
    public void onLocationChanged(Location location) {
      //Intent myIntent = new Intent(getApplicationContext(), LocationService.class);
      //getApplicationContext().startService(myIntent);
      //HeadlessJsTaskService.acquireWakeLockNow(getApplicationContext());
    }
  };
  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          //packages.add(new setInervalModule()); // add this line with your package name
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    //LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
    // start requesting for location
    //locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 2000, 1, listener);
    //Intent myIntentUDPService = new Intent(getApplicationContext(), UDPListenerService.class);
    //getApplicationContext().startService(myIntentUDPService);

    Intent myIntentUDPService = new Intent(getApplicationContext(), LocationService.class);
    getApplicationContext().startService(myIntentUDPService);

    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}
