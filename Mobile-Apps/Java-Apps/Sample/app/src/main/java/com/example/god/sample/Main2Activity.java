package com.example.god.sample;

import android.content.Intent;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RelativeLayout;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.io.IOError;

public class Main2Activity extends AppCompatActivity {

    private Button buttonTakeOff, buttonTakeOff1;
    private Button buttonLand;
    private String ip;
    private String namespace;
    private EditText editTextHt;
    private RelativeLayout takeOffBox;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);

        buttonLand = (Button) findViewById(R.id.buttonLand);
        buttonLand.setOnClickListener(buttonLandListener);
        editTextHt = (EditText) findViewById(R.id.editTextHt);
        buttonTakeOff = (Button) findViewById(R.id.buttonTakeOff);
        buttonTakeOff.setOnClickListener(buttonTakeOffListener);
        buttonTakeOff1 = (Button) findViewById(R.id.buttonTakeOff1);
        buttonTakeOff1.setOnClickListener(buttonTakeOff1Listener);
        takeOffBox= (RelativeLayout) findViewById(R.id.takeOffBox);

        Intent intent = getIntent();
        ip = intent.getStringExtra("ip");
        namespace = intent.getStringExtra("namespace");

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

    private class TakeOffRequest extends AsyncTask<Void, Void, String> {
        private Double takeoff_alt;

        public TakeOffRequest(Double val) {
            takeoff_alt = val;
        }
        @Override
        protected String doInBackground(Void... params) {
            try {
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


                } catch (JSONException | NullPointerException e) {
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

}
