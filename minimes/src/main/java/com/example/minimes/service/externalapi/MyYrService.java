package com.example.minimes.service.externalapi;

import com.example.minimes.model.externalapi.WeatherData;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Collections;
import java.util.List;

@Service
public class MyYrService {

    private final WebClient webClient;

    public MyYrService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl
                ("https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.888&lon=10.620").build();
    }

    public List<WeatherData> someRestCall() {
        String jsonString =  this.webClient.get()
                .uri("")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        if(jsonString != null) {

            // System.out.println("jsonstring: " + jsonString);
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode rootNode = objectMapper.readTree(jsonString);
                JsonNode propertiesNode = rootNode.get("properties");
                JsonNode timeSeriesNode = propertiesNode.get("timeseries");

                System.out.println("timeSeriesNode: " + timeSeriesNode);
                if (timeSeriesNode != null && timeSeriesNode.isArray()) {
                    return objectMapper.convertValue(timeSeriesNode, new TypeReference<List<WeatherData>>() {});
                }
            } catch (Exception e) {
                System.out.println("Error: " + e);
            }


        }
        return Collections.emptyList();

    }


}