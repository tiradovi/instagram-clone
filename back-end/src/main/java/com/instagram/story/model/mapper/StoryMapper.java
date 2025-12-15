package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    List<Story> selectAllStories();

    List<Story> selectStoriesByUserId(int userId);

    Story selectStoryByStoryId(int storyId);

    void insertStory(Story story);

    void updateStoryImage(int storyId, String storyImage);

    void deleteStory(int userId, int storyId);

}
