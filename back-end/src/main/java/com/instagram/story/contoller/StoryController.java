package com.instagram.story.contoller;


import com.instagram.common.util.JwtUtil;
import com.instagram.story.model.dto.Story;
import com.instagram.story.model.service.StoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stories")
public class StoryController {
    private final StoryService storyService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> createStory(@RequestHeader("Authorization") String authHeader,
                                         @RequestPart("storyImage") MultipartFile storyImage) {
        try {
            String jwtToken = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(jwtToken);

            Story story = storyService.createStory(currentUserId, storyImage);

            Map<String, Object> map = new HashMap<>();
            map.put("story", story);
            map.put("msg", "스토리가 성공적으로 생성 완료");
            return ResponseEntity.ok(map);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body("파일 업로드 실패 :" + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 생성 실패 :" + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllStories() {
        try {
            List<Story> Stories = storyService.getAllStories();
            return ResponseEntity.ok(Stories);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 조회 실패: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getStory(@PathVariable("userId") int userId) {
        try {
            List<Story> story = storyService.getStoriesByUserId(userId);
            return ResponseEntity.ok(story);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 조회 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/{storyId}")
    public ResponseEntity<?> deleteStory(@RequestHeader("Authorization") String authHeader,
                                         @PathVariable("storyId") int storyId) {
        try {
            String jwtToken = authHeader.substring(7);
            int currentUserId = jwtUtil.getUserIdFromToken(jwtToken);

            storyService.deleteStory(currentUserId, storyId);

            return ResponseEntity.ok().body(true);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("스토리 삭제 실패 :" + e.getMessage());
        }
    }

}
