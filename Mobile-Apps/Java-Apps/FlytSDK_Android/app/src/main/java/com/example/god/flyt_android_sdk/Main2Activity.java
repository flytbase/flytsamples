package com.example.god.flyt_android_sdk;

import android.content.Intent;
import android.graphics.Color;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

import com.example.CallbackRos;
import com.example.Ros;
import com.example.Topic;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.Timer;
import java.util.TimerTask;

public class Main2Activity extends AppCompatActivity {

    private String ip;
    private String namespace;
    private Integer satellites;
    private Double  altitude,roll, pitch, yaw;
    private Handler disconnect = new Handler();
    private Runnable disconnectRunner;
    private Boolean  connectionStatus, armStatus;
    private Ros ros;
    private Topic gpsData, stateData, localPosData, imuData;
    private TextView textViewConnectionStatus;
    private TextView textViewAlt, textViewSat, textViewArmStatus;
    private TextView textViewNamespace;
    private TextView textViewRoll;
    private TextView textViewPitch;
    private TextView textViewYaw;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);


        textViewConnectionStatus = (TextView) findViewById(R.id.textViewConnectionStatus);
        textViewArmStatus = (TextView) findViewById(R.id.textViewArmStatus);
        textViewAlt = (TextView) findViewById(R.id.textViewAlt);
        textViewSat = (TextView) findViewById(R.id.textViewSat);
        textViewNamespace = (TextView)findViewById(R.id.textViewNamespace);
        textViewRoll = (TextView)findViewById(R.id.textViewRoll);
        textViewPitch = (TextView)findViewById(R.id.textViewPitch);
        textViewYaw = (TextView)findViewById(R.id.textViewYaw);

        Intent intent = getIntent();
        ip = intent.getStringExtra("ip");
        namespace = intent.getStringExtra("namespace");
        textViewNamespace.setText(namespace);

        satellites = new Integer(0);
        altitude = new Double(0.0);
        roll=new Double(0.0);
        pitch=new Double(0.0);
        yaw=new Double(0.0);
        disconnectRunner = new Runnable() {
            @Override
            public void run() {
                connectionStatus = Boolean.FALSE;
//                imageViewConnectionStatus.setBackgroundColor(Color.RED);

            }
        };

        rosInitialize();
    }



    private void rosInitialize() {

        ros = new Ros("ws://" + ip + "/websocket");
        try {
            ros.connect();
        }catch(Exception e){}
        final Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                try {
                    getTelemetryData();
                }catch(Exception e){}
            }
        }, 3000);


    }

    public void getTelemetryData() {
        gpsData = new Topic(ros, "/" + namespace + "/mavros/global_position/global", "sensor_msgs/NavSatFix", 1000);
        gpsData.subscribe(new CallbackRos() {
            //callback method- what to do when messages recieved.
            @Override
            public void handleMessage(JSONObject message) {

                try {

                    satellites = message.getJSONObject("status").getInt("status");


                } catch (JSONException e) {
                }
            }
        });

        stateData = new Topic(ros, "/" + namespace + "/flyt/state", "mavros_msgs/State", 200);
        stateData.subscribe(new CallbackRos() {
            @Override
            public void handleMessage(JSONObject message) {
                try {
                    connectionStatus = message.getBoolean("connected");
                    armStatus= message.getBoolean("armed");
                } catch (JSONException e) {
                }

                disconnect.removeCallbacks(disconnectRunner);
                disconnect.postDelayed(disconnectRunner, 3000);
            }
        });

        localPosData = new Topic(ros, "/" + namespace + "/mavros/local_position/local", "geometry_msgs/TwistStamped", 200);
        localPosData.subscribe(new CallbackRos() {
            @Override
            public void handleMessage(JSONObject message) {
                try {
                    altitude = message.getJSONObject("twist").getJSONObject("linear").getDouble("z");
                } catch (JSONException e) {
                }
            }
        });


        imuData = new Topic(ros,"/"+namespace+"/mavros/imu/data_euler" , "geometry_msgs/TwistStamped",200);
        imuData.subscribe(new CallbackRos() {
            @Override
            public void handleMessage(JSONObject message) {
                try {
                    roll=message.getJSONObject("twist").getJSONObject("linear").getDouble("x");
                    pitch=message.getJSONObject("twist").getJSONObject("linear").getDouble("y");
                    yaw=message.getJSONObject("twist").getJSONObject("linear").getDouble("z");
                } catch (JSONException e) {
                }
            }
        });
        callAsynchronousTask();

    }

    private void updateConnectionStatus() {
        if (connectionStatus) {
            textViewConnectionStatus.setBackgroundColor(Color.GREEN);
            textViewConnectionStatus.setText("Online");
        } else {
            rosInitialize();
            textViewConnectionStatus.setBackgroundColor(Color.RED);
            textViewConnectionStatus.setText("Offline");
        }
        textViewConnectionStatus.setTextColor(Color.WHITE);

    }

    private void updateAltSat() {

        textViewAlt.setText("Alt: " + String.format("%.2f", altitude * -1)+" m");
        textViewSat.setText("Sat: " + satellites);
    }
    public void updateArmStatus(){
        if (armStatus) {
            textViewArmStatus.setText("Armed");
        } else {
            textViewArmStatus.setText("Disarmed");
        }
        textViewArmStatus.setTextColor(Color.WHITE);
    }
    public void updateAttitude(){
        roll = Math.round(roll * 100000)*1.0;
        roll = roll/100000;
        textViewRoll.setText(String.valueOf(roll));

        pitch = Math.round(pitch * 100000)*1.0;
        pitch = pitch/100000;
        textViewPitch.setText(String.valueOf(pitch));

        yaw = Math.round(yaw * 100000)*1.0;
        yaw = yaw/100000;
        textViewYaw.setText(String.valueOf(yaw));

    }
    public void callAsynchronousTask() {
        final Handler handler = new Handler();
        Timer timer = new Timer();
        TimerTask doAsynchronousTask = new TimerTask() {
            @Override
            public void run() {
                handler.post(new Runnable() {
                    public void run() {
                        try {
                            updateConnectionStatus();
                            updateAltSat();
                            updateArmStatus();
                            updateAttitude();
                        } catch (Exception e) {
                            // TODO Auto-generated catch block
                        }
                    }
                });
            }
        };
        timer.schedule(doAsynchronousTask, 0, 1000); //execute in every 50000 ms
    }


}
