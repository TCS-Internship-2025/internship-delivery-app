package com.tcs.dhv.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {
   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration corsConfiguration = new CorsConfiguration();
       corsConfiguration.setAllowedOrigins(List.of("http://localhost:3000"));
       corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
       corsConfiguration.setAllowedHeaders(List.of("*"));
       corsConfiguration.setAllowCredentials(true);
       corsConfiguration.setMaxAge(3600L);

       UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
       source.registerCorsConfiguration("/**", corsConfiguration);

       return source;
   }
}
