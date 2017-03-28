package com.example.god.flyt_follow_me;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;


public class MainActivity extends AppCompatActivity {

    //    private Ros ros;
//    private Topic topic;
    private Button buttonConnect;
    private EditText editTextIP;
    //    private TextView textViewNamespace;
    private String IP;
    private String namespace;
//    private TextView textViewRoll;
//    private TextView textViewPitch;
//    private TextView textViewYaw;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);


        buttonConnect = (Button) findViewById(R.id.buttonConnect);
        buttonConnect.setOnClickListener(buttonConnectListener);
        editTextIP = (EditText) findViewById(R.id.editTextIP);
        editTextIP.setText("192.168.1.");

    }

    private View.OnClickListener buttonConnectListener=new View.OnClickListener() {
        @Override public void onClick(View v){
            //get IP from User
            Toast.makeText(getApplicationContext(),"Connecting",Toast.LENGTH_LONG).show();
            IP=editTextIP.getText().toString();
            //Initialise a ros object with websocket url
//            ros=new Ros("ws://"+IP+"/websocket");
//            ros.connect();

            View view = getCurrentFocus();
            if (view != null) {
                InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
            //Rest call for namespace
            new NamespaceRequest().execute();

        }
    };
    //Rest call
    private class NamespaceRequest extends AsyncTask<Void, Void, String> {
        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://"+IP+"/ros/get_global_namespace";
                //params in json
                String requestJson = "{}";
                //headers
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);

                HttpEntity<String> entity = new HttpEntity<String>(requestJson,headers);
                //restTemplate object initialise for rest call
                RestTemplate restTemplate = new RestTemplate();
                restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
                // make the rest call and recieve the response in "response"
                String response = restTemplate.postForObject(url,entity, String.class);

                return response;
            } catch (Exception  e) {
                Log.e("MainActivity", e.getMessage(), e);
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();
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
                    namespace=resp.getJSONObject("param_info").getString("param_value");
//                    textViewNamespace.setText(namespace);
                    Toast.makeText(getApplicationContext(),"Connected.",Toast.LENGTH_SHORT).show();


                    Intent intent = new Intent(MainActivity.this, MapsActivity.class);
////                    EditText editText = (EditText) findViewById(R.id.editText);
                    intent.putExtra("ip", IP);
                    intent.putExtra("namespace", namespace);
                    startActivity(intent);


                } catch (JSONException  | NullPointerException e) {
                }



            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();

            }
        }

    }
//    public void updateRoll(double roll){
//        roll = Math.round(roll * 100000);
//        roll = roll/100000;
//        textViewRoll.setText(String.valueOf(roll));
//    }
//    public void updatePitch(double pitch){
//        pitch = Math.round(pitch * 100000);
//        pitch = pitch/100000;
//        textViewPitch.setText(String.valueOf(pitch));
//    }
//    public void updateYaw(double yaw){
//        yaw = Math.round(yaw * 100000);
//        yaw = yaw/100000;
//        textViewYaw.setText(String.valueOf(yaw));
//    }
}
