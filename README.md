# Small Market - 중고 거래 및 채팅 플랫폼

Small Market은 Next.js 14와 Supabase를 활용한 현대적인 중고 거래 및 실시간 채팅 플랫폼입니다. 사용자는 상품을 등록하고, 다른 사용자와 실시간으로 채팅하며 거래를 진행할 수 있습니다.

## 주요 기능

### 상품 관리
- 상품 등록, 수정, 삭제 기능
- 상품 목록 조회 및 상세 정보 확인
- 상품 카테고리별 필터링

### 실시간 채팅
- Supabase Realtime을 활용한 실시간 채팅 기능
- 채팅방 목록 및 채팅 내역 관리
- 메시지 읽음 상태 표시
- 최적화된 메시지 상태 업데이트 (폴링 방지)

### 사용자 관리
- 소셜 로그인 (GitHub)
- 사용자 프로필 관리
- 관심 상품 및 거래 내역 관리

## 기술 스택

- **프론트엔드**: Next.js 14, React, TypeScript, Tailwind CSS
- **백엔드**: Next.js API Routes, Prisma
- **데이터베이스**: PostgreSQL (Supabase)
- **인증**: NextAuth.js
- **실시간 기능**: Supabase Realtime
- **배포**: Vercel

## 프로젝트 구조

```
small-market/
├── app/                    # Next.js 14 App Router
│   ├── (tabs)/             # 탭 기반 라우팅
│   ├── api/                # API 라우트
│   ├── chat/               # 채팅 관련 페이지 및 컴포넌트
│   ├── home/               # 홈 페이지 및 상품 관련 페이지
│   └── ...                 # 기타 페이지
├── components/             # 공통 컴포넌트
├── lib/                    # 유틸리티 함수 및 설정
├── prisma/                 # Prisma 스키마 및 마이그레이션
└── public/                 # 정적 파일
```

## 주요 구현 사항

### 실시간 채팅 최적화
- Supabase Realtime을 활용한 효율적인 메시지 상태 관리
- `useRef`를 활용한 메시지 처리 상태 추적
- 불필요한 폴링 방지를 위한 메시지 상태 업데이트 최적화

### 반응형 디자인
- 모바일 및 데스크톱 환경에 최적화된 UI
- Tailwind CSS를 활용한 일관된 디자인 시스템

### 성능 최적화
- Next.js 14의 서버 컴포넌트 활용
- 이미지 최적화 및 지연 로딩
- 효율적인 상태 관리 및 데이터 페칭

## 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/yourusername/small-market.git
cd small-market
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 변수를 설정합니다:
```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev
```

5. 개발 서버 실행
```bash
npm run dev
```

## 기여 방법

1. 이슈 생성 또는 기존 이슈 확인
2. 새로운 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 `LICENSE` 파일을 참조하세요.

## 연락처

프로젝트 관리자 - [이메일 주소]

프로젝트 링크: [https://github.com/yourusername/small-market](https://github.com/yourusername/small-market)
