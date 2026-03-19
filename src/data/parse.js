const fs = require('fs');

const rawData = [
  {
    "category": "Ball Sports",
    "clubs": [
      {
        "name_en": "Floorball Club",
        "name_jp": "フロアボールクラブ",
        "description": "Indoor hockey-like sport",
        "contact": "@tufs_floorball",
        "metadata": null
      },
      {
        "name_en": "Flying Disc Club",
        "name_jp": "フライングディスク部",
        "description": "Ultimate frisbee",
        "contact": "@tufs_flyingdisc",
        "metadata": "W/M"
      },
      {
        "name_en": "Lacrosse Club",
        "name_jp": "ラクロス部",
        "description": "Regular practice, matches",
        "contact": "@tufs_lacrosse",
        "metadata": null
      },
      {
        "name_en": "Futsal Club",
        "name_jp": "フットサル部",
        "description": "Indoor soccer",
        "contact": "@tufs_futsal",
        "metadata": null
      },
      {
        "name_en": "Table Tennis Club",
        "name_jp": "卓球部",
        "description": "Daily practice",
        "contact": "@tufs_tabletennis",
        "metadata": null
      },
      {
        "name_en": "Badminton Club",
        "name_jp": "バドミントン部",
        "description": "Regular practice",
        "contact": "@tufs_badminton",
        "metadata": null
      },
      {
        "name_en": "Volleyball Club",
        "name_jp": "バレーボール部",
        "description": "Practice, league matches",
        "contact": "M:@tufsmvb, W:@tufswvb",
        "metadata": "W/M"
      },
      {
        "name_en": "Basketball Club",
        "name_jp": "バスケットボール部",
        "description": "Daily practice",
        "contact": "@tufs_waves, @tufs_euro",
        "metadata": null
      },
      {
        "name_en": "Tennis Clubs",
        "name_jp": "テニス部",
        "description": "Practice, tournaments (soft/hard)",
        "contact": "@tufs_tennis",
        "metadata": null
      },
      {
        "name_en": "Baseball Club",
        "name_jp": "野球部",
        "description": "Soft/hard ball league games",
        "contact": "@tufsnanya2025, @tufs_baseball",
        "metadata": null
      },
      {
        "name_en": "Soccer Club",
        "name_jp": "サッカー部",
        "description": "Daily practice",
        "contact": "M:@tufsfc_official, W:@tufswfc",
        "metadata": "W/M"
      },
      {
        "name_en": "Rugby Club",
        "name_jp": "ラグビー部",
        "description": "Intercollegiate matches",
        "contact": "@tufs_rugby",
        "metadata": null
      },
      {
        "name_en": "American Football Club",
        "name_jp": "アメフト部",
        "description": "Regular practice",
        "contact": "@phantoms_shinkan",
        "metadata": null
      }
    ]
  },
  {
    "category": "Track & Field / Martial Arts",
    "clubs": [
      {
        "name_en": "Track & Field Club",
        "name_jp": "陸上競技部",
        "description": null,
        "contact": "@tufs.tf",
        "metadata": null
      },
      {
        "name_en": "Swimming Club",
        "name_jp": "水泳部",
        "description": null,
        "contact": "@tufsswim",
        "metadata": null
      },
      {
        "name_en": "Figure Skating Club",
        "name_jp": "フィギュアスケート部",
        "description": null,
        "contact": "@tufs_fsc",
        "metadata": null
      },
      {
        "name_en": "Rowing Club",
        "name_jp": "端艇部",
        "description": null,
        "contact": "@tufs_rowing_shinkan",
        "metadata": null
      },
      {
        "name_en": "Wandervogel Club",
        "name_jp": "ワンダーフォーゲル部",
        "description": null,
        "contact": "@tufs_wv",
        "metadata": null
      },
      {
        "name_en": "Cycling Club",
        "name_jp": "サイクリング部",
        "description": null,
        "contact": "@gaidai_cycling",
        "metadata": null
      },
      {
        "name_en": "Kendo Club",
        "name_jp": "剣道部",
        "description": null,
        "contact": "@tufs_kendo_kendo_since1966",
        "metadata": null
      },
      {
        "name_en": "Karate Club",
        "name_jp": "空手道部",
        "description": null,
        "contact": "@tufs_karate",
        "metadata": null
      },
      {
        "name_en": "Shorinji Kempo Club",
        "name_jp": "少林寺拳法部",
        "description": null,
        "contact": null,
        "metadata": "Every Saturday 12:30-3:30 PM"
      },
      {
        "name_en": "Aikido Club",
        "name_jp": "合気道部",
        "description": null,
        "contact": "@tufs_aikido",
        "metadata": null
      },
      {
        "name_en": "Kyudo Club",
        "name_jp": "弓道部",
        "description": null,
        "contact": "@tufs_kyudo",
        "metadata": null
      },
      {
        "name_en": "Fencing Club",
        "name_jp": "フェンシング部",
        "description": null,
        "contact": "@tufs_fencing",
        "metadata": null
      }
    ]
  },
  {
    "category": "Music & Arts",
    "clubs": [
      {
        "name_en": "Orchestra Club",
        "name_jp": "オーケストラ部",
        "description": "Symphony Orchestra",
        "contact": "@tufsorc",
        "metadata": null
      },
      {
        "name_en": "Cante Research Club",
        "name_jp": "カンテ研究会",
        "description": "Flamenco Music",
        "contact": "@tufs_cante",
        "metadata": null
      },
      {
        "name_en": "Salsa Research Club",
        "name_jp": "サルサ研究会",
        "description": "Latin Music & Dance",
        "contact": "@orq_salquendez",
        "metadata": null
      },
      {
        "name_en": "A Cappella Circle (LINES)",
        "name_jp": "アカペラサークルLINES",
        "description": "Vocal Music",
        "contact": "@tufslines_shinkan",
        "metadata": null
      },
      {
        "name_en": "Piano Circle (NOPIA)",
        "name_jp": "ピアノサークルNOPIA",
        "description": "Piano Performance",
        "contact": "@nopia_tufa2024",
        "metadata": null
      },
      {
        "name_en": "GMC",
        "name_jp": "軽音楽部GMC",
        "description": "Light Music",
        "contact": "@gmctufs",
        "metadata": null
      },
      {
        "name_en": "Dharma Darts",
        "name_jp": "軽音楽部ダルマダーツ",
        "description": "Light Music",
        "contact": "@tufs_dharma",
        "metadata": null
      },
      {
        "name_en": "Modern Jazz Laboratory",
        "name_jp": "モダンジャズ研究会",
        "description": "Jazz Music",
        "contact": "@tufs_jazz_lab",
        "metadata": null
      },
      {
        "name_en": "Brazilian Studies Club",
        "name_jp": "ブラジル研究会",
        "description": "Brazilian Music & Culture",
        "contact": "@tufsbrkn",
        "metadata": null
      },
      {
        "name_en": "Mixed Choir Choeur Soleil",
        "name_jp": "混声合唱団コールソレイユ",
        "description": "Choral Music",
        "contact": "@tufs_choeur_soleil",
        "metadata": null
      },
      {
        "name_en": "Russian Folk Song Club (LUMUC)",
        "name_jp": "ロシア民謡サークルLUMUC",
        "description": "Russian Folk Music",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Photography Club",
        "name_jp": "写真部",
        "description": "Photography",
        "contact": "@tufs_photo",
        "metadata": null
      },
      {
        "name_en": "Art Club",
        "name_jp": "美術部",
        "description": "Visual Arts",
        "contact": "@tufs_art",
        "metadata": null
      },
      {
        "name_en": "Theater Group Dadan",
        "name_jp": "劇団ダダン",
        "description": "Theater Performance",
        "contact": "@gekidandadan_official",
        "metadata": null
      },
      {
        "name_en": "Film Studies Club",
        "name_jp": "映画研究会",
        "description": "Film Analysis & Production",
        "contact": "@tufs_create",
        "metadata": null
      },
      {
        "name_en": "Manga Research Club",
        "name_jp": "漫画研究会",
        "description": "Manga Creation & Study",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Literature Club",
        "name_jp": "文芸部",
        "description": "Creative Writing & Reading",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "XBULL",
        "name_jp": "お笑いサークルXBULL",
        "description": "Japanese Comedy",
        "contact": "@tufs_owarai",
        "metadata": null
      },
      {
        "name_en": "Acoustic Circle (AA)",
        "name_jp": "アコースティックサークルAA",
        "description": "Acoustic Music",
        "contact": "@tufs.aa",
        "metadata": null
      },
      {
        "name_en": "Russian Theater Group",
        "name_jp": "ロシア劇団",
        "description": "Russian Drama",
        "contact": "@theatrekontsert",
        "metadata": null
      },
      {
        "name_en": "Wind Orchestra",
        "name_jp": "吹奏楽部",
        "description": "Orchestral Music",
        "contact": "@tufs_windorchestra",
        "metadata": null
      }
    ]
  },
  {
    "category": "Dance & Performance",
    "clubs": [
      {
        "name_en": "Spanish Dance Club",
        "name_jp": "スペイン舞踊部",
        "description": "Traditional Spanish dance",
        "contact": "@tufs.flamenco.info",
        "metadata": null
      },
      {
        "name_en": "Philippine Folk Dance Club",
        "name_jp": "フィリピン民族舞踊団",
        "description": "Traditional Filipino dance",
        "contact": "@tufs_phil_dance",
        "metadata": null
      },
      {
        "name_en": "Belly Dance Club",
        "name_jp": "ベリーダンス部",
        "description": "Middle Eastern dance",
        "contact": "@belly_spring.tufs25",
        "metadata": null
      },
      {
        "name_en": "Street Dance Club",
        "name_jp": "ストリートダンス部",
        "description": "Hip-hop & urban dance",
        "contact": "@quattro_tufs",
        "metadata": null
      },
      {
        "name_en": "Classical Ballet Club",
        "name_jp": "クラシックバレエ部",
        "description": "Ballet training",
        "contact": "@tufs_ballet_etoile",
        "metadata": null
      },
      {
        "name_en": "Indonesian Dance Club",
        "name_jp": "インドネシア舞踊部",
        "description": "Traditional Indonesian dance",
        "contact": "@tufs_turiindonesia",
        "metadata": null
      },
      {
        "name_en": "Ballroom Dance Club",
        "name_jp": "競技ダンス部",
        "description": "Competitive dance",
        "contact": "@tufsbdc",
        "metadata": null
      },
      {
        "name_en": "Cheerleading Club",
        "name_jp": "チアリーディング部",
        "description": "Cheer & performance",
        "contact": "@tufs_rams.cheerforyou",
        "metadata": null
      },
      {
        "name_en": "Pom Dance Circle",
        "name_jp": "ポンダンスサークル",
        "description": "Pom-pom dance",
        "contact": "@tufs_amity",
        "metadata": null
      },
      {
        "name_en": "Kathak Dance Club",
        "name_jp": "カタック舞踊部",
        "description": "Classical Indian dance",
        "contact": "@tufs_kathak",
        "metadata": null
      },
      {
        "name_en": "Vietnamese Dance Society",
        "name_jp": "ベトナム舞踊研究会",
        "description": "Traditional Vietnamese dance",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "K-POP Cover Dance Circle",
        "name_jp": "K-POPカバーダンスサークル",
        "description": "K-pop dance covers",
        "contact": "@tufs_souls",
        "metadata": null
      },
      {
        "name_en": "Argentine Tango Circle",
        "name_jp": "アルゼンチンタンゴサークル",
        "description": "Tango dance",
        "contact": "@tufs_tango",
        "metadata": null
      },
      {
        "name_en": "Tap Dance Society",
        "name_jp": "タップダンス研究会",
        "description": "Tap dance",
        "contact": "@tufs_tups",
        "metadata": null
      },
      {
        "name_en": "Hula Team",
        "name_jp": "フラチーム",
        "description": "Hawaiian dance",
        "contact": "@tufs.kapilialoha.hula",
        "metadata": null
      }
    ]
  },
  {
    "category": "Japanese Culture / Language / Social",
    "clubs": [
      {
        "name_en": "Hakugakai",
        "name_jp": "伯牙会",
        "description": "Traditional Japanese drum",
        "contact": "@hakugakai_tufs",
        "metadata": null
      },
      {
        "name_en": "Ikebana Club",
        "name_jp": "華道部",
        "description": "Japanese Flower Arrangement",
        "contact": "@tufs_kado",
        "metadata": null
      },
      {
        "name_en": "Omotesenke Tea Ceremony",
        "name_jp": "表千家茶道部",
        "description": "Traditional Tea Ceremony",
        "contact": "@tufs_omotesenke",
        "metadata": null
      },
      {
        "name_en": "Urasenke Tea Ceremony",
        "name_jp": "裏千家茶道部",
        "description": "Traditional Tea Ceremony",
        "contact": "@tufs_urasenke",
        "metadata": null
      },
      {
        "name_en": "Karuta Club",
        "name_jp": "かるた会",
        "description": "Japanese Card Game",
        "contact": "@tufs_karuta_akino",
        "metadata": null
      },
      {
        "name_en": "Kimono Club",
        "name_jp": "着付けサークル",
        "description": "Traditional Clothing",
        "contact": "@tufs_kimono",
        "metadata": null
      },
      {
        "name_en": "English Speaking Society (E.S.S.)",
        "name_jp": null,
        "description": "English Discussion & Debate",
        "contact": "@tufs_ess",
        "metadata": null
      },
      {
        "name_en": "Model United Nations",
        "name_jp": null,
        "description": "UN Simulation & Debate",
        "contact": "@munkuniken_shinkan",
        "metadata": null
      },
      {
        "name_en": "Syria Studies Club",
        "name_jp": null,
        "description": "Middle Eastern Studies",
        "contact": "@tufsyria",
        "metadata": null
      },
      {
        "name_en": "Penda Africa",
        "name_jp": null,
        "description": "African Studies",
        "contact": "@tufs_penda",
        "metadata": null
      },
      {
        "name_en": "Estudamos Português!",
        "name_jp": null,
        "description": "Portuguese Studies",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Russian Circle Lyubov",
        "name_jp": null,
        "description": "Russian Culture & Language",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "TUFPOST",
        "name_jp": null,
        "description": "Student Journalism",
        "contact": "@tufs_post",
        "metadata": null
      },
      {
        "name_en": "LGBTQ+ Circle Pas A Pas",
        "name_jp": null,
        "description": "Gender & Sexuality Studies",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Balkan Studies Club",
        "name_jp": null,
        "description": "Southeastern European Studies",
        "contact": "X: @tufbalkan",
        "metadata": null
      },
      {
        "name_en": "Law Studies Circle Tanhokai",
        "name_jp": null,
        "description": "Legal Studies",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Quiz Research Club",
        "name_jp": null,
        "description": "Quiz & General Knowledge",
        "contact": "@tufs_quiz",
        "metadata": null
      },
      {
        "name_en": "Sign Language Circle",
        "name_jp": null,
        "description": "Sign Language Studies",
        "contact": "@tufs_sign",
        "metadata": null
      },
      {
        "name_en": "TUFS Japaneque",
        "name_jp": null,
        "description": "Japanese Culture Studies",
        "contact": "@tufs_japaneque",
        "metadata": null
      },
      {
        "name_en": "Regional Revitalization Circle \"Imoni-kai\"",
        "name_jp": null,
        "description": "Community Development",
        "contact": "@imoni.kai_tufs",
        "metadata": null
      }
    ]
  },
  {
    "category": "Volunteer & Other Organizations",
    "clubs": [
      {
        "name_en": "Peek A Boo",
        "name_jp": null,
        "description": "General Volunteering",
        "contact": "X: @tufsPeekABoo",
        "metadata": null
      },
      {
        "name_en": null,
        "name_jp": "くらふと",
        "description": "Education",
        "contact": "@tufs_kraft",
        "metadata": null
      },
      {
        "name_en": null,
        "name_jp": "くりふ",
        "description": "Education Support",
        "contact": null,
        "metadata": null
      },
      {
        "name_en": "Femme Café",
        "name_jp": null,
        "description": "Social Support",
        "contact": "@femmecafecoffee",
        "metadata": null
      },
      {
        "name_en": "ALPHA",
        "name_jp": null,
        "description": "Student NGO",
        "contact": "@ngo_alpha",
        "metadata": null
      },
      {
        "name_en": "ELAN",
        "name_jp": null,
        "description": "Education",
        "contact": "@elan_connect_sea",
        "metadata": null
      },
      {
        "name_en": "Mres",
        "name_jp": null,
        "description": "Social Support",
        "contact": "@mres_habitatforhumanity_tufs",
        "metadata": null
      },
      {
        "name_en": null,
        "name_jp": "外語祭実行委員会",
        "description": "Event Planning",
        "contact": "@tufs_gaigosai",
        "metadata": null
      },
      {
        "name_en": null,
        "name_jp": "生協学生委員会 TuCos",
        "description": "Student Services",
        "contact": "@tufs_tucos",
        "metadata": null
      },
      {
        "name_en": null,
        "name_jp": "学生広報アンバサダー",
        "description": "Public Relations",
        "contact": null,
        "metadata": null
      }
    ]
  }
];

const processed = [];

rawData.forEach(categoryGroup => {
  categoryGroup.clubs.forEach(club => {
    const clubObj = {
      id: (club.name_en || club.name_jp).toLowerCase().replace(/[^a-z0-9]/g, ''),
      nameJa: club.name_jp || club.name_en,
      nameEn: club.name_en || club.name_jp,
      category: categoryGroup.category,
      description: club.description || "",
      metadata: club.metadata || undefined
    };

    if (club.contact) {
      if (club.contact.includes("X: @")) {
        const handleMatch = club.contact.match(/X: @([a-zA-Z0-9_.]+)/);
        if (handleMatch) {
          clubObj.xUrl = `https://x.com/${handleMatch[1]}`;
        }
      } else if (club.contact.includes("@")) {
        // Find the first @ handle
        const handleMatch = club.contact.match(/@([a-zA-Z0-9_.]+)/);
        if (handleMatch) {
          clubObj.instagram = `https://www.instagram.com/${handleMatch[1]}/`;
        }
      }
    }
    processed.push(clubObj);
  });
});

fs.writeFileSync('C:\\Users\\fujit\\.gemini\\antigravity\\scratch\\strait\\src\\data\\clubs.json', JSON.stringify(processed, null, 2));
