package com.example.minimes.model.externalapi;

import java.util.List;

public class WeatherDataWrapper {
    private List<WeatherData> timeseries;

    public WeatherDataWrapper() {
    }

    public WeatherDataWrapper(List<WeatherData> timeseries) {
        this.timeseries = timeseries;
    }

    public List<WeatherData> getTimeseries() {
        return timeseries;
    }

    public void setTimeseries(List<WeatherData> timeseries) {
        this.timeseries = timeseries;
    }
}
