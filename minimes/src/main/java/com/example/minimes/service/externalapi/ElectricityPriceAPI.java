package com.example.minimes.service.externalapi;

import com.example.minimes.model.externalapi.PowerPrice;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

@Service
public class ElectricityPriceAPI {

    private final WebClient webClient;

    public ElectricityPriceAPI(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl
                ("https://www.hvakosterstrommen.no/api/v1/prices/").build();
    }

    public List<PowerPrice> getElectricityPrices(String from, String to) {

        // Format of from / to: "2024-04-10T12:00:00"

        LocalDateTime fromDateTime= LocalDateTime.parse(from);
        LocalDateTime toDateTime = LocalDateTime.parse(to);
        // Extract only the dates
        LocalDate fromDate = fromDateTime.toLocalDate();
        LocalDate toDate = toDateTime.toLocalDate();

        String fromYear = String.format("%04d", fromDate.getYear());
        String fromMonth = String.format("%02d", fromDate.getMonthValue());
        String fromDay = String.format("%02d", fromDate.getDayOfMonth());


        List<PowerPrice> powerPrices = this.webClient.get().uri(fromYear + "/" + fromMonth + "-" + fromDay + "_NO5.json")
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<List<PowerPrice>>() {})
                .block();

        assert powerPrices != null;

        if(fromDate.equals(toDate)) {
            return  powerPrices.subList(fromDateTime.getHour(), toDateTime.getHour() + 1);
        }

        // Keep powerprices from the fromHour until end of the first day.
        powerPrices = powerPrices.subList(fromDateTime.getHour(), powerPrices.size());

        // Add prices for the following days to the powerPrices list.
        // On the last day, only add until toHour

        while(!fromDate.equals(toDate)) {
            fromDate = fromDate.plusDays(1);
            // Fetch prices for the next day
            fromYear = String.format("%02d", fromDate.getYear());
            fromMonth = String.format("%02d", fromDate.getMonthValue());
            fromDay = String.format("%02d", fromDate.getDayOfMonth());

            List<PowerPrice> nextDayPowerPrices = this.webClient.get().uri(fromYear + "/" + fromMonth + "-" + fromDay + "_NO5.json")
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<PowerPrice>>() {})
                    .block();
            assert nextDayPowerPrices != null;

            // If we are on the last day, consider the "toHour",
            // if not just add all prices of the day.
            if(fromDate.equals(toDate)) {
                powerPrices.addAll(nextDayPowerPrices.subList(0,toDateTime.getHour() + 1));
            } else {
                powerPrices.addAll(nextDayPowerPrices);
            }
        }

        return powerPrices;

    }
}
