package com.example.navstik.joystik_n;

import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.MotionEvent;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

public class Main2Activity extends AppCompatActivity {
    private Button buttonLeft;
    private Button buttonRight;
    private Button buttonFront;
    private Button buttonBack;
    private Button buttonUp;
    private Button buttonDown;
    private Button buttonTurnLeft;
    private Button buttonTurnRight;
    private Button buttonTakeOff;
    private Button buttonLand;
    private String ip;
    private String namespace;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);


        buttonLand = (Button) findViewById(R.id.buttonLand);
        buttonLand.setOnClickListener(buttonLandListener);
        buttonLeft = (Button) findViewById(R.id.buttonLeft);
        buttonLeft.setOnTouchListener(buttonLeftListener);
        buttonRight = (Button) findViewById(R.id.buttonRight);
        buttonRight.setOnTouchListener(buttonRightListener);
        buttonFront = (Button) findViewById(R.id.buttonFront);
        buttonFront.setOnTouchListener(buttonFrontListener);
        buttonBack = (Button) findViewById(R.id.buttonBack);
        buttonBack.setOnTouchListener(buttonBackListener);
        buttonUp = (Button) findViewById(R.id.buttonUp);
        buttonUp.setOnTouchListener(buttonUpListener);
        buttonDown = (Button) findViewById(R.id.buttonDown);
        buttonDown.setOnTouchListener(buttonDownListener);
        buttonTurnLeft = (Button) findViewById(R.id.buttonTurnLeft);
        buttonTurnLeft.setOnTouchListener(buttonTurnLeftListener);
        buttonTurnRight = (Button) findViewById(R.id.buttonTurnRight);
        buttonTurnRight.setOnTouchListener(buttonTurnRightListener);
        buttonTakeOff = (Button) findViewById(R.id.buttonTakeOff);
        buttonTakeOff.setOnClickListener(buttonTakeOffListener);

        Bundle b = getIntent().getExtras();
        ip=b.getString("ip");
        namespace=b.getString("namespace");

    }


    private View.OnClickListener buttonTakeOffListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            new TakeOffRequest().execute();
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
            } catch (Exception e) {
                Log.e("MainActivity", e.getMessage(), e);
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
        @Override
        protected String doInBackground(Void... params) {
            try {
//                Log.d("tttttttttt",ip+namespace);
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/take_off";
                //params in json
                JSONObject param= new JSONObject();
                param.put("takeoff_alt",7.00);

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
                    Log.d("namespace",resp.toString());
                    Toast.makeText(getApplicationContext(),"command sent.",Toast.LENGTH_SHORT).show();



                } catch (JSONException  | NullPointerException e) {
                }

            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();
            }
        }
    }

    private class LandRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+"/ros/"+namespace+"/navigation/land";
                //params in json
                JSONObject param= new JSONObject();
//                param.put("takeoff_alt",3.00);

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
                    Log.d("namespace",resp.toString());
                    Toast.makeText(getApplicationContext(),"command sent.",Toast.LENGTH_SHORT).show();


                } catch (JSONException | NullPointerException e) {
                }

            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();

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
