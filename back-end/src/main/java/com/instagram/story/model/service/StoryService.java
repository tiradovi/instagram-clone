package com.instagram.story.model.service;

import com.instagram.story.model.dto.Story;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface StoryService {

    List<Story> getAllStories();

    List<Story> getStoriesByUserId(int userId);

    Story createStory(int currentUserId, MultipartFile storyImage) throws IOException;

    void deleteExpiredStories();

    void deleteStory(int currentUserId, int storyId);
}
