-- Supabase 대시보드 > SQL Editor 에서 실행하세요.
-- applications 테이블에 핸드폰 번호 컬럼을 추가합니다. (이미 있으면 안전하게 무시됩니다)

alter table public.applications add column if not exists phone text;

-- 컬럼 추가 후에도 저장 오류가 계속되면 스키마 캐시를 새로고침하세요.
notify pgrst, 'reload schema';
