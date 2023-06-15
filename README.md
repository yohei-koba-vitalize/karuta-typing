# Jomo Karta Typing App
---
## Lets typing !

- winもmacも、以下でいけるはず！
  - git clone https://gitlab.team-vitalize.com/maebashi/karuta_typing.git
  - git pull origin master
  - node_modulesを削除
  - npm install
  - .envをルートディレクトリに格納
  - npm run dev

※ うまくいかない場合は、ターミナルのガイドに沿ってnodeのバージョンを見直してください！(可能であれば)

---

## About

- 機能
  - START COMPONENT
    - スタート画面       by みんな
  - PLAYING COMPONENT
    - 実際のプレイ画面   by はっしー
  - RESULT COMPONENT
    - 結果画面           by ようへい
  - RANKING COMPONENT
    - ランキング画面     by むぎ

- DB
  - Firebase / Firestore

---
## Tables

### results

|Document ID|name|result|sub_result|feeling|created_at|
|----|----|----|----|----|----|
|PK|string|number|number|string|timestamp|
|0pgjY5KWRo5FjPRpTavJ|むぎちゃん|14|9|面白かったです！|2023年5月3日 19:51:54 UTC+9|

### cards

|Document ID|initial|text|alphabet|yomi|picture_card|text_card|comment|
|----|----|----|----|----|----|----|----|
|PK|string|string|string|string|string|string|string|
|30sBWJRM8GUZZXsYztvN|む|昔を語る多胡の古碑|mukashiwokatarutagonokohi|むかしをかたるたごのこひ|carta10-278-33a.jpg|carta10-278-33b.jpg|日本三古碑の 〜 ました。|


### About Firebase

- 基本概念
  - collection .. テーブルに近い概念
  - document .. レコードに近い概念
  - document ID .. ユニークキー(Firebaseに自動裁判させてます)
  - field .. カラムに近い概念
- 基本実装方法
  - 公式を見よ
- FirestoreコンソールURL
  - https://console.firebase.google.com/u/0/project/jomokaruta-d71f0/overview?hl=ja
- リージョン
  - asia-northeast1 (Tokyo)
- Cloud Firestoreの無料制限枠
  - 保存済みのデータ:        合計 1 GiB
  - 下り（外向き）ネットワーク: 10 GiB/月
  - ドキュメントの書き込み:     書き込み 2 万件/日
  - ドキュメントの読み取り:     読み取り 5 万件/日
  - ドキュメントの削除:         2 万件/日
- データの一括投入方法
  - 参考
    - https://lyla.tokyo/import_data_to_firestore/
