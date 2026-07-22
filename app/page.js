"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const COURSES = ["입문반", "실전반", "심화반"];

export default function ApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    course: COURSES[0],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!isSupabaseConfigured) {
      setError(
        ".env.local 에 Supabase 연결 정보가 설정되지 않았습니다. 관리자에게 문의해 주세요."
      );
      return;
    }

    // 필수값 검증
    if (!form.name.trim() || !form.email.trim()) {
      setError("이름과 이메일은 필수 입력 항목입니다.");
      return;
    }

    setSubmitting(true);
    const { error: insertError } = await supabase.from("applications").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      department: form.department.trim() || null,
      program: form.course,
      message: form.message.trim() || null,
    });
    setSubmitting(false);

    if (insertError) {
      setError("신청 저장 중 오류가 발생했습니다: " + insertError.message);
      return;
    }
    setDone(true);
  }

  function resetForm() {
    setForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      course: COURSES[0],
      message: "",
    });
    setDone(false);
  }

  return (
    <main className="page page-dark">
      <div className="card">
        {done ? (
          <div className="success">
            <div className="check">✓</div>
            <h2>신청이 완료되었습니다</h2>
            <p>바이브 AI 교육 신청이 정상적으로 접수되었습니다.</p>
            <button className="link-btn" onClick={resetForm}>
              추가로 신청하기
            </button>
          </div>
        ) : (
          <>
            <div className="brand">
              <h1>바이브 AI 교육 신청</h1>
              <p>아래 항목을 작성하고 신청해 주세요.</p>
            </div>

            {!isSupabaseConfigured && (
              <div className="alert alert-error">
                Supabase 연결 정보가 설정되지 않았습니다. .env.local 파일에
                NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 값을
                채운 뒤 서버를 다시 시작해 주세요.
              </div>
            )}

            {error && <div className="alert alert-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="name">
                  이름<span className="req">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">
                  이메일<span className="req">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="phone">핸드폰 번호</label>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="010-1234-5678"
                />
              </div>

              <div className="field">
                <label htmlFor="department">소속 부서</label>
                <input
                  id="department"
                  type="text"
                  value={form.department}
                  onChange={(e) => update("department", e.target.value)}
                  placeholder="예: 마케팅팀"
                />
              </div>

              <div className="field">
                <label htmlFor="course">신청 과정</label>
                <select
                  id="course"
                  value={form.course}
                  onChange={(e) => update("course", e.target.value)}
                >
                  {COURSES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label htmlFor="message">하고 싶은 말</label>
                <textarea
                  id="message"
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="교육에 바라는 점이나 궁금한 점을 자유롭게 적어주세요."
                />
              </div>

              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "신청 중..." : "신청하기"}
              </button>
            </form>

            <div style={{ textAlign: "center", marginTop: 16 }}>
              <Link className="muted" href="/admin" style={{ fontSize: 13 }}>
                관리자 페이지
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
