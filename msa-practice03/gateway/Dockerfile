# gateway/Dockerfile
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 애플리케이션 포트 노출
EXPOSE 3000

# 애플리케이션 시작 명령어
CMD ["node", "gateway.js"]
