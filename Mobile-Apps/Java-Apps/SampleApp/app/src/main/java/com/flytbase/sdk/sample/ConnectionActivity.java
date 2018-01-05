package com.flytbase.sdk.sample;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import org.json.JSONObject;

import java.io.IOError;

public class ConnectionActivity extends AppCompatActivity {

    private Button buttonConnect;
    private EditText editTextIP;
    private String IP;
    private String namespace;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_connection);

        buttonConnect=(Button)findViewById(R.id.buttonConnect);
        buttonConnect.setOnClickListener(buttonConnectListener);
        editTextIP = (EditText)findViewById(R.id.editTextIP);
    }

    private View.OnClickListener buttonConnectListener=new View.OnClickListener() {
        @Override public void onClick(View v){
            //get IP from User
            Toast.makeText(getApplicationContext(),"Connecting",Toast.LENGTH_LONG).show();
            IP=editTextIP.getText().toString();

            View view = getCurrentFocus();
            if (view != null) {
                InputMethodManager imm = (InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE);
                imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
            }
            //Rest call for namespace
            //new NamespaceRequest().execute();

            fetchNameSpace();


        }
    };

    private void fetchNameSpace() {
        HttpParam httpParam = new HttpParam();
        httpParam.setUrl("http://" + IP + "/ros/get_global_namespace");
        JSONObject params=new JSONObject();
        httpParam.setParams(params);


        HttpRequest request=  new HttpRequest(new HttpRequest.IResponseHandler() {
            @Override
            public void onResponse(String response) {
                if (response!="") {
                    try {
                        //initialise a JSON object with the response string
                        JSONObject resp = new JSONObject(response);
                        //extract the required field from the JSON object
                        namespace = resp.getJSONObject("param_info").getString("param_value");

                        Toast.makeText(getApplicationContext(),"Connected.",Toast.LENGTH_SHORT).show();

                        Intent intent = new Intent(ConnectionActivity.this, SampleActivity.class);
////                    EditText editText = (EditText) findViewById(R.id.editText);
                        intent.putExtra("ip", IP);
                        intent.putExtra("namespace", namespace);
                        startActivity(intent);

                    } catch (Exception| IOError e) {
                        Toast.makeText(getApplicationContext(),"Unable to connect. Check IP!",Toast.LENGTH_SHORT).show();
                    }
                }else{
                    Toast.makeText(getApplicationContext(),"Unable to connect. Retry!",Toast.LENGTH_SHORT).show();
                }
            }
        });
        request.execute(httpParam);

    }


}
