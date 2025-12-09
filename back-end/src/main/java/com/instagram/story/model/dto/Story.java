package com.instagram.story.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Story {

    private int storyId;
    private int userId;
    private String storyImage;
    private String createdAt;
    private String expiresAt;

    // 조회시 추가 정보
    private String userName;
    private String userAvatar;
}
