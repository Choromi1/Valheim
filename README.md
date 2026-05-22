# Valheim 모드 적용 가이드 GitHub Pages

## 파일 구성

```text
index.html
styles.css
script.js
assets/
  page-1-install-guide.png
  page-2-mod-details.png
```

## GitHub Pages 배포 방법

1. GitHub에서 새 Repository 생성
2. 위 파일들을 Repository 루트에 업로드
3. Repository의 Settings → Pages 이동
4. Build and deployment에서 Source를 `Deploy from a branch`로 선택
5. Branch를 `main`, Folder를 `/root`로 선택 후 Save
6. 표시되는 GitHub Pages URL로 접속

## 업데이트 방법

가이드 이미지가 바뀌면 `assets/page-1-install-guide.png`, `assets/page-2-mod-details.png` 파일만 같은 이름으로 교체하면 됩니다.
