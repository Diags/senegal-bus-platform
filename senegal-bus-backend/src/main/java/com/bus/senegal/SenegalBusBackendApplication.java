package com.bus.senegal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SenegalBusBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SenegalBusBackendApplication.class, args);
	}

}
