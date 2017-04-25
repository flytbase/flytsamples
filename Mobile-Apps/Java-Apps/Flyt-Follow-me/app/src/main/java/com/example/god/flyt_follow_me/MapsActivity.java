package com.example.god.flyt_follow_me;

import android.*;
import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Handler;
import android.provider.Settings;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.support.v4.widget.TextViewCompat;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.GridLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;
import android.widget.ToggleButton;

import com.example.CallbackRos;
import com.example.Ros;
import com.example.Topic;
import com.google.android.gms.appindexing.Action;
import com.google.android.gms.appindexing.AppIndex;
import com.google.android.gms.appindexing.Thing;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.PolylineOptions;

import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.io.IOError;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

import static android.R.id.message;
//import static android.location.LocationManager.GPS_PROVIDER;


public class MapsActivity extends FragmentActivity implements OnMapReadyCallback, GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener ,LocationListener{

    private GoogleMap mMap;
    private GoogleApiClient mGoogleApiClient;
    private LocationRequest mLocationRequest;
    private Location mLastLocation;
    private Marker mCurrLocationMarker;
    private Marker mDroneLocationMarker;
    private String IP, namespace;
    private Ros ros;
    private Topic gpsData, stateData, localPosData;
    private double latitude, longitude;
    private EditText editTextHt;
    private Button buttonTakeOff, buttonTakeOff1;
    private Button buttonLand;
    private Boolean startFollow, connectionStatus, armStatus;
    private ImageButton buttonNudgeToggle, buttonNudgeLatP, buttonNudgeLatN, buttonNudgeLonP, buttonNudgeLonN;
    private ArrayList<LatLng> dronePoints, devicePoints;
    private GridLayout nudgeBox;
    private RelativeLayout takeOffBox;
    private Double latOffset, longOffset, altitude;
    private Integer startStoring, satellites;
    private ToggleButton toggleButtonFollow;
    private TextView textViewConnectionStatus;
    private TextView textViewAlt, textViewSat, textViewArmStatus;
    private Handler disconnect = new Handler();
    private Runnable disconnectRunner;
    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    private GoogleApiClient client;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_maps);
        // Obtain the SupportMapFragment and get notified when the map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);
        Intent intent = getIntent();
        IP = intent.getStringExtra("ip");
        namespace = intent.getStringExtra("namespace");
        editTextHt = (EditText) findViewById(R.id.editTextHt);
        buttonTakeOff = (Button) findViewById(R.id.buttonTakeOff);
        buttonTakeOff.setOnClickListener(buttonTakeOffListener);
        buttonTakeOff1 = (Button) findViewById(R.id.buttonTakeOff1);
        buttonTakeOff1.setOnClickListener(buttonTakeOff1Listener);
        buttonLand = (Button) findViewById(R.id.buttonLand);
        buttonLand.setOnClickListener(buttonLandListener);
        buttonNudgeToggle = (ImageButton) findViewById(R.id.buttonNudgeToggle);
        buttonNudgeToggle.setOnClickListener(buttonNudgeToggleListener);
        buttonNudgeLatP = (ImageButton) findViewById(R.id.buttonNudgeLatP);
        buttonNudgeLatP.setOnClickListener(buttonNudgeLatPListener);
        buttonNudgeLatN = (ImageButton) findViewById(R.id.buttonNudgeLatN);
        buttonNudgeLatN.setOnClickListener(buttonNudgeLatNListener);
        buttonNudgeLonP = (ImageButton) findViewById(R.id.buttonNudgeLonP);
        buttonNudgeLonP.setOnClickListener(buttonNudgeLonPListener);
        buttonNudgeLonN = (ImageButton) findViewById(R.id.buttonNudgeLonN);
        buttonNudgeLonN.setOnClickListener(buttonNudgeLonNListener);
        toggleButtonFollow = (ToggleButton) findViewById(R.id.toggleButtonFollow);
        toggleButtonFollow.setOnClickListener(toggleButtonFollowListener);
        nudgeBox = (GridLayout) findViewById(R.id.nudgeBox);
        takeOffBox= (RelativeLayout) findViewById(R.id.takeOffBox);
        textViewConnectionStatus = (TextView) findViewById(R.id.textViewConnectionStatus);
        textViewArmStatus = (TextView) findViewById(R.id.textViewArmStatus);
        textViewAlt = (TextView) findViewById(R.id.textViewAlt);
        textViewSat = (TextView) findViewById(R.id.textViewSat);
        dronePoints = new ArrayList<>();
        devicePoints = new ArrayList<>();
        startFollow = Boolean.FALSE;
        latOffset = longOffset = 0.0;
        startStoring = 0;
        satellites = new Integer(0);
        altitude = new Double(0.0);
        disconnectRunner = new Runnable() {
            @Override
            public void run() {
                connectionStatus = Boolean.FALSE;
//                imageViewConnectionStatus.setBackgroundColor(Color.RED);

            }
        };

        checkLocationPermission();

        rosInitialize();

        LocationManager locationManager = (LocationManager)
                getSystemService(LOCATION_SERVICE);
        Criteria criteria = new Criteria();

        if (ActivityCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            // TODO: Consider calling
            return;
        }
        Location location = locationManager.getLastKnownLocation(locationManager.GPS_PROVIDER);//getBestProvider(criteria, false));
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, new android.location.LocationListener() {
            @Override
            public void onLocationChanged(Location location) {
//                Log.d("gps data",location.getLatitude()+" "+location.getLongitude()+" "+location.getAccuracy());
                if(location.getAccuracy()<10.00 & startFollow ){
                    Log.d("sending commands",startFollow+"");
                    new setGlobalPositionRequest(location.getLatitude(),location.getLongitude(),Double.parseDouble(editTextHt.getText().toString())).execute();
                }
            }

            @Override
            public void onStatusChanged(String provider, int status, Bundle extras) {

            }

            @Override
            public void onProviderEnabled(String provider) {

            }

            @Override
            public void onProviderDisabled(String provider) {

            }
        });
