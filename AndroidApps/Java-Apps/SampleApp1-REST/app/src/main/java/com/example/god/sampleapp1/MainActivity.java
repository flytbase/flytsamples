package com.example.god.sampleapp1;

import android.content.Context;
import android.content.Intent;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.Ros;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

public class MainActivity extends AppCompatActivity {

    private Button buttonConnect;
    private EditText editTextIP;
    private Ros ros;
    private String IP;
    private Intent app;
    private String namespace;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        buttonConnect=(Button)findViewById(R.id.buttonConnect);
        buttonConnect.setOnClickListener(buttonConnectListener);
        editTextIP = (EditText)findViewById(R.id.editTextIP);
    }

    private View.OnClickListener buttonConnectListener=new View.OnClickListener() {
        @Override public void onClick(View v){
            //get IP from User
            IP=editTextIP.getText().toString();

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
                final String url = "http://" + IP + ":9090/ros/get_global_namespace";
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

                try {
                    //initialise a JSON object with the response string
                    JSONObject resp = new JSONObject(response);
                    //extract the required field from the JSON object
                    namespace = resp.getJSONObject("param_info").getString("param_value");

                    app = new Intent(MainActivity.this, Main2Activity.class);
                    Bundle b = new Bundle();
                    b.putString("ip", IP);
                    b.putString("namespace",namespace );
                    app.putExtras(b);
                    startActivity(app);

                } catch (JSONException | NullPointerException e) {
                }
            }else{
                Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();
            }
        }
    }
}
