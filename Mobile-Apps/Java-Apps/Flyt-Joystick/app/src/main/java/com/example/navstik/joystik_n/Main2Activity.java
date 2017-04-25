package com.example.navstik.joystik_n;

import android.content.Intent;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.CallbackRos;
import com.example.Ros;
import com.example.Topic;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.io.IOError;
import java.util.Timer;
import java.util.TimerTask;

public class Main2Activity extends AppCompatActivity {
    private ImageButton buttonLeft, buttonRight,buttonFront, buttonBack;
    private Button buttonUp;
    private Button buttonDown;
    private Button buttonTurnLeft;
    private Button buttonTurnRight;
    private Button buttonTakeOff, buttonTakeOff1;
    private Button buttonLand;
    private String ip;
    private String namespace;
    private Integer satellites;
    private Double  altitude;
    private Handler disconnect = new Handler();
    private Runnable disconnectRunner;
    private Boolean  connectionStatus, armStatus;
    private Ros ros;
    private Topic gpsData, stateData, localPosData;
    private EditText editTextHt;
    private RelativeLayout takeOffBox;
    private TextView textViewConnectionStatus;
    private TextView textViewAlt, textViewSat, textViewArmStatus;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);


        buttonLand = (Button) findViewById(R.id.buttonLand);
        buttonLand.setOnClickListener(buttonLandListener);
        buttonLeft = (ImageButton) findViewById(R.id.buttonLeft);
        buttonLeft.setOnTouchListener(buttonLeftListener);
        buttonRight = (ImageButton) findViewById(R.id.buttonRight);
        buttonRight.setOnTouchListener(buttonRightListener);
        buttonFront = (ImageButton) findViewById(R.id.buttonFront);
        buttonFront.setOnTouchListener(buttonFrontListener);
        buttonBack = (ImageButton) findViewById(R.id.buttonBack);
        buttonBack.setOnTouchListener(buttonBackListener);
        buttonUp = (Button) findViewById(R.id.buttonUp);
        buttonUp.setOnTouchListener(buttonUpListener);
        buttonDown = (Button) findViewById(R.id.buttonDown);
        buttonDown.setOnTouchListener(buttonDownListener);
        buttonTurnLeft = (Button) findViewById(R.id.buttonTurnLeft);
        buttonTurnLeft.setOnTouchListener(buttonTurnLeftListener);
        buttonTurnRight = (Button) findViewById(R.id.buttonTurnRight);
        buttonTurnRight.setOnTouchListener(buttonTurnRightListener);
        editTextHt = (EditText) findViewById(R.id.editTextHt);
        buttonTakeOff = (Button) findViewById(R.id.buttonTakeOff);
        buttonTakeOff.setOnClickListener(buttonTakeOffListener);
        buttonTakeOff1 = (Button) findViewById(R.id.buttonTakeOff1);
        buttonTakeOff1.setOnClickListener(buttonTakeOff1Listener);
        takeOffBox= (RelativeLayout) findViewById(R.id.takeOffBox);
        textViewConnectionStatus = (TextView) findViewById(R.id.textViewConnectionStatus);
        textViewArmStatus = (TextView) findViewById(R.id.textViewArmStatus);
        textViewAlt = (TextView) findViewById(R.id.textViewAlt);
        textViewSat = (TextView) findViewById(R.id.textViewSat);

        Intent intent = getIntent();
        ip = intent.getStringExtra("ip");
        namespace = intent.getStringExtra("namespace");


        satellites = new Integer(0);
        altitude = new Double(0.0);
        disconnectRunner = new Runnable() {
            @Override
            public void run() {
                connectionStatus = Boolean.FALSE;
//                imageViewConnectionStatus.setBackgroundColor(Color.RED);

            }
        };

        rosInitialize();

    }

    private View.OnClickListener buttonTakeOff1Listener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (takeOffBox.getVisibility() == RelativeLayout.VISIBLE) {
                takeOffBox.setVisibility(RelativeLayout.INVISIBLE);
            } else {
                takeOffBox.setVisibility(RelativeLayout.VISIBLE);
            }
        }
    };
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

                        } catch (Exception e) {
                            // TODO Auto-generated catch block
                        }
                    }
                });
            }
        };
        timer.schedule(doAsynchronousTask, 0, 1000); //execute in every 50000 ms
    }
    private View.OnClickListener buttonTakeOffListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            new TakeOffRequest(Double.parseDouble(editTextHt.getText().toString())).execute();
            takeOffBox.setVisibility(RelativeLayout.INVISIBLE);
        }
    };
    private View.OnClickListener buttonLandListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            new LandRequest().execute();
        }
    };


    private View.OnTouchListener buttonLeftListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,-2,0,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonRightListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,2,0,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonFrontListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(2,0,0,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonBackListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(-2,0,0,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonUpListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,0,-1,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonDownListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,0,1,0).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };

    private View.OnTouchListener buttonTurnLeftListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,0,0,-0.5).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    return true;
            }
            return false;
        }
    };
    private View.OnTouchListener buttonTurnRightListener = new View.OnTouchListener() {
        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch(event.getAction()) {
                case MotionEvent.ACTION_DOWN:
                    // PRESSED
                    new VelocitySetRequest(0,0,0,0.5).execute(); // if you want to handle the touch event
                    return true;
                case MotionEvent.ACTION_UP:
                    // RELEASED
                    new positionHoldRequest().execute();
                    //VelocitySet(0,0,0,0); // if you want to handle the touch event
                    return true;
            }
            return false;
        }
    };

