package com.bloodline;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@SpringBootApplication
public class BloodlineApplication {
    public static void main(String[] args) {
        SpringApplication.run(BloodlineApplication.class, args);
    }

    @Configuration
    public static class JacksonConfig {
        @Bean
        public ObjectMapper objectMapper() {
            ObjectMapper mapper = new ObjectMapper();
            mapper.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
            return mapper;
        }
    }
}
