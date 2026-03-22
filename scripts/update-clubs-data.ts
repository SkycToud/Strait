import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * update-clubs-data スクリプト
 * 
 * 使い方：
 * 1. 最新のクラブデータを準備する（CSV, JSON, または手動更新）
 * 2. このスクリプトを実行して、全クラブデータを同期・更新する
 * 3. `npx tsx scripts/update-clubs-data.ts` を実行
 */

const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');
const JSON_DATA_PATH = path.join(process.cwd(), 'src/data/clubs.json');

// 最新の更新データ（ここに新しい情報を追加）
const latestUpdates = {
  // 例：新しいInstagram URL
  instagram: {
    'tabletennisclub': 'https://www.instagram.com/tufs_tabletennis/',
    'badmintonclub': 'https://www.instagram.com/tufs_badminton/',
    'volleyballclub': 'https://www.instagram.com/tufsmvb/',
    'basketballclub': 'https://www.instagram.com/tufs_waves/',
    'tennisclubs': 'https://www.instagram.com/tufs_tennis/',
    'baseballclub': 'https://www.instagram.com/tufsnanya2025/',
    'soccerclub': 'https://www.instagram.com/tufsfc_official/',
    'rugbyclub': 'https://www.instagram.com/tufs_rugby/',
    'americanfootballclub': 'https://www.instagram.com/phantoms_shinkan/',
    'trackfieldclub': 'https://www.instagram.com/tufs.tf/',
    'swimmingclub': 'https://www.instagram.com/tufsswim/',
    'figureskatingclub': 'https://www.instagram.com/tufs_fsc/',
    'rowingclub': 'https://www.instagram.com/tufs_rowing_shinkan/',
    'wandervogelclub': 'https://www.instagram.com/tufs_wv/',
    'cyclingclub': 'https://www.instagram.com/gaidai_cycling/',
    'kendoclub': 'https://www.instagram.com/tufs_kendo_kendo_since1966/',
    'karateclub': 'https://www.instagram.com/tufs_karate/'
  } as Record<string, string>,
  // 例：新しい概要情報
  overview: {
    'flyingdiscclub': {
      philosophy: 'スピリット・オブ・ザ・ゲームを重視し、フェアプレーと自己判断を育む',
      guidelines: '初心者から経験者まで、男女共に楽しくプレイできる環境を提供',
      activities: '定期練習、練習試合、インカレ大会、新歓活動'
    },
    'lacrosseclub': {
      philosophy: 'チームワークと技術向上を目指し、男女共に活躍できる場を提供',
      guidelines: '基礎から応用まで段階的に指導、未経験者も歓迎',
      activities: '定期練習、練習試合、関東大学リーグ戦、新歓合宿'
    },
    'futsalclub': {
      philosophy: '技術向上と仲間との交流を重視したフットサル活動',
      guidelines: '基本的な技術から戦術まで、レベルに合わせた指導',
      activities: '定期練習、練習試合、リーグ戦、新歓大会'
    }
  } as Record<string, Record<string, string>>,
  // 例：新しい年会費情報
  annualFees: {
    'floorballclub': '年間5,000円（保険費・備品費含む）',
    'flyingdiscclub': '年間4,000円（ユニフォーム・大会参加費含む）',
    'lacrosseclub': '年間6,000円（備品費・保険費含む）',
    'futsalclub': '年間5,000円（ユニフォーム・大会費含む）'
  } as Record<string, string>
};

function updateMarkdownFiles() {
  console.log('📝 Markdownファイルを更新中...');
  
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('❌ コンテンツディレクトリが見つかりません:', CONTENT_DIR);
    return;
  }

  const files = fs.readdirSync(CONTENT_DIR).filter(file => file.endsWith('.md'));
  let updatedCount = 0;

  files.forEach(file => {
    const clubId = file.replace(/\.md$/, '');
    const filePath = path.join(CONTENT_DIR, file);
    
    try {
      const rawFile = fs.readFileSync(filePath, 'utf-8');
      const parsed = matter(rawFile);
      let hasUpdates = false;

      // Instagram URLの更新
      if (latestUpdates.instagram[clubId] && parsed.data.instagram !== latestUpdates.instagram[clubId]) {
        parsed.data.instagram = latestUpdates.instagram[clubId];
        hasUpdates = true;
        console.log(`✅ ${clubId}: Instagram URLを更新`);
      }

      // 概要情報の更新
      if (latestUpdates.overview[clubId]) {
        const overview = latestUpdates.overview[clubId];
        if (!parsed.data.overview) parsed.data.overview = {};
        
        Object.keys(overview).forEach(key => {
          if (parsed.data.overview[key] !== overview[key]) {
            parsed.data.overview[key] = overview[key];
            hasUpdates = true;
          }
        });
        
        if (hasUpdates) {
          console.log(`✅ ${clubId}: 概要情報を更新`);
        }
      }

      // 年会費の更新
      if (latestUpdates.annualFees[clubId] && parsed.data.recruitment) {
        if (parsed.data.recruitment.annualFee !== latestUpdates.annualFees[clubId]) {
          parsed.data.recruitment.annualFee = latestUpdates.annualFees[clubId];
          hasUpdates = true;
          console.log(`✅ ${clubId}: 年会費を更新`);
        }
      }

      // 最終更新日時を更新
      if (hasUpdates) {
        parsed.data.lastUpdated = new Date().toISOString().split('T')[0];
        const newFileContent = matter.stringify(parsed.content, parsed.data);
        fs.writeFileSync(filePath, newFileContent, 'utf-8');
        updatedCount++;
      }

    } catch (error) {
      console.error(`❌ ${clubId} の更新中にエラー:`, error);
    }
  });

  console.log(`📊 Markdownファイル更新完了: ${updatedCount}件更新`);
}

