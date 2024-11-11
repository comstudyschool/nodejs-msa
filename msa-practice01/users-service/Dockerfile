# Node.js 베이스 이미지 사용
FROM node:14

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 설치
COPY package*.json ./
RUN npm install

# 소스 코드 복사
COPY . .

# 서비스가 실행될 포트 지정
EXPOSE 3002

# 애플리케이션 시작 명령
CMD ["node", "app.js"]
