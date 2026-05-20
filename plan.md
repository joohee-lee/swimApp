# swimApp v01 Plan

## localStorage 구조

### 키 목록

| 키 | 역할 | 형식 |
|---|---|---|
| `swim_records` | 수영 기록 전체 | `Array<Record>` |
| `swim_favorites` | 자주 쓰는 수영장 이름 | `Array<string>` (최대 5개) |

### 데이터 흐름

#### 기록 저장/불러오기
- **`load()`** (app.js:12) — `swim_records` 읽어서 배열 반환. 없으면 빈 배열.
- **`save(records)`** (app.js:16) — 배열 전체를 JSON으로 덮어씀.
- 폼 제출 시 (app.js:86~104): 새 기록을 `unshift`로 맨 앞에 추가 후 저장.
- 삭제 시 (app.js:77~84): `splice`로 해당 인덱스 제거 후 저장.

#### 즐겨찾기 (수영장 이름)
- **`loadFavorites()`** / **`saveFavorite(name)`** (app.js:20~31) — 중복 없이 최신 5개 유지.
- 저장 시 `unshift`로 맨 앞 추가 후 `.slice(0, 5)`로 잘라냄.
- 버튼 클릭 시 해당 이름이 pool 입력칸에 자동 채워짐 (app.js:40~44).

### Record 객체 구조

```js
{
  date: "2026-05-20",        // 날짜
  pool: "올림픽수영장",       // 수영장 이름
  distance: "1500",          // 거리 (m)
  duration: "45",            // 시간 (분)
  strokes: ["자유형", "배영"], // 영법 (체크박스)
  diary: "오늘 컨디션 좋았다"  // 메모
}
```
