# 바이브 AI 교육 신청 웹앱

Next.js(App Router) + Supabase 로 만든 교육 신청 접수 시스템입니다.

- **신청 페이지** (`/`) — 이름, 이메일, 소속 부서, 신청 과정, 하고 싶은 말을 입력해 신청
- **관리자 페이지** (`/admin`) — 신청 내역을 최신순 표로 확인 + 인원 집계

---

## 실행 방법

### 1. 의존성 설치

```bash
cd vibe-ai-education
npm install
```

### 2. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com) 에서 프로젝트를 생성합니다.
2. 대시보드의 **SQL Editor** 에서 프로젝트 루트의 `supabase-schema.sql` 내용을 붙여넣고 실행합니다.
   → `applications` 테이블과 접근 정책이 생성됩니다.

### 3. 환경변수 설정

`.env.local` 파일을 열어 자리표시자를 실제 값으로 채웁니다.
값은 Supabase 대시보드 > **Project Settings > API** 에서 확인할 수 있습니다.

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi... (anon public 키)
```

### 4. 개발 서버 실행

```bash
npm run dev
```

- 신청 페이지: http://localhost:3000
- 관리자 페이지: http://localhost:3000/admin

### 5. 배포용 빌드 (선택)

```bash
npm run build
npm run start
```

---

## 데이터베이스 구조 (`applications`)

| 컬럼        | 타입          | 설명                       |
| ----------- | ------------- | -------------------------- |
| id          | bigint        | 기본키 (자동 증가)         |
| created_at  | timestamptz   | 신청 일시 (자동)           |
| name        | text          | 이름 (필수)                |
| email       | text          | 이메일 (필수)              |
| department  | text          | 소속 부서                  |
| course      | text          | 신청 과정 (입문/실전/심화) |
| message     | text          | 하고 싶은 말               |

> 참고: 예제에서는 anon 키로 신청/조회가 모두 가능하도록 RLS 정책을 설정했습니다.
> 실제 서비스에서는 `/admin` 조회를 Supabase Auth 등으로 별도 보호하는 것을 권장합니다.
