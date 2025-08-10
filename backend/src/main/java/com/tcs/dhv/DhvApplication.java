package com.tcs.dhv;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@EnableJpaAuditing
@SpringBootApplication
public class DhvApplication {

	public static void main(final String[] args) {
		SpringApplication.run(DhvApplication.class, args);
	}

}
