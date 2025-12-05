package com.instagram.common.util;

// 파일 이미지를 업로드 할 때, 변수이름을 상세히 작성하는 것이 좋음
// 프로필 이미지, 게시물 이미지,

// import lombok.Value // DB 관련

import org.springframework.beans.factory.annotation.Value; // 스프링부트 properties에 사용한 데이터
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/*
 폴더 구조화 방식
  /product_images
    /1001/       # 상품ID로 폴더 생성
        main.jpg     # 유저가 선택한 명칭 그대로 메인이미지
        detail_1.jpg # 상세이미지1
        detail_2.jpg # 상세이미지2
    /1002/       # 상품ID로 폴더 생성
        main.jpg     # 유저가 선택한 명칭 그대로 메인이미지
        detail_1.jpg # 상세이미지1
        detail_2.jpg # 상세이미지2

  파일명 규칙 방식
    /product_images
    /1001/       # 상품ID로 폴더 생성
        main.jpg     # 유저가 선택한 명칭 그대로 메인이미지
        detail_1.jpg # 상세이미지1
        detail_2.jpg # 상세이미지2

  UUID 사용 여부
    중소기업이나 내부 관리 시스템에서는 UUID를 안쓰는 경우가 많다.
       상품ID + 순번
       상품코드 + 타입
       업로드타임스탬프
    대규모 서비스(쿠팡,11번가 등)
       보안상 상품 정보 노출 방지 등의 경우 활용
 */
@Service
@Slf4j
public class FileUploadService {
    // import org.springframework.beans.factory.annotation.Value;
    @Value("${file.upload.path}")
    private String uploadPath;
    @Value("${file.product.upload.path}")
    private String productUploadPath;
    @Value("${file.board.upload.path}")
    private String boardFileUploadPath;

    /**
     * 프로필 이미지 업로드
     *
     * @param file 업로드할 이미지 파일
     * @return 저장된 파일 경로(DB에 저장할 상대 경로)
     * @throws IOException 파일처리중 오류 발생시 예외 처리
     */
    public String uploadProfileImage(MultipartFile file) throws IOException {
        isExists(file);

        File uploadDir = new File(uploadPath);
        makeDirectory(uploadDir);

        String extension = getExtensionName(file);
        String uniqueFileName = UUID.randomUUID().toString() + extension;

        Path filePath = Paths.get(uploadPath, uniqueFileName);
        makeFile(file, filePath);

        return "/profile_images/" + uniqueFileName;
    }


    /**
     * 상품 이미지 메인 이미지 업로드
     *
     * @param file      업로드할 상품 이미지 파일
     * @param productId 제품 업로드시 상품 id
     * @param imageType main, detail_1 등
     * @return 저장된 파일의 경로(DB에 저장할 상대 경로)
     * @throws IOException 파일 처리 중 오류 발생시 예외 처리
     *                     // 가져온 파일 임시저장 폴더 같은 곳에 파일 보관해두기
     */
    public String uploadProductImage(MultipartFile file, int productId, String imageType) throws IOException {
        isExists(file);
        String productFolder = productUploadPath + "/" + productId;

        File uploadDir = new File(productFolder);
        makeDirectory(uploadDir);

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) throw new IOException("파일 이름이 유효하지 않습니다.");

        String fileName = imageType + "-" + originalFilename;
        Path filePath = Paths.get(productFolder, fileName);
        makeFile(file, filePath);

        return "/product_images/" + productId + "/" + fileName;
    }


    /**
     * 게시물 이미지 이미지 업로드
     *
     * @param file      업로드할 게시물 이미지 파일
     * @param boardId   게시물 업로드시 게시물 id
     * @param imageType main, detail_1 등
     * @return 저장된 파일의 경로(DB에 저장할 상대 경로)
     * @throws IOException 파일 처리 중 오류 발생시 예외 처리
     *                     // 가져온 파일 임시저장 폴더 같은 곳에 파일 보관해두기
     */
    public String uploadBoardImage(MultipartFile file, int boardId, String imageType) throws IOException {
        isExists(file);
        String boardFolder = boardFileUploadPath + "/" + boardId;

        File uploadDir = new File(boardFolder);
        makeDirectory(uploadDir);

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isEmpty()) throw new IOException("파일 이름이 유효하지 않습니다.");


        String fileName = imageType + "-" + originalFilename;
        Path filePath = Paths.get(boardFolder, fileName);
        makeFile(file, filePath);

        return "/board_images/" + boardId + "/" + fileName;
    }


    /**
     * 파일 삭제
     *
     * @param dbFilePath DB에 저장된 경로와 파일 명칭
     * @return 삭제 성공 여부
     */
    public boolean deleteFile(String dbFilePath) { // DB에 저장된 경로와 파일 명칭
        if (dbFilePath == null || dbFilePath.isEmpty()) {
            log.warn("파일 경로 미존재");
            return false;
        }

        try {
            // DB에 저장되어 있는 상대경로를 절대경로로 반환하여 처리
            // 현재 나의 컴퓨터에서 어디에 파일이 존재하는지 위치를 완벽하게 확인하기 위한 작업으로
            // uploadPath와 productUploadPath는 C:/, D:/, E:/, / 부터 각 이미지 폴더까지 파일이름 빼고
            // 모든게 작성되어 있는 변수명으로 DB에서 프로필에 사용하는 이미지인지, 상품에서 사용하는 이미지인지 구분하기 위하여
            // 넣은 /profile_images/와 /product_images/를 제거하고 본래 저장된 상품의 명칭만 가져오겠다 설정
            String absolutePath = "";

            if (dbFilePath.startsWith("/profile_images/")) {
                String profileImagePath = dbFilePath.replace("/profile_images/", "");
                absolutePath = uploadPath + "/" + profileImagePath;
            } else if (dbFilePath.startsWith("/product_images/")) {
                String productImagePath = dbFilePath.replace("/product_images/", "");
                absolutePath = productUploadPath + "/" + productImagePath;
            } else {
                log.warn("지원하지 않는 파일 경로 형식{}", dbFilePath);
            }
            //위에서 만들어준 프로필 사진이나, 제품 메인 사진 중에서 삭제하고자 하는 파일의 경로와 명칭은
            // 절대 경로 변수 내부에 데이터가 저장되어 있음
            File file = new File(absolutePath);

            // 절대경로 + 파일이름이 존재하는지 확인
            if (!file.exists()) {
                log.warn("삭제파일 미존재:{}", absolutePath);
                return false;
            }
            // 파일 삭제
            // delete() 메서드는 결과가 true false로 나옴
            boolean isDeleteFile = file.delete();

            if (isDeleteFile) {
                log.info("파일 삭제 완료:{}", absolutePath);

                // 상품 이미지인 경우, 폴더가 비어있으면 폴더도 삭제
                if (dbFilePath.startsWith("/product_images/")) {
                    // 비어있는 상품 폴더 삭제하는 기능을 활용하여 삭제 (file.getParentFile())
                }
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
        // 원본 파일명과 확장자 추출 originalFileName
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
