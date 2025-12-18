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

# 트러블 슈팅

# 📌 Story ID 직접 삽입으로 인한 INSERT 오류

## 문제점

MyBatis에서 stories 테이블에 데이터 INSERT 시 `useGeneratedKeys`로 PK가 정상적으로 매핑되지 않는 문제가 발생했습니다.

```
Duplicate entry '0' for key 'PRIMARY'
```

## 원인

INSERT 구문에서 자동 증가(primary key)로 관리되는 `story_id`를 직접 넣고 있었습니다.

```xml
<insert id="insertStory" parameterType="Story" useGeneratedKeys="true" keyProperty="storyId" keyColumn="story_id">
    INSERT INTO stories(story_id, user_id, story_image, created_at, expires_at)
    VALUES (#{storyId}, #{userId}, #{storyImage}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '24 hours');
</insert>
```

## 문제 발생 이유

`story_id`는 AUTO_INCREMENT / SERIAL / IDENTITY로 자동 생성되어야 합니다.
하지만 개발자가 직접 값을 넣을 경우 기본값(0)이 전달되거나 이미 존재하는 ID가 삽입되어
PRIMARY KEY 충돌이 발생했고, 이로 인해 MyBatis의 `useGeneratedKeys`가 정상 동작하지 않았습니다.

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
* MyBatis에서 `storyId` 값 자동 수신 성공

## 요약

자동 증가되어야 하는 `story_id`를 INSERT 시 직접 전달한 것이 문제의 원인이었습니다.
해당 필드를 제거하여 DB 자동 생성 방식으로 되돌림으로써 PK 충돌 문제와 키 매핑 오류를 해결했습니다.

---

# 📌 Invalid CORS request 오류 (Spring Security 설정 문제)

## 문제점

프론트엔드에서 백엔드 API 호출 시 다음 오류가 발생하며 요청이 차단되었습니다.

```
Invalid CORS request
```

## 원인

* Spring Security 환경에서 CORS 설정이 누락됨
* Preflight(OPTIONS) 요청이 인증 필터에 의해 차단됨
* 프론트엔드 Origin이 허용 목록에 없음

## 개선 내용

* Security Filter Chain에서 CORS 설정 명시
* 허용 Origin, Method, Header를 명확히 정의
* OPTIONS 요청 허용 처리

## 결과

* 프론트엔드 ↔ 백엔드 간 API 통신 정상화
* 인증/비인증 요청 모두 CORS 오류 제거
* 배포 환경에서도 동일한 설정 적용 가능

## 요약

CORS 오류를 단순 프론트 문제가 아닌 보안 필터 레벨에서 분석하여,
Spring Security 설정을 통해 근본적으로 해결했습니다.

---

# 📌 HTTPS 리다이렉트 및 포트 포워딩 설정 문제

## 문제점

HTTPS 요청을 처리하도록 설정했으나,
백엔드 애플리케이션이 정상적으로 요청을 받지 못하는 문제가 발생했습니다.

## 원인

* EC2에서 SSL 종료 후 내부 포트(9000)로 전달 구조 미정리
* iptables 리다이렉트 설정과 애플리케이션 포트 혼선

## 개선 내용

* EC2에서 443 → 9000 포트 리다이렉트 설정 정리
* 애플리케이션은 단일 포트로 요청 처리
* HTTPS 요청 흐름을 인프라 레벨에서 명확히 분리

## 결과

* HTTPS 요청 정상 처리
* 프론트엔드에서 HTTPS 기반 API 호출 가능
* 배포 환경 안정성 향상

## 요약

SSL 처리와 애플리케이션 포트를 명확히 분리하여,
HTTPS 환경에서도 백엔드 서버가 안정적으로 동작하도록 개선했습니다.

---

# 📌 RDS 연결 실패 (보안 그룹 설정 문제)

## 문제점

애플리케이션 실행 시 RDS 연결이 실패하며 다음 오류가 발생했습니다.

```
The connection attempt failed
```

## 원인

* RDS 보안 그룹 인바운드 규칙에 EC2 보안 그룹 미등록
* 동일한 보안 그룹 규칙이 중복되어 관리 혼선 발생

## 개선 내용

* RDS 보안 그룹에서 EC2 보안 그룹을 명확히 허용
* 중복 보안 그룹 규칙 정리
* 포트 및 접근 대상 명확화

## 결과

* 애플리케이션 ↔ RDS 정상 연결
* 배포 후 DB 접근 오류 제거
* 보안 그룹 관리 가독성 향상

## 요약

네트워크 오류를 애플리케이션 문제가 아닌 인프라 접근 제어 관점에서 분석하여,
보안 그룹 설정을 정리함으로써 DB 연결 문제를 해결했습니다.

---

# 📌 Spring MVC 정적 리소스 경로 오류

## 문제점

특정 API 호출 시 다음과 같은 오류가 발생했습니다.

```
No static resource auth/login
```

## 원인

* API 요청 경로가 Controller로 매핑되지 않음
* Spring이 해당 요청을 정적 리소스로 해석

## 개선 내용

* Controller의 RequestMapping 경로 재정의
* API 경로와 정적 리소스 경로 분리

## 결과

* 로그인 API 정상 동작
* 불필요한 정적 리소스 탐색 제거

## 요약

Spring MVC의 요청 처리 흐름을 기반으로 문제를 분석하여,
API 라우팅 오류를 구조적으로 해결했습니다.
---
