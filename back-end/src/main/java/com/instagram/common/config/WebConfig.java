package com.instagram.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;


@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.upload.path}")
    private String fileUploadPath;
    @Value("${file.product.upload.path}")
    private String productFileUploadPath;
    @Value("${file.board.upload.path}")
    private String boardFileUploadPath;

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:57007", "http://localhost:3000")
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*");

                registry.addMapping("/ws/**")
                        .allowedOrigins("http://localhost:57007", "http://localhost:3000")
                        .allowCredentials(true)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {

        registry.addResourceHandler("/profile_images/**").addResourceLocations("file:" + fileUploadPath + "/");

        registry.addResourceHandler("/product_images/**").addResourceLocations("file:" + productFileUploadPath + "/");

        registry.addResourceHandler("/board_images/**").addResourceLocations("file:" + boardFileUploadPath + "/");


    }
}
