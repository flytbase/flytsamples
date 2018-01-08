package com.flytbase.sdk.sample;

import android.os.AsyncTask;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

/**
 * Created by jenish on 26/12/17.
 */

public class HttpRequest extends AsyncTask<HttpParam, String, String> {

    private static final String UTF_8 = "UTF-8";
    IResponseHandler responseHandler;

    public interface IResponseHandler {
        void onResponse(String response);
    }

    public HttpRequest(IResponseHandler responseHandler) {
        this.responseHandler = responseHandler;
    }

    @Override
    protected String doInBackground(HttpParam... params) {
        HttpURLConnection urlConnection = null;
        HttpParam httpParam = params[0];
        StringBuilder response = new StringBuilder();
        try {

            URL url = new URL(httpParam.getUrl());
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("POST");
            urlConnection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            urlConnection.setRequestProperty("charset", "utf-8");
            urlConnection.setReadTimeout(10000 /* milliseconds */);
            urlConnection.setConnectTimeout(15000 /* milliseconds */);
           // Log.v("HttpRequest:","URL:"+httpParam.getUrl());
           // Log.v("HttpRequest:","Params:"+httpParam.getParams().toString());
            if (httpParam.getParams() != null) {
                OutputStream os = urlConnection.getOutputStream();
                BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(os, UTF_8));
                writer.append(httpParam.getParams().toString());
                writer.flush();
                writer.close();
                os.close();
            }
            int responseCode = urlConnection.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                String line;
                BufferedReader br = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                while ((line = br.readLine()) != null) {
                    response.append(line);
                }
            }
        } catch (UnsupportedEncodingException e) {
            e.printStackTrace();
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            urlConnection.disconnect();
        }
        return response.toString();
    }

    @Override
    protected void onPostExecute(String s) {
        super.onPostExecute(s);
        if (responseHandler != null) {
            responseHandler.onResponse(s);
        }
    }

}