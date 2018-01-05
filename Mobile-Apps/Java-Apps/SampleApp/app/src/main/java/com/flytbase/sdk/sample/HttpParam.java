package com.flytbase.sdk.sample;

import org.json.JSONObject;

/**
 * Created by jenish on 26/12/17.
 */

public class HttpParam {

    private String url;
    private JSONObject params ;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public JSONObject getParams() {
        return params;
    }

    public void setParams(JSONObject params) {
        this.params = params;
    }
}