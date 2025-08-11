package com.tcs.dhv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaAuditing
@EnableCaching
@SpringBootApplication
public class DhvApplication {

	public static void main(String[] args) {
		SpringApplication.run(DhvApplication.class, args);
	}

}
