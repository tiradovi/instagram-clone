package com.instagram.story.model.service;

import com.instagram.common.util.FileUploadService;
import com.instagram.story.model.dto.Story;
import com.instagram.story.model.mapper.StoryMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class StoryServiceImpl implements StoryService {
    private final StoryMapper storyMapper;
    private final FileUploadService fileUploadService;

    @Override
    public List<Story> getAllStories() {
        log.info("모든 활성 스토리 조회");
        List<Story> stories = storyMapper.selectAllStories();
        log.info("조회된 스토리 개수 : {}", stories.size());
        return stories;
    }

    @Override
    public Story getStoriesByUserId(int userId) {
        log.info("특정 사용자 스토리 조회 - 사용자 ID: {}", userId);
        Story story = storyMapper.selectStoriesByUserId(userId);
        return story;
    }

    @Override
    public Story createStory(int currentUserId, MultipartFile storyImage) throws IOException {
        try {
            log.info("스토리 생성 시작 - 사용자 ID:{}", currentUserId);

            Story story = new Story();
            story.setUserId(currentUserId);
            story.setStoryImage("");
            storyMapper.insertStory(story);

            String imageUrl = fileUploadService.uploadStoryImage(storyImage, story.getStoryId(), "story");

            storyMapper.updateStoryImage(story.getStoryId(), imageUrl);

            log.error("임시 스토리 생성 완료 - 스토리 ID : {} ", story.getStoryId());
            return story;
        } catch (Exception e) {
            log.error("스토리 작성 실패 : ", e);
            return null;
        }
    }

    @Override
    public void deleteExpiredStories() {

    }
}
