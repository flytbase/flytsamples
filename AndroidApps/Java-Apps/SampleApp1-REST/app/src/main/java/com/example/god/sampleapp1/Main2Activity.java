package com.example.god.sampleapp1;

import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

public class Main2Activity extends AppCompatActivity {
    private Button buttonTakeOff;
    private Button buttonLand;
    private Button buttonHover;
    private String ip;
    private String namespace;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        buttonTakeOff = (Button) findViewById(R.id.buttonTakeOff);
        buttonLand = (Button) findViewById(R.id.buttonLand);
        buttonHover = (Button) findViewById(R.id.buttonHover);
        buttonTakeOff.setOnClickListener(buttonTakeOffListener);
        buttonLand.setOnClickListener(buttonLandListener);
        buttonHover.setOnClickListener(buttonHoverListener);
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
    private View.OnClickListener buttonHoverListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            new HoverRequest().execute();
        }
    };





    private class TakeOffRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+":9090/ros/"+namespace+"/navigation/take_off";
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


                } catch (JSONException | NullPointerException e) {
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
                final String url = "http://"+ip+":9090/ros/"+namespace+"/navigation/land";
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
    private class HoverRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+ip+":9090/ros/"+namespace+"/navigation/position_hold";
                //params in json
                JSONObject param = new JSONObject();
//                param.put("takeoff_alt",3.00);

                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url, param.toString(), String.class);

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
                    Toast.makeText(getApplicationContext(), "command sent.", Toast.LENGTH_SHORT).show();


                } catch (JSONException | NullPointerException e) {
                }

            } else {
                Toast.makeText(getApplicationContext(), "Unable to connect. Retry!", Toast.LENGTH_SHORT).show();

            }
        }
    }
}