//        Log.d("dddddddddd",location.getLatitude()+" "+location.getLongitude());
        mLastLocation = location;
//        Log.d("gps accuracy",location.getAccuracy()+" "+startFollow);
//        Toast.makeText(getApplicationContext(), location.getLatitude()+" "+location.getLongitude() +" "+location.getAccuracy()+" "+startFollow,Toast.LENGTH_LONG).show();



        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        client = new GoogleApiClient.Builder(this).addApi(AppIndex.API).build();
    }

    private View.OnClickListener toggleButtonFollowListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (toggleButtonFollow.isChecked()) {
                startFollow = Boolean.TRUE;
                Toast.makeText(getApplicationContext(), "Following Started " + startFollow, Toast.LENGTH_SHORT).show();
                try{
                    if (mLastLocation.getAccuracy() < 10.00 & startFollow == Boolean.TRUE) {
                        new setGlobalPositionRequest(mLastLocation.getLatitude(), mLastLocation.getLongitude(), Double.parseDouble(editTextHt.getText().toString())).execute();
                    }else if(mLastLocation.getAccuracy()>=10.00){
                        Toast.makeText(getApplicationContext(), "Waiting for accurate mobile GPS" ,Toast.LENGTH_LONG).show();
                    }
                }catch(Exception e){}
            } else {
                startFollow = Boolean.FALSE;
            }

        }
    };
    private View.OnClickListener buttonNudgeLatPListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (startFollow)
                latOffset += 0.00001;

        }
    };
    private View.OnClickListener buttonNudgeLatNListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (startFollow)
                latOffset -= 0.00001;
        }
    };
    private View.OnClickListener buttonNudgeLonPListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (startFollow)
                longOffset += 0.00001;

        }
    };
    private View.OnClickListener buttonNudgeLonNListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (startFollow)
                longOffset -= 0.00001;
        }
    };


    private View.OnClickListener buttonNudgeToggleListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            if (nudgeBox.getVisibility() == GridLayout.VISIBLE) {
                nudgeBox.setVisibility(GridLayout.INVISIBLE);
            } else {
                nudgeBox.setVisibility(GridLayout.VISIBLE);
            }
        }
    };
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
            new TakeoffRequest(Double.parseDouble(editTextHt.getText().toString())).execute();
            takeOffBox.setVisibility(RelativeLayout.INVISIBLE);
        }
    };
    private View.OnClickListener buttonLandListener = new View.OnClickListener() {

        @Override
        public void onClick(View v) {
            new LandRequest().execute();
        }
    };

    private void rosInitialize() {

        ros = new Ros("ws://" + IP + "/websocket");
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

                    latitude = message.getDouble("latitude") - latOffset;
                    longitude = message.getDouble("longitude") - longOffset;
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

    /**
     * Manipulates the map once available.
     * This callback is triggered when the map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    private void updateMap() {
        if (dronePoints.size() == 0 & startStoring < 5) {
            startStoring++;
        } else if (dronePoints.size() == 0 & startStoring == 5) {
            LatLng latLng1 = new LatLng(latitude, longitude);
            dronePoints.add(latLng1);
            redrawLine();
            startStoring++;
        } else if (startStoring > 5 & dronePoints.get(dronePoints.size() - 1).latitude != latitude & dronePoints.get(dronePoints.size() - 1).longitude != longitude) {
            if (mDroneLocationMarker != null) {
                mDroneLocationMarker.remove();

            }
//            Log.d("GPS", latitude + " " + longitude);
            LatLng latLng1 = new LatLng(latitude, longitude);
            dronePoints.add(latLng1);
            redrawLine();
        }
        textViewSat.setText("Sat: " + satellites);


//        LocationManager locationManager = (LocationManager)
//                getSystemService(LOCATION_SERVICE);
//        Criteria criteria = new Criteria();
//
//        if (ActivityCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
//            // TODO: Consider calling
//            return;
//        }
//        Location location = locationManager.getLastKnownLocation(locationManager.GPS_PROVIDER);//getBestProvider(criteria, false));
//        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, new android.location.LocationListener() {
//            @Override
//            public void onLocationChanged(Location location) {
//                Log.d("dddddddddd",location.getLatitude()+" "+location.getLongitude());
//            }
//
//            @Override
//            public void onStatusChanged(String provider, int status, Bundle extras) {
//
//            }
//
//            @Override
//            public void onProviderEnabled(String provider) {
//
//            }
//
//            @Override
//            public void onProviderDisabled(String provider) {
//
//            }
//        });
//        Log.d("dddddddddd",location.getLatitude()+" "+location.getLongitude());
//        mLastLocation = location;
////        Log.d("gps accuracy",location.getAccuracy()+" "+startFollow);
////        Toast.makeText(getApplicationContext(), location.getLatitude()+" "+location.getLongitude() +" "+location.getAccuracy()+" "+startFollow,Toast.LENGTH_LONG).show();
//
//        if(location.getAccuracy()<10.00 & startFollow ){
//            new setGlobalPositionRequest(location.getLatitude(),location.getLongitude(),Double.parseDouble(editTextHt.getText().toString())).execute();
//        }

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

    private void updateAlt() {

        textViewAlt.setText("Alt: " + String.format("%.2f", altitude * -1)+" m");
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
                            updateAlt();
                            updateMap();
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

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setMapType(GoogleMap.MAP_TYPE_NORMAL);

        //Initialize Google Play Services
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                buildGoogleApiClient();
                mMap.setMyLocationEnabled(true);
            }
        } else {
            buildGoogleApiClient();
            mMap.setMyLocationEnabled(true);
        }

////
//        LatLng sydney = new LatLng(-34, 151);
//        mMap.addMarker(new MarkerOptions().position(sydney).title("Marker in Sydney"));
//        mMap.moveCamera(CameraUpdateFactory.newLatLng(sydney));
        // Add a marker in Sydney and move the camera
    }

    protected synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        mGoogleApiClient.connect();
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        mLocationRequest = new LocationRequest();
        mLocationRequest.setInterval(1000);
//        mLocationRequest.setFastestInterval(1000);
        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, (com.google.android.gms.location.LocationListener) this);
        }
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    @Override
    public void onLocationChanged(Location location) {
        mLastLocation = location;
//        if (mCurrLocationMarker != null) {
//            mCurrLocationMarker.remove();
//        }

        //Place current location marker
        LatLng latLng = new LatLng(location.getLatitude(), location.getLongitude());
//        devicePoints.add(latLng);
//        redrawLine();
//        Toast.makeText(getApplicationContext(), location.getLatitude()+" "+location.getLongitude(),Toast.LENGTH_LONG).show();
//        Log.d("gps accuracy",location.getAccuracy()+" "+startFollow);
//        if(location.getAccuracy()<10.00 & startFollow){
//            new setGlobalPositionRequest(location.getLatitude(),location.getLongitude(),Double.parseDouble(editTextHt.getText().toString())).execute();
//        }

        //move map camera
        mMap.moveCamera(CameraUpdateFactory.newLatLng(latLng));
        mMap.animateCamera(CameraUpdateFactory.zoomTo(15));

        //stop location updates
        if (mGoogleApiClient != null) {
            LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
        }
    }

    private void redrawLine() {

        mMap.clear();  //clears all Markers and Polylines

        PolylineOptions optionsDrone = new PolylineOptions().width(5).color(Color.BLUE).geodesic(true);
        optionsDrone.addAll(dronePoints);
        if (dronePoints.size() > 1) {
            mMap.addPolyline(optionsDrone); //add Polyline

            MarkerOptions markerOptions1 = new MarkerOptions();
            markerOptions1.position(dronePoints.get(dronePoints.size() - 1));
            markerOptions1.title("Drone Position");
            markerOptions1.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));
            mDroneLocationMarker = mMap.addMarker(markerOptions1);
        }

//        PolylineOptions optionsDevice = new PolylineOptions().width(5).color(Color.RED).geodesic(true);
//        optionsDevice.addAll(devicePoints);
//        if(devicePoints.size()>1) {
//            mMap.addPolyline(optionsDevice); //add Polyline
//
//            MarkerOptions markerOptions = new MarkerOptions();
//            markerOptions.position(devicePoints.get(devicePoints.size()-1));
//            markerOptions.title("Current Position");
//            markerOptions.icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_RED));
//            mCurrLocationMarker = mMap.addMarker(markerOptions);
//        }
    }

    public static final int MY_PERMISSIONS_REQUEST_LOCATION = 99;

    public boolean checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {

            // Asking user if explanation is needed
            if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ACCESS_FINE_LOCATION)) {

                // Show an expanation to the user *asynchronously* -- don't block
                // this thread waiting for the user's response! After the user
                // sees the explanation, try again to request the permission.

                //Prompt the user once explanation has been shown
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, MY_PERMISSIONS_REQUEST_LOCATION);


            } else {
                // No explanation needed, we can request the permission.
                ActivityCompat.requestPermissions(this,
                        new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, MY_PERMISSIONS_REQUEST_LOCATION);
            }
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode,
                                           String permissions[], int[] grantResults) {
        switch (requestCode) {
            case MY_PERMISSIONS_REQUEST_LOCATION: {
                // If request is cancelled, the result arrays are empty.
                if (grantResults.length > 0
                        && grantResults[0] == PackageManager.PERMISSION_GRANTED) {

                    // Permission was granted.
                    if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
                            == PackageManager.PERMISSION_GRANTED) {

//                        if (mGoogleApiClient == null) {
//                            buildGoogleApiClient();
//                        }
                        mMap.setMyLocationEnabled(true);

                    }

                } else {

                    // Permission denied, Disable the functionality that depends on this permission.
                    Toast.makeText(this, "permission denied", Toast.LENGTH_LONG).show();
                }
                return;
            }

            // other 'case' lines to check for other permissions this app might request.
            //You can add here other case statements according to your requirement.
        }
    }

    /**
     * ATTENTION: This was auto-generated to implement the App Indexing API.
     * See https://g.co/AppIndexing/AndroidStudio for more information.
     */
    public Action getIndexApiAction() {
        Thing object = new Thing.Builder()
                .setName("Maps Page") // TODO: Define a title for the content shown.
                // TODO: Make sure this auto-generated URL is correct.
                .setUrl(Uri.parse("http://[ENTER-YOUR-URL-HERE]"))
                .build();
        return new Action.Builder(Action.TYPE_VIEW)
                .setObject(object)
                .setActionStatus(Action.STATUS_TYPE_COMPLETED)
                .build();
    }

    @Override
    public void onStart() {
        super.onStart();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        try{
            client.connect();
            AppIndex.AppIndexApi.start(client, getIndexApiAction());
        }catch(Exception e){}
    }

    @Override
    public void onStop() {
        super.onStop();

        // ATTENTION: This was auto-generated to implement the App Indexing API.
        // See https://g.co/AppIndexing/AndroidStudio for more information.
        try {
            AppIndex.AppIndexApi.end(client, getIndexApiAction());

            client.disconnect();
        }catch(Exception e){}
    }

    private class TakeoffRequest extends AsyncTask<Void, Void, String> {
        private Double takeoff_alt;

        public TakeoffRequest(Double val) {
            takeoff_alt = val;
        }

        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://" + IP + "/ros/" + namespace + "/navigation/take_off";
                //params in json
                JSONObject data = new JSONObject();
                data.put("takeoff_alt", takeoff_alt);

                String requestJson = data.toString();
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
            } catch (Exception |IOError e) {
//                Log.e("Takeoff error", e.getMessage(), e);
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
                    if (resp.getBoolean("success")) {
                        Toast.makeText(getApplicationContext(), "Taking Off.", Toast.LENGTH_SHORT).show();

                    } else {
                        Toast.makeText(getApplicationContext(), "Take Off rejected.", Toast.LENGTH_SHORT).show();
                    }

                } catch (JSONException | NullPointerException e) {
                }


            } else {
                Toast.makeText(getApplicationContext(), "Failed to contact FlytPOD. Retry Take Off!", Toast.LENGTH_SHORT).show();

            }
        }

    }

    private class LandRequest extends AsyncTask<Void, Void, String> {

        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://" + IP + "/ros/" + namespace + "/navigation/land";
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
            } catch (Exception |IOError e) {
//                Log.e("Takeoff error", e.getMessage(), e);
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
                    if (resp.getBoolean("success")) {
                        Toast.makeText(getApplicationContext(), "Landing", Toast.LENGTH_SHORT).show();

                    } else {
                        Toast.makeText(getApplicationContext(), "Land rejected.", Toast.LENGTH_SHORT).show();
                    }

                } catch (JSONException | NullPointerException e) {
                }


            } else {
                Toast.makeText(getApplicationContext(), "Failed to contact FlytPOD. Retry Land!", Toast.LENGTH_SHORT).show();

            }
        }

    }


    private class setGlobalPositionRequest extends AsyncTask<Void, Void, String> {
        private Double lat, lon, alt;

        public setGlobalPositionRequest(Double param1, Double param2, Double param3) {
            lat = param1 + latOffset;
            lon = param2 + longOffset;
            alt = param3;
        }

        @Override
        protected String doInBackground(Void... params) {
            try {
                //Rest url
                final String url = "http://" + IP + "/ros/" + namespace + "/navigation/position_set_global";
                //params in json
                JSONObject data = new JSONObject();
                JSONObject temp = new JSONObject(), temp1 = new JSONObject();
                temp1.put("x", lat);
                temp1.put("y", lon);
                temp1.put("z", alt);
                temp.put("linear", temp1);
                temp1 = new JSONObject();
                temp1.put("z", 0.0);
                temp.put("angular", temp1);
                temp1 = new JSONObject();
                temp1.put("twist", temp);
                data.put("twist", temp1);
                data.put("yaw_valid", false);
                data.put("async", true);
                Log.d("data", data.toString());

                String requestJson = data.toString();
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
            } catch (Exception |IOError e) {
//                Log.e("global setpoint error", e.getMessage(), e);
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
                    if (resp.getBoolean("success")) {
                        Toast.makeText(getApplicationContext(), "Following", Toast.LENGTH_SHORT).show();

                    } else {
                        Toast.makeText(getApplicationContext(), "Follow rejected.", Toast.LENGTH_SHORT).show();
                    }

                } catch (JSONException | NullPointerException e) {
                }

            } else {
                Toast.makeText(getApplicationContext(), "Failed to contact FlytPOD. Retry Follow!", Toast.LENGTH_SHORT).show();

            }
        }

    }
}
