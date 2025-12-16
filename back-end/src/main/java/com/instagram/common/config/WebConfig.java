package com.instagram.common.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${file.profile.upload.path}")
    private String profileFileUploadPath;

    @Value("${file.story.upload.path}")
    private String storyFileUploadPath;

    @Value("${file.post.upload.path}")
    private String postFileUploadPath;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/profile_images/**")
                .addResourceLocations("file:" + profileFileUploadPath + "/");

        registry.addResourceHandler("/story_images/**")
                .addResourceLocations("file:" + storyFileUploadPath + "/");

        registry.addResourceHandler("/post_images/**")
                .addResourceLocations("file:" + postFileUploadPath + "/");
    }
}