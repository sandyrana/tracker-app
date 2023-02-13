package com.essgpstracking;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.RequiresApi;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends ReactActivity {
  public static final String NOTIF_CHANNEL_ID = "my_channel_01";
  private static final String TAG = "test";

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    SplashScreen.show(this);
    super.onCreate(savedInstanceState);

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      createNotifChannel(this);
    }
  }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "ESSGpsTracking";
  }

  @RequiresApi(Build.VERSION_CODES.O)
  private void createNotifChannel(Context context) {
    NotificationChannel channel = new NotificationChannel(NOTIF_CHANNEL_ID,
            "MyApp events", NotificationManager.IMPORTANCE_LOW);
    // Configure the notification channel
    channel.setDescription("MyApp event controls");
    channel.setShowBadge(false);
    channel.setLockscreenVisibility(Notification.VISIBILITY_PUBLIC);

    NotificationManager manager = context.getSystemService(NotificationManager.class);

    manager.createNotificationChannel(channel);
    Log.d(TAG, "createNotifChannel: created=" + NOTIF_CHANNEL_ID);
  }
}
