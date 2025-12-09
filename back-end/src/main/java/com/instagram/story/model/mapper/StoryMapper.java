package com.instagram.story.model.mapper;

import com.instagram.story.model.dto.Story;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface StoryMapper {
    List<Story> selectAllStories();

    Story selectStoriesByUserId(int userId);

    void insertStory(Story story);

    void updateStoryImage(int storyId, String storyImage);

}