//    private void VelocitySet(final double x, final double y, final double z, final double zang){
    private  class VelocitySetRequest extends AsyncTask<Void, Void, String> {
        double x,y,z,zang;
        VelocitySetRequest( double x,  double y,  double z,  double zang) {
            this.x=x;
            this.y=y;
            this.z=z;
            this.zang=zang;
        }
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/velocity_set";
                //params in json
                JSONObject param = new JSONObject();
                param.put("x", x);
                param.put("y", y);
                param.put("z", z);
                JSONObject param1 = new JSONObject();
                param1.put("linear", param);
                param= new JSONObject();
                param.put("z",zang);
                param1.put("angular",param);
                param = new JSONObject();
                param.put("twist", param1);
                param1 = new JSONObject();
                param1.put("twist", param);
                param1.put("tolerance",2.00);
                param1.put("async",true);
                param1.put("relative",false);
                param1.put("body_frame",true);
                if (zang==0){
                    param1.put("yaw_rate_valid",false);
                }else{
                    param1.put("yaw_rate_valid",true);
                }

                Log.d("velocity_data", param1.toString());
                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url, param1.toString(), String.class);

                return response;
            } catch (Exception | IOError e) {
            }

            return null;
        }

        //function called after a successful rest call
        @Override
        protected void onPostExecute(String response) {
            if (response != "") {

                try {
                    //initialise a JSON object with the response string
                    JSONObject resp = new JSONObject(response);
                    //extract the required field from the JSON object
//                         namespace = resp.getJSONObject("param_info").getString("param_value");
//                        Log.d("namespace", resp.toString());
//                        Toast.makeText(getApplicationContext(), "command sent.", Toast.LENGTH_SHORT).show();


                } catch (JSONException | NullPointerException e) {
                }

            } else {
                Toast.makeText(getApplicationContext(), "Unable to connect. Retry!", Toast.LENGTH_SHORT).show();

            }
        }
    }

    private class TakeOffRequest extends AsyncTask<Void, Void, String> {
        private Double takeoff_alt;

        public TakeOffRequest(Double val) {
            takeoff_alt = val;
        }
        @Override
        protected String doInBackground(Void... params) {
            try {
//                Log.d("tttttttttt",ip+namespace);
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/take_off";
                //params in json
                JSONObject param= new JSONObject();
                param.put("takeoff_alt",takeoff_alt);

                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url,param.toString(), String.class);

                return response;
            } catch (Exception  e) {
                Log.e("MainActivity", e.getMessage(), e);
            }

            return null;
        }
        //function called after a successful rest call
        @Override
        protected void onPostExecute(String response) {
            if (response!="") {

                try {
                    //initialise a JSON object with the response string
                    JSONObject resp = new JSONObject(response);
                    //extract the required field from the JSON object
//                    namespace=resp.getJSONObject("param_info").getString("param_value");
                    if (resp.getBoolean("success")) {
                        Toast.makeText(getApplicationContext(), "Taking Off.", Toast.LENGTH_SHORT).show();

                    } else {
                        Toast.makeText(getApplicationContext(), "Take Off rejected.", Toast.LENGTH_SHORT).show();
                    }


                } catch (JSONException  | NullPointerException e) {
                }

            }else{
                Toast.makeText(getApplicationContext(), "Failed to contact FlytPOD. Retry Take Off!", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private class LandRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/land";

                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.getForObject(url, String.class);

                return response;
            } catch (Exception  |IOError e) {

            }
            return null;
        }
        //function called after a successful rest call
        @Override
        protected void onPostExecute(String response) {
            if (response!="") {

                try {
                    //initialise a JSON object with the response string
                    JSONObject resp = new JSONObject(response);
                    //extract the required field from the JSON object
//                    namespace=resp.getJSONObject("param_info").getString("param_value");
                    if (resp.getBoolean("success")) {
                        Toast.makeText(getApplicationContext(), "Landing", Toast.LENGTH_SHORT).show();

                    } else {
                        Toast.makeText(getApplicationContext(), "Land rejected.", Toast.LENGTH_SHORT).show();
                    }

                } catch (JSONException | NullPointerException e) {
                }

            }else{
                Toast.makeText(getApplicationContext(), "Failed to contact FlytPOD. Retry Land!", Toast.LENGTH_SHORT).show();

            }
        }

    }

    private class positionHoldRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/position_hold";
                //params in json
                JSONObject param= new JSONObject();
//                param.put("takeoff_alt",3.00);

                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url,param.toString(), String.class);

                return response;
            } catch (Exception  |IOError e) {
            }
            return null;
        }
        //function called after a successful rest call
        @Override
        protected void onPostExecute(String response) {
            if (response!="") {

                try {
                    //initialise a JSON object with the response string
                    JSONObject resp = new JSONObject(response);
                    //extract the required field from the JSON object
//                    namespace=resp.getJSONObject("param_info").getString("param_value");
                    Log.d("namespace",resp.toString());
                    Toast.makeText(getApplicationContext(),"command sent.",Toast.LENGTH_SHORT).show();


                } catch (JSONException | NullPointerException e) {
                }

            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();

            }
        }

    }
}
