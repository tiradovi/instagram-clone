## 프로젝트 구조 설명 ([README.md](http://readme.md/))

### 개요

본 문서는 `src/main/java/com/instagram/` 디렉토리와 `src/main/resources/mapper/` 디렉토리의 **Instagram 클론 프로젝트** 백엔드 주요 모듈 및 파일 구조에 대한 설명을 담고 있습니다. 프로젝트는 Java와 Spring Boot 기반으로 구성되었으며, 주요 기능별로 모듈화하여 관리하고 있습니다.

### 주요 디렉토리 구조

```
src/main/java/com/instagram/
├── user/          # 사용자 (회원가입, 로그인, 프로필)
├── post/          # 게시물
├── comment/       # 댓글
├── like/          # 좋아요
├── story/         # 스토리
├── follow/        # 팔로우
└── common/        # 공통 설정 및 유틸리티

src/main/resources/mapper/
├── UserMapper.xml
├── PostMapper.xml
├── CommentMapper.xml
├── LikeMapper.xml
├── StoryMapper.xml
└── FollowMapper.xml
```

---

### 모듈별 상세 설명

### 1. `user/` (사용자)

사용자(User)의 **회원가입, 로그인, 프로필 관리**와 관련된 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `User.java` | 사용자 **Entity/Domain** 클래스 |
| `UserMapper.java` | 사용자 관련 **MyBatis Mapper** 인터페이스 |
| `UserService.java` | 사용자 관련 **Service** 인터페이스 |
| `UserServiceImpl.java` | `UserService`의 **구현체** (비즈니스 로직) |
| `UserController.java` | 사용자 관련 **Controller** (API 엔드포인트) |


### 2. `post/` (게시물)

**게시물(Post) 생성, 조회, 수정, 삭제**와 관련된 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `Post.java` | 게시물 **Entity/Domain** 클래스 |
| `PostMapper.java` | 게시물 관련 **MyBatis Mapper** 인터페이스 |
| `PostService.java` | 게시물 관련 **Service** 인터페이스 |
| `PostServiceImpl.java` | `PostService`의 **구현체** (비즈니스 로직) |
| `PostController.java` | 게시물 관련 **Controller** (API 엔드포인트) |

### 3. `comment/` (댓글)

게시물에 대한 **댓글(Comment) 관련** 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `Comment.java` | 댓글 **Entity/Domain** 클래스 |
| `CommentMapper.java` | 댓글 관련 **MyBatis Mapper** 인터페이스 |
| `CommentService.java` | 댓글 관련 **Service** 인터페이스 |
| `CommentServiceImpl.java` | `CommentService`의 **구현체** (비즈니스 로직) |
| `CommentController.java` | 댓글 관련 **Controller** (API 엔드포인트) |

### 4. `like/` (좋아요)

게시물이나 댓글에 대한 **좋아요(Like)** 관련 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `Like.java` | 좋아요 **Entity/Domain** 클래스 |
| `LikeMapper.java` | 좋아요 관련 **MyBatis Mapper** 인터페이스 |
| `LikeService.java` | 좋아요 관련 **Service** 인터페이스 |
| `LikeServiceImpl.java` | `LikeService`의 **구현체** (비즈니스 로직) |
| `LikeController.java` | 좋아요 관련 **Controller** (API 엔드포인트) |

### 5. `story/` (스토리)

**스토리(Story)** 기능 관련 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `Story.java` | 스토리 **Entity/Domain** 클래스 |
| `StoryMapper.java` | 스토리 관련 **MyBatis Mapper** 인터페이스 |
| `StoryService.java` | 스토리 관련 **Service** 인터페이스 |
| `StoryServiceImpl.java` | `StoryService`의 **구현체** (비즈니스 로직) |
| `StoryController.java` | 스토리 관련 **Controller** (API 엔드포인트) |

### 6. `follow/` (팔로우)

**사용자 간의 팔로우(Follow)** 관계 관리 로직을 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `Follow.java` | 팔로우 **Entity/Domain** 클래스 |
| `FollowMapper.java` | 팔로우 관련 **MyBatis Mapper** 인터페이스 |
| `FollowService.java` | 팔로우 관련 **Service** 인터페이스 |
| `FollowServiceImpl.java` | `FollowService`의 **구현체** (비즈니스 로직) |
| `FollowController.java` | 팔로우 관련 **Controller** (API 엔드포인트) |

### 7. `common/` (공통)

**전역 설정, 공통 유틸리티, API 응답 형식** 등 공통 요소를 담당합니다.

| 파일/디렉토리 | 역할 |
| --- | --- |
| `config/WebConfig.java` | Spring MVC **웹 설정** (CORS 등) |
| `config/SecurityConfig.java` | Spring Security **보안 설정** (인증, 권한) |
| `dto/ApiResponse.java` | 모든 API 응답의 **표준 형식** DTO |

---

### MyBatis 매퍼 파일

`src/main/resources/mappers/` 디렉토리에는 각 모듈별 **SQL 매핑 정보**를 담고 있는 XML 파일들이 위치합니다.

| 파일 | 역할 |
| --- | --- |
| `UserMapper.xml` | 사용자(User) 관련 **SQL 정의** |
| `PostMapper.xml` | 게시물(Post) 관련 **SQL 정의** |
| `CommentMapper.xml` | 댓글(Comment) 관련 **SQL 정의** |
| `LikeMapper.xml` | 좋아요(Like) 관련 **SQL 정의** |
| `StoryMapper.xml` | 스토리(Story) 관련 **SQL 정의** |
| `FollowMapper.xml` | 팔로우(Follow) 관련 **SQL 정의** |

---
# 트러블 슈팅

# 📌 Story ID 직접 삽입으로 인한 INSERT 오류

## 문제점

MyBatis에서 stories 테이블에 데이터 INSERT시 useGeneratedKeys로 PK가 정상적으로 매핑되지 않는 문제가 발생했습니다.
````
Duplicate entry '0' for key 'PRIMARY'
````

## 원인
INSERT 구문에서 자동 증가(primary key)로 관리되는 story_id를 직접 넣고 있었습니다.

```xml
<insert id="insertStory" parameterType="Story" useGeneratedKeys="true" keyProperty="storyId" keyColumn="story_id">
    INSERT INTO stories(story_id, user_id, story_image, created_at, expires_at)
    VALUES (#{storyId}, #{userId}, #{storyImage}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours');
</insert>
```
## 문제 발생 이유
story_id는 AUTO_INCREMENT / SERIAL / IDENTITY로 자동 생성해야 합니다.
하지만 개발자가 직접 값을 넣을 경우 INT값이므로 0이 들어가고 이미 존재하는 ID를 넣으면 PRIMARY KEY 충돌 하여 MyBatis의 useGeneratedKeys가 작동하지 않음
즉, PK를 수동 입력해 자동 증가 로직이 깨지는 문제가 발생했습니다.

## 변경 후 코드
```xml
<insert id="insertStory" parameterType="Story" useGeneratedKeys="true" keyProperty="storyId" keyColumn="story_id">
    INSERT INTO stories(user_id, story_image, created_at, expires_at)
    VALUES (#{userId}, #{storyImage}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours')
</insert>
```

## 결과
* Story 업로드 정상 동작
* 자동 PK 생성 기능 정상화
* MyBatis에서 storyId 값 자동 수신 성공

## 요약
자동 증가되어야 하는 story_id를 INSERT 시 직접 전달한 것이 문제의 원인이었습니다.
해당 필드를 제거해 DB 자동 생성 방식으로 되돌림으로써 PK 충돌 문제 해결 + useGeneratedKeys 정상 동작이 이루어졌습니다.
