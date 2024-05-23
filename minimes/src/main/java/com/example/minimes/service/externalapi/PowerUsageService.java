package com.example.minimes.service.externalapi;

import com.example.minimes.model.experiment.PowerUsageDataDTO;
import com.example.minimes.model.externalapi.PowerPrice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class PowerUsageService {


    @Autowired
    ElectricityPriceAPI electricityPriceAPI;
    private final WebClient webClient;


    public PowerUsageService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl
                ("https://www.energinet.net/api/unitdata/")
                .defaultHeader("Authorization",
                        "Bearer " + System.getenv("PowerUsageTOKEN"))
                .build();
    }

    private List<PowerUsageDataDTO> compressor1(String from, String to) {
        return this.webClient.get()
                .uri("96220meter1")
                .header("DateIntervalFrom", from)
                .header("DateIntervalTo", to)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<PowerUsageDataDTO>>() {})
                .block();
    }

    private List<PowerUsageDataDTO> compressor2(String from, String to) {
        return this.webClient
                .get()
                .uri("96221meter1")
                .header("DateIntervalFrom", from)
                .header("DateIntervalTo", to)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<PowerUsageDataDTO>>() {})
                .block();
    }

    public List<PowerUsageDataDTO> getCompressorsPowerUsage(String from, String to) {

        List<PowerPrice> electricityPrices = electricityPriceAPI.getElectricityPrices(from, to);
        List<PowerUsageDataDTO> compressor1 = compressor1(from, to);
        List<PowerUsageDataDTO> compressor2 = compressor2(from, to);
        List<PowerUsageDataDTO> compressorTotal = new ArrayList<>();
        for(int i = 0; i  < compressor1.size(); i++) {
            PowerUsageDataDTO newPowerUsage = new PowerUsageDataDTO(compressor1.get(i), compressor2.get(i));
            newPowerUsage.setElectricityPrice(electricityPrices.get(i).getNokPerKwh());
            compressorTotal.add(newPowerUsage);
        }
        return compressorTotal;
    }
}
