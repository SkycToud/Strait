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

### 2. update-md-direct.ts の更新

`scripts/update-md-direct.ts` を開き、以下を確認・更新する：

- **CSV_PATH**: ファイル名が変わっていれば修正
- **NAME_TO_MD**: 新しいサークルがあれば、サークル名 → mdファイル名 のマッピングを追加
  - IDは英語小文字のみ（例: `koreandanceclub`）
- **GENRE_TO_CATEGORY**: 必要に応じてジャンルとカテゴリの対応を更新（既存カテゴリにないものは `Others` にフォールバック）

### 3. CSVからMarkdownを直接更新

// turbo
```
npx tsx scripts/update-md-direct.ts
```

これで `src/content/clubs/*.md` がCSV内容で更新される。

### 4. CSVにないサークルを削除（任意）

CSVに含まれないサークルの `.md` ファイルを削除したい場合は、手動で `src/content/clubs/` から不要なファイルを削除する。

### 5. 表示確認

// turbo
```
npm run dev
```

ブラウザで `http://localhost:3000/clubs/all` を開き、データが正しく表示されていることを確認する。

---

## カテゴリ対応表

| CSVジャンル | アプリのカテゴリ |
|---|---|
| 美術・音楽 | Music & Arts |
| 舞踊・ダンス | Dance & Performance |
| 球技 | Ball Sports |
| 武道・武術 | Martial Arts |
| その他スポーツ | Other Sports |
| ボランティア | Volunteer |
| 語学・国際交流 | Language & International |
| 社会課題 | Social Issues |
| 企画 | Planning |
| 上記以外 | Others |

---

## ファイル構成

```
scripts/
└── update-md-direct.ts        # CSV → src/content/clubs/*.md

src/
└── content/clubs/*.md         # ← アプリが読むデータソース
```
