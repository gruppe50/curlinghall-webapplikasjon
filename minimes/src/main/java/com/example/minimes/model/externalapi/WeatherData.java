package com.example.minimes.model.externalapi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown=true)
public class WeatherData {
    private String time;
    private Double airTemperature;

    public WeatherData() {};

    public WeatherData(String time, Double airTemperature) {
       this.time = time;
       this.airTemperature = airTemperature;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public Double getAirTemperature() {
        return airTemperature;
    }

    public void setAirTemperature(Double airTemperature) {
        this.airTemperature = airTemperature;
    }
}
