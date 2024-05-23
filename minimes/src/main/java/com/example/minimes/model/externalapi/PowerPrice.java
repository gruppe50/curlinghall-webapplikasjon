package com.example.minimes.model.externalapi;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

@JsonIgnoreProperties(ignoreUnknown=true)
public class PowerPrice {

    @JsonProperty("NOK_per_kWh")

    private double nokPerKwh;
    @JsonProperty("EUR_per_kWh")

    private double eurPerKwh;
    @JsonProperty("EXR")

    private double exr;
    @JsonProperty("time_start")

    private String timeStart;
    @JsonProperty("time_end")

    private String timeEnd;


    public PowerPrice() {
    }

    public PowerPrice(double nokPerKwh, double eurPerKwh, double exr, String timeStart, String timeEnd) {
        this.nokPerKwh = nokPerKwh;
        this.eurPerKwh = eurPerKwh;
        this.exr = exr;
        this.timeStart = timeStart;
        this.timeEnd = timeEnd;
    }

    public double getNokPerKwh() {
        return nokPerKwh;
    }

    public void setNokPerKwh(double nokPerKwh) {
        this.nokPerKwh = nokPerKwh;
    }

    public double getEurPerKwh() {
        return eurPerKwh;
    }

    public void setEurPerKwh(double eurPerKwh) {
        this.eurPerKwh = eurPerKwh;
    }

    public double getExr() {
        return exr;
    }

    public void setExr(Double exr) {
        this.exr = exr;
    }

    public String getTimeStart() {
        return timeStart;
    }

    public void setTimeStart(String timeStart) {
        this.timeStart = timeStart;
    }

    public String getTimeEnd() {
        return timeEnd;
    }

    public void setTimeEnd(String timeEnd) {
        this.timeEnd = timeEnd;
    }


}