function updateJsonData() {
  console.log('🔄 JSONデータを更新中...');
  
  if (!fs.existsSync(JSON_DATA_PATH)) {
    console.error('❌ clubs.jsonが見つかりません:', JSON_DATA_PATH);
    return;
  }

  try {
    const clubsData = JSON.parse(fs.readFileSync(JSON_DATA_PATH, 'utf-8'));
    let updatedCount = 0;

    clubsData.forEach((club: any) => {
      let hasUpdates = false;

      // Instagram URLの更新
      if (latestUpdates.instagram[club.id] && club.instagram !== latestUpdates.instagram[club.id]) {
        club.instagram = latestUpdates.instagram[club.id];
        hasUpdates = true;
      }

      // 概要情報の更新
      if (latestUpdates.overview[club.id]) {
        const overview = latestUpdates.overview[club.id];
        if (!club.overview) club.overview = {};
        
        Object.keys(overview).forEach(key => {
          if (club.overview[key] !== overview[key]) {
            club.overview[key] = overview[key];
            hasUpdates = true;
          }
        });
      }

      // 年会費の更新
      if (latestUpdates.annualFees[club.id] && club.recruitment) {
        if (club.recruitment.annualFee !== latestUpdates.annualFees[club.id]) {
          club.recruitment.annualFee = latestUpdates.annualFees[club.id];
          hasUpdates = true;
        }
      }

      // 最終更新日時を更新
      if (hasUpdates) {
        club.lastUpdated = new Date().toISOString().split('T')[0];
        updatedCount++;
      }
    });

    // 更新されたデータを書き戻し
    fs.writeFileSync(JSON_DATA_PATH, JSON.stringify(clubsData, null, 2), 'utf-8');
    console.log(`📊 JSONデータ更新完了: ${updatedCount}件更新`);

  } catch (error) {
    console.error('❌ JSONデータの更新中にエラー:', error);
  }
}

function validateData() {
  console.log('🔍 データ整合性を確認中...');
  
  const contentDir = path.join(process.cwd(), 'src/content/clubs');
  const jsonPath = path.join(process.cwd(), 'src/data/clubs.json');
  
  if (!fs.existsSync(contentDir) || !fs.existsSync(jsonPath)) {
    console.error('❌ 必要なファイルが見つかりません');
    return;
  }

  // MarkdownファイルとJSONデータの整合性チェック
  const jsonClubs = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as any[];
  const markdownFiles = fs.readdirSync(contentDir).filter(file => file.endsWith('.md'));
  
  const jsonIds = new Set(jsonClubs.map((club: any) => club.id));
  const markdownIds = new Set(markdownFiles.map(file => file.replace(/\.md$/, '')));
  
  const missingInMarkdown = [...jsonIds].filter(id => !markdownIds.has(id));
  const missingInJson = [...markdownIds].filter(id => !jsonIds.has(id));
  
  if (missingInMarkdown.length > 0) {
    console.log('⚠️ JSONに存在するがMarkdownに存在しないクラブ:', missingInMarkdown);
  }
  
  if (missingInJson.length > 0) {
    console.log('⚠️ Markdownに存在するがJSONに存在しないクラブ:', missingInJson);
  }
  
  if (missingInMarkdown.length === 0 && missingInJson.length === 0) {
    console.log('✅ データ整合性確認完了');
  }
}

function main() {
  console.log('🚀 update-clubs-data スクリプトを開始します...\n');
  
  try {
    updateMarkdownFiles();
    console.log('');
    updateJsonData();
    console.log('');
    validateData();
    console.log('\n🎉 全ての更新が完了しました！');
  } catch (error) {
    console.error('❌ スクリプト実行中にエラーが発生しました:', error);
    process.exit(1);
  }
}

// スクリプト実行
if (require.main === module) {
  main();
}

export { main as updateClubsData };
