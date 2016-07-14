package com.example.god.sampleapp2;

import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Handler;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.GridLayout;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.example.CallbackRos;
import com.example.Ros;
import com.example.Topic;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

public class Main2Activity extends AppCompatActivity {

    private String ip;
    private String namespace;
    private TextView textViewRoll;
    private TextView textViewPitch;
    private TextView textViewYaw;
    private TextView textViewRollSpeed;
    private TextView textViewPitchSpeed;
    private TextView textViewYawSpeed;

    private TextView textViewVoltage;
    private TextView textViewCurrent;
    private TextView textViewRemaining;
    private TextView textViewLat;
    private TextView textViewLong;
    private TextView textViewAlt;
    private TextView textViewTrial;
    private Ros ros;
    private Topic attitudeTopic;
    private Topic batteryTopic;
    private Topic gpsTopic;
    private LinearLayout linearLayout;
    private int i=0;

    private Handler mHandler;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        Bundle b = getIntent().getExtras();
        ip=b.getString("ip");
        //Initialise a ros object with websocket url
        ros=new Ros("ws://"+ip+":9090/websocket");
        ros.connect();


        namespace=b.getString("namespace");
        textViewRoll=new TextView(getApplicationContext());
        textViewRoll=(TextView)findViewById(R.id.textViewRoll);
        textViewPitch=(TextView)findViewById(R.id.textViewPitch);
        textViewYaw=(TextView)findViewById(R.id.textViewYaw);
        textViewRollSpeed=(TextView)findViewById(R.id.textViewRollSpeed);
        textViewPitchSpeed=(TextView)findViewById(R.id.textViewPitchSpeed);
        textViewYawSpeed=(TextView)findViewById(R.id.textViewYawSpeed);
        textViewVoltage=(TextView)findViewById(R.id.textViewVoltage);
        textViewCurrent=(TextView)findViewById(R.id.textViewCurrent);
        textViewRemaining=(TextView)findViewById(R.id.textViewRemaining);
        textViewLat=(TextView)findViewById(R.id.textViewLat);
        textViewLong=(TextView)findViewById(R.id.textViewLong);
        textViewAlt=(TextView)findViewById(R.id.textViewAltitude);
        new NamespaceRequest().execute();


//
//        subscribeSocketData();
    }



    //Rest call
    private class NamespaceRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://" + ip + ":9090/ros/get_global_namespace";
                //params in json
                String requestJson = "{}";
                //headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<String> entity = new HttpEntity<String>(requestJson, headers);
                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url, entity, String.class);

                return response;
            } catch (Exception e) {
                Log.e("MainActivity", e.getMessage(), e);
            }

            return null;
        }

        //function called after a successful rest call
        @Override
        protected void onPostExecute(String response) {
            if (response!="") {


                subscribeSocketData();

//                try {
//
//
//                } catch (JSONException | NullPointerException e) {
//                }
            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void handleAttitudeData(JSONObject message){
        try {
            double roll=round(message.getJSONObject("twist").getJSONObject("linear").getDouble("x"),4);
//            Log.d("testing",roll+"");
            textViewRoll.setText(roll+"");
            textViewPitch.setText(round(message.getJSONObject("twist").getJSONObject("linear").getDouble("y"),4)+"");
            textViewYaw.setText(round(message.getJSONObject("twist").getJSONObject("linear").getDouble("z"),4)+"");
            textViewRollSpeed.setText(round(message.getJSONObject("twist").getJSONObject("angular").getDouble("x"),4)+"");
            textViewPitchSpeed.setText(round(message.getJSONObject("twist").getJSONObject("angular").getDouble("y"),4)+"");
            textViewYawSpeed.setText(round(message.getJSONObject("twist").getJSONObject("angular").getDouble("z"),4)+"");
//                    updateYaw(message.getJSONObject("twist").getJSONObject("linear").getDouble("z"));

        }catch(JSONException e){}
    }

    private void subscribeSocketData(){

        attitudeTopic=new Topic(ros,"/"+namespace+"/mavros/imu/data_euler" , "geometry_msgs/TwistStamped",1000);
        attitudeTopic.subscribe(new CallbackRos(){
            //callback method- what to do when messages recieved.
            @Override
            public void handleMessage(JSONObject message){
                handleAttitudeData(message);
            }
        });

        batteryTopic=new Topic(ros,"/"+namespace+"/mavros/battery" , "mavros_msgs/BatteryStatus",1000);
        batteryTopic.subscribe(new CallbackRos(){
            //callback method- what to do when messages recieved.
            @Override
            public void handleMessage(JSONObject message){
                try {


                    textViewVoltage.setText(round(message.getDouble("voltage"),2)+"");
                    textViewCurrent.setText(round(message.getDouble("current"),2)+"");
                    textViewRemaining.setText(round(message.getDouble("remaining"),2)+"");

                }catch(JSONException e){}

                linearLayout.refreshDrawableState();
            }
        });

        gpsTopic=new Topic(ros,"/"+namespace+"/mavros/global_position/global" , "sensor_msgs/NavSatFix",1000);
        gpsTopic.subscribe(new CallbackRos(){
            //callback method- what to do when messages recieved.
            @Override
            public void handleMessage(JSONObject message){
                try {
                    textViewLat.setText(round(message.getDouble("latitude"),4)+"");
                    textViewLong.setText(round(message.getDouble("longitude"),4)+"");
                    textViewAlt.setText(round(message.getDouble("altitude"),4)+"");

                }catch(JSONException e){}
            }
        });

    }
    private double round(double value,int dec){
        value=Math.round(value*Math.pow(10,dec));
        value=value/Math.pow(10,dec);
        return value;
    }
}
