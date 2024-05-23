package com.example.minimes.model;

public class StatusHall {

    private double bigLane_track_4_temp_end;
    private double bigLane_track_4_temp_mid;
    private double smallLane_track_1_temp_end;
    private double smallLane_track_1_temp_mid;
    private double hall_temp;
    private double hall_humidity;

    public StatusHall() {
    }



    public StatusHall(double bigLane_track_4_temp_end, double bigLane_track_4_temp_mid, double smallLane_track_1_temp_end, double smallLane_track_1_temp_mid, double hall_temp, double hall_humidity) {
        this.bigLane_track_4_temp_end = bigLane_track_4_temp_end;
        this.bigLane_track_4_temp_mid = bigLane_track_4_temp_mid;
        this.smallLane_track_1_temp_end = smallLane_track_1_temp_end;
        this.smallLane_track_1_temp_mid = smallLane_track_1_temp_mid;
        this.hall_temp = hall_temp;
        this.hall_humidity = hall_humidity;
    }

    public double getBigLane_track_4_temp_end() {
        return bigLane_track_4_temp_end;
    }

    public void setBigLane_track_4_temp_end(double bigLane_track_4_temp_end) {
        this.bigLane_track_4_temp_end = bigLane_track_4_temp_end;
    }

    public double getBigLane_track_4_temp_mid() {
        return bigLane_track_4_temp_mid;
    }

    public void setBigLane_track_4_temp_mid(double bigLane_track_4_temp_mid) {
        this.bigLane_track_4_temp_mid = bigLane_track_4_temp_mid;
    }

    public double getSmallLane_track_1_temp_end() {
        return smallLane_track_1_temp_end;
    }

    public void setSmallLane_track_1_temp_end(double smallLane_track_1_temp_end) {
        this.smallLane_track_1_temp_end = smallLane_track_1_temp_end;
    }

    public double getSmallLane_track_1_temp_mid() {
        return smallLane_track_1_temp_mid;
    }

    public void setSmallLane_track_1_temp_mid(double smallLane_track_1_temp_mid) {
        this.smallLane_track_1_temp_mid = smallLane_track_1_temp_mid;
    }

    public double getHall_temp() {
        return hall_temp;
    }

    public void setHall_temp(double hall_temp) {
        this.hall_temp = hall_temp;
    }

    public double getHall_humidity() {
        return hall_humidity;
    }

    public void setHall_humidity(double hall_humidity) {
        this.hall_humidity = hall_humidity;
    }
}
