package com.instagram.common.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@Slf4j
public class FileUploadService {

    @Value("${file.profile.upload.path}")
    private String profileFileUploadPath;
    @Value("${file.story.upload.path}")
    private String storyFileUploadPath;
    @Value("${file.post.upload.path}")
    private String postFileUploadPath;

    /**
     * 프로필 이미지 업로드
     *
     * @param file 업로드할 이미지 파일
     * @return 저장된 파일 경로(DB에 저장할 상대 경로)
     * @throws IOException 파일처리중 오류 발생시 예외 처리
     */
    public String uploadProfileImage(MultipartFile file) throws IOException {
        isExists(file);

        File profileUploadDir = new File(profileFileUploadPath);
        makeDirectory(profileUploadDir);

        String extension = getExtensionName(file);
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        Path filePath = Paths.get(profileFileUploadPath, uniqueFileName);
        makeFile(file, filePath);

        return "/profile_images/" + uniqueFileName;
    }


    /**
     * 스토리 이미지 업로드
     *
     * @param file      업로드할 상품 이미지 파일
     * @param storyId   스토리 업로드 시 스토리 아이디
     * @param imageType main, detail_1 등
     * @return 저장된 파일의 경로(DB에 저장할 상대 경로)
     * @throws IOException 파일 처리 중 오류 발생시 예외 처리
     *                     // 가져온 파일 임시저장 폴더 같은 곳에 파일 보관해두기
     */
    public String uploadStoryImage(MultipartFile file, int storyId, String imageType) throws IOException {
        isExists(file);
        String storyFolder = storyFileUploadPath + "/" + storyId;

        File storyUploadDir = new File(storyFolder);
        makeDirectory(storyUploadDir);

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) throw new IOException("파일 이름이 유효하지 않습니다.");

        String fileName = imageType + "-" + originalFilename;
        Path filePath = Paths.get(storyFolder, fileName);
        makeFile(file, filePath);

        return "/story_images/" + storyId + "/" + fileName;
    }

    public String uploadPostImage(MultipartFile file) throws IOException {
        isExists(file);
        File postUploadDir = new File(postFileUploadPath);
        makeDirectory(postUploadDir);

        String extension = getExtensionName(file);
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        Path filePath = Paths.get(postFileUploadPath, uniqueFileName);
        makeFile(file, filePath);

        return "/post_images/" + uniqueFileName;
    }


    /**
     * 파일 삭제
     *
     * @param dbFilePath DB에 저장된 경로와 파일 명칭
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String dbFilePath) {
        if (dbFilePath == null || dbFilePath.isEmpty()) {
            log.warn("파일 경로 미존재");
            return false;
        }

        try {
            String absolutePath = "";

            if (dbFilePath.startsWith("/profile_images/")) {
                String profileImagePath = dbFilePath.replace("/profile_images/", "");
                absolutePath = profileFileUploadPath + "/" + profileImagePath;
            } else if (dbFilePath.startsWith("/story_images/")) {
                String storyImagePath = dbFilePath.replace("/story_images/", "");
                absolutePath = storyFileUploadPath + "/" + storyImagePath;
            } else if (dbFilePath.startsWith("/post_images/")) {
                String postImagePath = dbFilePath.replace("/post_images/", "");
                absolutePath = postFileUploadPath + "/" + postImagePath;
            } else {
                log.warn("지원하지 않는 파일 경로 형식{}", dbFilePath);
            }

            File file = new File(absolutePath);

            if (!file.exists()) {
                log.warn("삭제파일 미존재:{}", absolutePath);
                return false;
            }

            boolean isDeleteFile = file.delete();

            if (isDeleteFile) {
                log.info("파일 삭제 완료:{}", absolutePath);
            } else {
                log.error("파일 삭제 실패: {}", absolutePath);
            }
            return isDeleteFile;
        } catch (Exception e) {
            log.error("파일 삭제 중 오류: {}", e.getMessage());
            return false;
        }
    }
    // 폴더를 명령어나 서버에서 삭제할 때 순서가 있다.
    // 폴더 안에 파일이 존재하면 파일을 우선적으로 삭제한 다음에 폴더 삭제가 이루어짐
    // 폴더 내부에 파일이 존재하면 폴더만 삭제한다는 개념이 아님
    // 비어있는 상품 폴더 삭제
    // 여러 파일 한 번에 삭제

    /**
     * 파일이 비어있는지 확인
     *
     * @param file 파일
     * @throws IOException
     */
    private void isExists(MultipartFile file) throws IOException {
        if (file.isEmpty() || file == null) throw new IOException("업로드할 파일이 없습니다.");
    }

    /**
     * 폴더가 없다면 폴더 생성
     *
     * @param uploadDir 폴더 경로
     * @throws IOException
     */
    private void makeDirectory(File uploadDir) throws IOException {
        if (!uploadDir.exists()) {
            boolean created = uploadDir.mkdirs();
            if (!created) throw new IOException("디렉토리 생성에 실패");
            log.info("업로드 디렉토리 생성 ");
        }
    }

    /**
     * 파일 생성
     *
     * @param file     생성할 파일
     * @param filePath 생성한 경로
     */
    private void makeFile(MultipartFile file, Path filePath) {
        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            log.info("이미지 업로드 성공");
        } catch (Exception e) {
            log.error("이미지 저장 중 오류 발생 : {}", e.getMessage());
        }
    }

    private String getExtensionName(MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        if (originalFileName == null || originalFileName.isEmpty()) {
            return "";
        }

        String extension = "";
        int lastDotIndex = originalFileName.lastIndexOf('.');
        if (lastDotIndex > 0) {
            return extension = originalFileName.substring(lastDotIndex);
        }
        return "";
    }
}
