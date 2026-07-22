"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";

const COURSES = ["입문반", "실전반", "심화반"];

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
}

export default function AdminPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError(
        ".env.local 에 Supabase 연결 정보가 설정되지 않았습니다. NEXT_PUBLIC_SUPABASE_URL 과 NEXT_PUBLIC_SUPABASE_ANON_KEY 값을 채운 뒤 서버를 다시 시작해 주세요."
      );
      setLoading(false);
      return;
    }

    let active = true;
    async function load() {
      const { data, error: fetchError } = await supabase
        .from("applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (!active) return;
      if (fetchError) {
        setError("신청 내역을 불러오지 못했습니다: " + fetchError.message);
      } else {
        setRows(data ?? []);
      }
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  // 과정별 인원 집계
  const countByCourse = COURSES.reduce((acc, c) => {
    acc[c] = rows.filter((r) => r.program === c).length;
    return acc;
  }, {});

  return (
    <main className="page">
      <div className="topbar">
        <Link className="link-btn" href="/">
          ← 신청 페이지
        </Link>
      </div>

      <div className="admin">
        <div className="admin-header">
          <h1>신청 관리</h1>
        </div>

        <div className="stats">
          <div className="stat">
            <div className="num">{rows.length}</div>
            <div className="label">전체 신청</div>
          </div>
          {COURSES.map((c) => (
            <div className="stat" key={c}>
              <div className="num">{countByCourse[c]}</div>
              <div className="label">{c}</div>
            </div>
          ))}
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="table-wrap">
          {loading ? (
            <div className="empty">불러오는 중...</div>
          ) : rows.length === 0 ? (
            <div className="empty">아직 신청 내역이 없습니다.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>신청일시</th>
                  <th>이름</th>
                  <th>이메일</th>
                  <th>소속 부서</th>
                  <th>신청 과정</th>
                  <th>하고 싶은 말</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="muted" style={{ whiteSpace: "nowrap" }}>
                      {formatDate(r.created_at)}
                    </td>
                    <td>{r.name}</td>
                    <td>{r.email}</td>
                    <td>{r.department || <span className="muted">-</span>}</td>
                    <td>
                      <span className="badge">{r.program}</span>
                    </td>
                    <td>{r.message || <span className="muted">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
