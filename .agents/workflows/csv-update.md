---
description: CSVからサークルデータを更新する手順
---

# CSVからサークルデータを更新する

Google フォームのアンケート回答CSVから、アプリのサークル情報を更新する手順です。

## 前提

- CSVファイルを `Downloads` フォルダにダウンロード済み
- アプリは `src/content/clubs/*.md` (Markdown) をデータソースとして使用

---

## 手順

### 1. CSVファイルの確認

ダウンロードしたCSVファイルの中身を確認し、新しいサークルがあるかチェックする。

### 2. import-csv-survey.ts の更新

`scripts/import-csv-survey.ts` を開き、以下を確認・更新する：

- **CSV_PATH**: ファイル名が変わっていれば修正
- **NAME_TO_ID**: 新しいサークルがあれば、サークル名 → ID のマッピングを追加
  - IDは英語小文字のみ（例: `koreandanceclub`）
- **GENRE_TO_CATEGORY**: 新しいジャンルがあれば追加（既存カテゴリにないものは `Hobbies` にフォールバック）

### 3. CSVデータを clubs.json に取り込む

// turbo
```
npx tsx scripts/import-csv-survey.ts
```

### 4. clubs.json から Markdown ファイルを生成

// turbo
```
npx tsx scripts/generate-md-from-json.ts
```

これで `src/content/clubs/*.md` が最新データで上書きされる。

### 5. CSVにないサークルを削除（任意）

CSVに含まれないサークルの `.md` ファイルを削除したい場合は、手動で `src/content/clubs/` から不要なファイルを削除する。

### 6. 表示確認

// turbo
```
npm run dev
```

ブラウザで `http://localhost:3000/clubs/all` を開き、データが正しく表示されていることを確認する。

---

## カテゴリ対応表

| CSVジャンル | アプリのカテゴリ |
|---|---|
| 芸術・音楽 | Arts & Music |
| 舞踊・ダンス | Dance & Performance |
| 球技 | Ball Sports |
| 武道 | Martial Arts |
| 伝統文化 | Others |
| ボランティア | Volunteer |
| 語学・国際交流 | Language & International |
| 社会課題 | Social Issues |
| 企画 | Planning |
| 上記以外 | Others |

---

## ファイル構成

```
scripts/
├── import-csv-survey.ts      # CSV → clubs.json
└── generate-md-from-json.ts  # clubs.json → src/content/clubs/*.md

src/
├── content/clubs/*.md         # ← アプリが読むデータソース
└── data/clubs.json            # 中間データ（スクリプト間の橋渡し）
```
