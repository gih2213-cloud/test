import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// .env.local 에 자리표시자가 그대로 남아있거나 값이 비어 있으면
// createClient 가 바로 예외를 던져 앱 전체가 죽는 것을 막습니다.
export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  isValidHttpUrl(supabaseUrl);

if (!isSupabaseConfigured) {
  console.warn(
    "[Supabase] .env.local 에 NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 를 올바르게 설정해 주세요."
  );
}

// 이 앱은 로그인 없이 anon key로만 테이블에 접근하므로 세션 저장/자동 갱신을
// 비활성화합니다. (브라우저에 남은 손상된 세션 데이터가 있으면 Supabase 클라이언트가
// 헤더를 잘못 설정해 "Failed to execute 'set' on 'Headers'" 오류를 던질 수 있습니다.)
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;
