---
name: ios-workout-shortcut-builder
description: 當用戶想製作一個以選單點選記錄運動、並送到 workout-webhook 例行程序的 iPhone 捷徑時使用。
---
# 製作點選式記錄運動的 iPhone 捷徑

目標：讓用戶用無圖片的 emoji 選單（先類別、再動作、再預設數值）點選，然後把一筆 JSON 運動記錄 POST 到 bot 的 workout-webhook 例行程序；該程序會寫入用戶選定的運動存放處（Notion、記事簿 Page 的 CSV，或只存 CSV）。

1. 從記憶中的運動清單收集動作（若存放處是 Notion，亦用其選項的確切名稱）。問清楚用戶實際怎麼做每個動作：單臂與雙手版本要分開（例如「🤸 單臂推舉深蹲 Squat Press」與「🏋️ 雙手推舉深蹲 Thruster」——先深蹲再雙手推舉過頭，並非抓舉），避免用戶選了近似動作再在備註改正。在 bot 電腦保存 `exercises.json`：名稱、類別／選單分組、輸入類型（`time`、`distance_time`、`sets_reps`、`sets_seconds` 用於支撐與間歇、`rower` 含完成時間、`cadence` 用於原地慢跑）、MET、預設劑量。
2. 選單保持短而清楚：每項只有 emoji 加用戶語言與英文名稱（例如「🔔 擺盪 Swing」、「🏋️ 壺鈴 Kettlebell」）。做法說明不要放進選單，改放在獨立指南項（例如「📖 動作圖鑑 Guide」開啟記事簿的動作圖鑑）。類別名稱要短，選單提示用一兩個字（例如「記錄運動」、「強度」）。檢查沒有兩個選項標籤相同。
3. 讓用戶可改正誤點：每個子選單（類別與動作層）最後一項加「↩️ 返回」，用 Repeat 迴圈與目前畫面變數重開上一層。送出前顯示確認選單，標題為一行摘要（動作、重量、組×次或時間、強度），選項「✅ 送出」、「🔄 重選」（清空重來、不送出）、「❌ 取消」（不送出）。
4. 用 Python `plistlib` 產生二進位 plist 捷徑（`WFWorkflowActions` 列表）。常用動作：`is.workflow.actions.choosefrommenu`（選單，含 GroupingIdentifier 與控制流 0/1/2）、`is.workflow.actions.repeat.count`、`is.workflow.actions.conditional`、`is.workflow.actions.ask`（數字輸入）、`is.workflow.actions.gettext`、`is.workflow.actions.setvariable`、`is.workflow.actions.dictionary`（payload）、`is.workflow.actions.downloadurl`（POST JSON）。每個數字提供涵蓋用戶實際範圍的預設值（例如次數可到 30 及 50，以應付高次數壺鈴），另加「其他（自行輸入）」；可選欄位加「略過」。所有欄位以文字送出；略過則空字串。
5. Payload 欄位：exercise、category、date（當日 ISO 8601）、duration_min、distance_km、speed_kmh、incline_pct、resistance、distance_m、finish_time、weight_kg、sets、reps、cadence_spm、total_steps、intensity、notes。
6. 永不內嵌 webhook 網址或密鑰。保持空白，以匯入問題（`WFWorkflowImportQuestions`）填入，讓用戶安裝時自行貼上。
7. 簽署必須在 Mac 上進行。在用戶的 Mac 執行任何指令前，先清楚告訴對方會執行甚麼。然後把未簽署檔複製到用戶的 Mac，執行 `shortcuts sign --mode anyone --input <file> --output ~/Downloads/<name>-vN.shortcut`。使用新的版本化檔名；永不覆蓋或刪除舊版本。若 Mac 離線，說明並等候。把已簽署檔在對話中送給用戶，讓對方直接下載。
8. 用戶以 AirDrop 或開啟已簽署檔到 iPhone，回答匯入問題，並做一筆測試。確認 workout-webhook 例行程序已寫入用戶選定的存放處。
9. 日後新增動作：加入記憶（Notion 則先問用戶再加選項，因屬結構變更）、更新 `exercises.json`、更新 workout-webhook 的 MET 清單，並簽署新版本捷徑。
