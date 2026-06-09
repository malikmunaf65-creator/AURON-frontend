/**
 * Comprehensive UI translation dictionary for 10 tactical phonetic languages within AURON platform.
 * Supports complete system-wide translation including settings, tabs, labels, and options matrix.
 */

export interface TranslationDictionary {
  appName: string;
  tryDemo: string;
  navGrid: string;
  navUpload: string;
  navDemo: string;
  navResults: string;
  navIdentity: string;
  navCommand: string;
  navSettings: string;
  heroTitle: string;
  heroSubtitle: string;
  systemReady: string;
  vocalRecord: string;
  waveSandbox: string;
  uploadHeader: string;
  loginButton: string;
  signupButton: string;
  activeClearances: string;
  fieldAgent: string;
  researcher: string;
  commander: string;
  exitMatrix: string;
  autoSavedMsg: string;
  optionsMatrix: string;

  // New keys for complete coverage
  accountTab: string;
  audioModelTab: string;
  appearanceTab: string;
  notificationsTab: string;
  securityTab: string;
  usageBillingTab: string;
  saveChanges: string;
  systemMatrix: string;
  timezoneLabel: string;
  languageLabel: string;
  micInputLabel: string;
  sampleRateLabel: string;
  modelSelectorLabel: string;
  confidenceLabel: string;
  noiseCancelLabel: string;
  autoPredictLabel: string;
  gridOverlayLabel: string;
  dynamicLightingLabel: string;
  hapticFeedbackLabel: string;
}

export const TRANSLATIONS: Record<string, TranslationDictionary> = {
  "English (US)": {
    appName: "AURON AI",
    tryDemo: "Try Live Demo",
    navGrid: "System Grid",
    navUpload: "Bulk Upload",
    navDemo: "Wave Sandbox",
    navResults: "Results Map",
    navIdentity: "Identity Deck",
    navCommand: "Command Center",
    navSettings: "Options",
    heroTitle: "DECRYPTION MATRIX ACTIVE",
    heroSubtitle: "Acoustic Intelligence Auditory Protocol",
    systemReady: "Systems Online & Calibrated",
    vocalRecord: "Initiate Voice Capture",
    waveSandbox: "Visual Waveform Decoder",
    uploadHeader: "Acoustic File Upload",
    loginButton: "Agent Login",
    signupButton: "Security Registration",
    activeClearances: "System Authorization Classifications",
    fieldAgent: "Field Agent",
    researcher: "Researcher",
    commander: "Commander",
    exitMatrix: "Exit Option Matrix",
    autoSavedMsg: "Configuration Auto-saved",
    optionsMatrix: "Options Matrix",
    accountTab: "Account Node",
    audioModelTab: "Audio & Model",
    appearanceTab: "Appearance",
    notificationsTab: "Notifications",
    securityTab: "Security",
    usageBillingTab: "Usage & Billing",
    saveChanges: "Save Telemetry Setup",
    systemMatrix: "SYSTEM MATRIX",
    timezoneLabel: "System Timezone Vector",
    languageLabel: "App UI Language Settings",
    micInputLabel: "System Microphone Input Gain",
    sampleRateLabel: "Spectrogram Sample Rate Selection",
    modelSelectorLabel: "Active Deep Learning Model Vector",
    confidenceLabel: "Minimum Signal Confidence Matrix",
    noiseCancelLabel: "Enable Noise Cancellation Signal Filter",
    autoPredictLabel: "Real-time Auditory Prediction Sync",
    gridOverlayLabel: "Toggle System Precision Grid Overlay",
    dynamicLightingLabel: "Enable Spectrogram Dynamic Lighting",
    hapticFeedbackLabel: "Tactical Haptic Interface Feedback"
  },
  "Greek (Classical)": {
    appName: "ΑΥΡΩΝ AI",
    tryDemo: "Πείραμα Δείγματος",
    navGrid: "Σύστημα Πλέγματος",
    navUpload: "Μαζική Μεταφόρτωση",
    navDemo: "Ψηφιακή Άμμος",
    navResults: "Χάρτης Αποτελεσμάτων",
    navIdentity: "Ταυτότητα Πράκτορος",
    navCommand: "Κέντρο Διοίκησης",
    navSettings: "Επιλογές",
    heroTitle: "ΜΗΤΡΑ ΑΠΟΚΡΥΠΤΟΓΡΑΦΗΣΗΣ ΕΝΕΡΓΗ",
    heroSubtitle: "Ακουστικό Πρωτόκολλο Νοημοσύνης",
    systemReady: "Συστήματα Έτοιμα και Βαθμονομημένα",
    vocalRecord: "Έναρξη Φωνητικής Καταγραφής",
    waveSandbox: "Οπτικός Αποκωδικοποιητής Κυμάτων",
    uploadHeader: "Μεταφόρτωση Ακουστικού Αρχείου",
    loginButton: "Είσοδος Πράκτορος",
    signupButton: "Εγγραφή Ασφαλείας",
    activeClearances: "Ταξινομήσεις Εξουσιοδότησης Συστήματος",
    fieldAgent: "Πράκτορας Πεδίου",
    researcher: "Ερευνητής",
    commander: "Διοικητής",
    exitMatrix: "Έξοδος Πλέγματος Επιλογών",
    autoSavedMsg: "Αυτόματη Αποθήκευση Ρυθμίσεων",
    optionsMatrix: "Μήτρα Επιλογών",
    accountTab: "Κόμβος Λογαριασμού",
    audioModelTab: "Ήχος & Ακουστικό Μοντέλο",
    appearanceTab: "Εμφάνιση & Διάκοσμος",
    notificationsTab: "Ειδοποιήσεις & Σήματα",
    securityTab: "Ασφάλεια Ταυτότητας",
    usageBillingTab: "Χρήση & Χρέωση Πλέγματος",
    saveChanges: "Αποθήκευση Ρυθμίσεων",
    systemMatrix: "ΜΗΤΡΑ ΣΥΣΤΗΜΑΤΟΣ",
    timezoneLabel: "Ημερολογιακό Διάνυσμα Ζώνης Ώρας",
    languageLabel: "Ρυθμίσεις Γλώσσας Διεπαφής",
    micInputLabel: "Ρύθμιση Έντασης Μικροφώνου",
    sampleRateLabel: "Ρυθμός Δειγματοληψίας Φάσματος",
    modelSelectorLabel: "Ενεργό Μοντέλο Νευρωνικού Δικτύου",
    confidenceLabel: "Ελάχιστο Όριο Εμπιστοσύνης Σήματος",
    noiseCancelLabel: "Φίλτρο Ακύρωσης Θορύβου Σήματος",
    autoPredictLabel: "Αυτόματος Συγχρονισμός Πρόβλεψης",
    gridOverlayLabel: "Εμφάνιση Πλέγματος Ακριβείας",
    dynamicLightingLabel: "Δυναμικός Φωτισμός Φασματογραφήματος",
    hapticFeedbackLabel: "Απτική Ανάδραση Διεπαφής"
  },
  "Spanish (Castilian)": {
    appName: "AURON AI",
    tryDemo: "Ver Demostración",
    navGrid: "Red del Sistema",
    navUpload: "Carga Masiva",
    navDemo: "Prueba de Ondas",
    navResults: "Resultados",
    navIdentity: "Identidad",
    navCommand: "Centro de Comando",
    navSettings: "Ajustes",
    heroTitle: "MATRIZ DE DECRIPCIÓN ACTIVA",
    heroSubtitle: "Protocolo de Inteligencia Acústica",
    systemReady: "Sistemas Activos y Calibrados",
    vocalRecord: "Iniciar Captura de Voz",
    waveSandbox: "Decodificador Visual de Ondas",
    uploadHeader: "Carga de Archivo Acústico",
    loginButton: "Ingreso de Agente",
    signupButton: "Registro de Seguridad",
    activeClearances: "Clasificaciones de Autorización",
    fieldAgent: "Agente de Campo",
    researcher: "Investigador",
    commander: "Comandante",
    exitMatrix: "Salir de Matriz de Opciones",
    autoSavedMsg: "Configuración Auto-guardada",
    optionsMatrix: "Matriz de Opciones",
    accountTab: "Nodo de Cuenta",
    audioModelTab: "Audio y Modelos",
    appearanceTab: "Apariencia Visual",
    notificationsTab: "Notificaciones y Alertas",
    securityTab: "Seguridad y Accesos",
    usageBillingTab: "Uso y Facturación",
    saveChanges: "Guardar Parámetros de Telemetría",
    systemMatrix: "MATRIZ DE SISTEMA",
    timezoneLabel: "Vector de Zona Horaria",
    languageLabel: "Idioma de la Interfaz",
    micInputLabel: "Ganancia del Micrófono",
    sampleRateLabel: "Tasa de Muestreo de Audio",
    modelSelectorLabel: "Modelo de Inteligencia Activo",
    confidenceLabel: "Umbral de Confianza Mínimo",
    noiseCancelLabel: "Filtro de Cancelación de Ruido",
    autoPredictLabel: "Predicción Acústica en Tiempo Real",
    gridOverlayLabel: "Alternar Cuadrícula de Precisión",
    dynamicLightingLabel: "Iluminación Dinámica del Espectro",
    hapticFeedbackLabel: "Retroalimentación Háptica Táctica"
  },
  "French (Parisian)": {
    appName: "AURON AI",
    tryDemo: "Essayer la Démo",
    navGrid: "Réseau Système",
    navUpload: "Import en Masse",
    navDemo: "Visualisateur d'Ondes",
    navResults: "Carte des Résultats",
    navIdentity: "Dossier Agent",
    navCommand: "Poste de Commandement",
    navSettings: "Options",
    heroTitle: "MATRICE DE DÉCRYPTAGE ACTIVE",
    heroSubtitle: "Protocole d'Intelligence Acoustique",
    systemReady: "Systèmes En Ligne & Calibrés",
    vocalRecord: "Démarrer la Capture Vocale",
    waveSandbox: "Décodeur d'Ondes Visuel",
    uploadHeader: "Téléversement de Fichier Sonore",
    loginButton: "Connexion Agent",
    signupButton: "Enregistrement Sécurisé",
    activeClearances: "Classifications d'Autorisation",
    fieldAgent: "Agent de Terrain",
    researcher: "Chercheur",
    commander: "Commandant",
    exitMatrix: "Quitter la Matrice d'Options",
    autoSavedMsg: "Configuration Enregistrée",
    optionsMatrix: "Matrice d'Options",
    accountTab: "Nœud de Compte",
    audioModelTab: "Audio & Modèles",
    appearanceTab: "Apparence & Thème",
    notificationsTab: "Alertes & Signaux",
    securityTab: "Sécurité & Clés",
    usageBillingTab: "Utilisation & Coût Matrix",
    saveChanges: "Enregistrer la Télémétrie",
    systemMatrix: "MATRICE DU SYSTÈME",
    timezoneLabel: "Vecteur Fuseau Horaire",
    languageLabel: "Langue de l'Interface utilisateur",
    micInputLabel: "Gain Principal du Micro",
    sampleRateLabel: "Taux de Muestreo Acoustique",
    modelSelectorLabel: "Modèle de Réseau Actif",
    confidenceLabel: "Seuil de Signal de Confiance",
    noiseCancelLabel: "Filtre Anti-Bruit Actif",
    autoPredictLabel: "Sincronisation de Prédiction en Temps Réel",
    gridOverlayLabel: "Activer la Grille de Précision",
    dynamicLightingLabel: "Éclairage Dynamique du Spectre",
    hapticFeedbackLabel: "Retour Tactile Haptique"
  },
  "German (Berlin Core)": {
    appName: "AURON AI",
    tryDemo: "Demo Starten",
    navGrid: "Systemgitter",
    navUpload: "Massen-Upload",
    navDemo: "Wellen-Sandbox",
    navResults: "Ergebnisse",
    navIdentity: "Agenten-Deck",
    navCommand: "Kommandozentrale",
    navSettings: "Optionen",
    heroTitle: "ENTSCHLÜSSELUNGSMATRIX AKTIV",
    heroSubtitle: "Akustisches Intelligenzprotokoll",
    systemReady: "Systeme Online & Kalibriert",
    vocalRecord: "Sprachaufnahme Starten",
    waveSandbox: "Visueller Wellendecoder",
    uploadHeader: "Audiodatei Hochladen",
    loginButton: "Agenten-Login",
    signupButton: "Sicherheitsregistrierung",
    activeClearances: "Systemfreigabeklassen",
    fieldAgent: "Feldagent",
    researcher: "Forscher",
    commander: "Kommandant",
    exitMatrix: "Optionen verlassen",
    autoSavedMsg: "Einstellungen auto-gespeichert",
    optionsMatrix: "Optionen-Matrix",
    accountTab: "Konto-Knoten",
    audioModelTab: "Audio- & Sprachmodelle",
    appearanceTab: "Visuelles Design",
    notificationsTab: "Meldungen & Signale",
    securityTab: "Identitätsschutz",
    usageBillingTab: "Nutzungsverlauf & Abrechnung",
    saveChanges: "Einstellungen Festlegen",
    systemMatrix: "SYSTEM-MATRIX",
    timezoneLabel: "System-Zeitzonenvektor",
    languageLabel: "Systemsprache Einstellen",
    micInputLabel: "Hauptmikrofon-Pegel",
    sampleRateLabel: "Audiodaten-Abtastrate",
    modelSelectorLabel: "Aktives Lernmodell-Vektor",
    confidenceLabel: "Signal-Mindestkonfidenzwert",
    noiseCancelLabel: "Rauschunterdrückungsfilter Aktivieren",
    autoPredictLabel: "Echtzeit-Sprachvorhersage Synchr.",
    gridOverlayLabel: "Präzisionsgitter Anzeigen",
    dynamicLightingLabel: "Dynamisches Spektrogramm-Licht",
    hapticFeedbackLabel: "Taktiles Vibrationsfeedback"
  },
  "Japanese (Neo-Tokyo)": {
    appName: "オーロン AI",
    tryDemo: "デモを試す",
    navGrid: "システムグリッド",
    navUpload: "一括アップロード",
    navDemo: "ウェーブボックス",
    navResults: "分析結果マップ",
    navIdentity: "捜査官データ",
    navCommand: "指令室",
    navSettings: "設定項目",
    heroTitle: "暗号解読マトリクス起動中",
    heroSubtitle: "音響インテリジェンス・プロトコル",
    systemReady: "全システム同調・調整完了",
    vocalRecord: "音声キャプチャ開始",
    waveSandbox: "視覚的波形デコーダー",
    uploadHeader: "音響データ読み込み",
    loginButton: "エージェントログイン",
    signupButton: "セキュリティ登録",
    activeClearances: "システム認可権限クラス",
    fieldAgent: "フィールドエージェント",
    researcher: "研究員",
    commander: "司令官",
    exitMatrix: "マトリクス設定を終了",
    autoSavedMsg: "自動同期が完了しました",
    optionsMatrix: "オプショナルクラスマトリクス",
    accountTab: "アカウント情報",
    audioModelTab: "音響・モデル設定",
    appearanceTab: "画面外観テーマ",
    notificationsTab: "シグナルと通知設定",
    securityTab: "セキュリティ機密保護",
    usageBillingTab: "利用状況とライセンス",
    saveChanges: "全テレメトリ保存同期",
    systemMatrix: "システム・マトリクス",
    timezoneLabel: "システム・タイムゾーン同期",
    languageLabel: "インターフェース表示言語設定",
    micInputLabel: "マイク入力受信感度(ゲイン)",
    sampleRateLabel: "周波数スペクトラム・サンプリング周波数",
    modelSelectorLabel: "実行中深層学習AIモデル選択",
    confidenceLabel: "応答解析・最低信頼度閾値",
    noiseCancelLabel: "周波数ノイズリダクション回路",
    autoPredictLabel: "リアルタイム自動応答予測同期",
    gridOverlayLabel: "精密アライメントグリッドの表示",
    dynamicLightingLabel: "スペクトログラム動的発光演出",
    hapticFeedbackLabel: "触覚ハプティック振動機能"
  },
  "Latin (Imperator)": {
    appName: "AURON AI",
    tryDemo: "Specimen Probare",
    navGrid: "Nodum Systematis",
    navUpload: "Magnus Influxus",
    navDemo: "Venae Undarum",
    navResults: "Tabula Eventuum",
    navIdentity: "Charta Agentis",
    navCommand: "Arx Imperii",
    navSettings: "Optiones",
    heroTitle: "VALVA DECRYPTORIS VIGENS",
    heroSubtitle: "Auditus Intelligentiae Regulae",
    systemReady: "Instrumenta Accurata Parataque",
    vocalRecord: "Vocis Cursum Inire",
    waveSandbox: "Interpretator Undarum Visualis",
    uploadHeader: "Vocabulum Sound Transfere",
    loginButton: "Intrare Agentem",
    signupButton: "Inscribere Custodiam",
    activeClearances: "Ordines Permissuum Systematis",
    fieldAgent: "Miles Militaris",
    researcher: "Discipulus",
    commander: "Imperator",
    exitMatrix: "Exire Valvam Optionum",
    autoSavedMsg: "Forma Conservata Ipsa",
    optionsMatrix: "Valva Optionum",
    accountTab: "Nodus Rationis",
    audioModelTab: "Sonus & Regulae",
    appearanceTab: "Forma Visualis",
    notificationsTab: "Notitia & Nuntii",
    securityTab: "Securitas & Custodia",
    usageBillingTab: "Usus & Census",
    saveChanges: "Conservare Optiones Speculati",
    systemMatrix: "SYSTEMA MATRIX",
    timezoneLabel: "Zona Temporalis Systematica",
    languageLabel: "Linguam Utilis Arbitrium",
    micInputLabel: "Vocis Receptoris Vigor Gain",
    sampleRateLabel: "Decimatio Speculativa Undarum",
    modelSelectorLabel: "Vigilis Intellectus Machinae Vector",
    confidenceLabel: "Limen Fiduciae Frequentialis",
    noiseCancelLabel: "Excludere Turbas et Radios Sonis",
    autoPredictLabel: "Providentia Vox Realis Chronos",
    gridOverlayLabel: "Adhibere Formam Linearem Lineolarum",
    dynamicLightingLabel: "Lumen Lucidus Spectro Dynamicum",
    hapticFeedbackLabel: "Tactus Mechanicus Interface"
  },
  "Sanskrit (Vedic Grid)": {
    appName: "औरॉन AI",
    tryDemo: "यन्त्र प्रयोगः",
    navGrid: "तन्त्र ग्रिड",
    navUpload: "सञ्चय भारण",
    navDemo: "तरङ्ग क्रीडा",
    navResults: "परिणाम मानचित्रम्",
    navIdentity: "दूत परिचयः",
    navCommand: "महान् निर्देशकः",
    navSettings: "विकल्पाः",
    heroTitle: "गूढार्थ कोष्ठकः सक्रियः",
    heroSubtitle: "ध्वनि बुद्धिमत्ता नियमावली",
    systemReady: "तन्त्रम् जाग्रतम् संशोधितम् च",
    vocalRecord: "वाक् ग्रहणम् आरभत",
    waveSandbox: "तरङ्ग दर्शक यन्त्रम्",
    uploadHeader: "ध्वनि सञ्चिका संकलनम्",
    loginButton: "दूत प्रवेशः",
    signupButton: "सुरक्षा पञ्जीकरणम्",
    activeClearances: "तन्त्र नियन्त्रण श्रेणयः",
    fieldAgent: "क्षेत्र दूत",
    researcher: "गवेषकः",
    commander: "सेनानायकः",
    exitMatrix: "विकल्प कोष्ठक बहिर्गमनम्",
    autoSavedMsg: "स्वयं सञ्चितः विकल्पः",
    optionsMatrix: "विकल्प कोष्ठकः",
    accountTab: "खाता केन्द्रम्",
    audioModelTab: "ध्वनिः रूपकम् च",
    appearanceTab: "सौन्दर्य विधानम्",
    notificationsTab: "संकेत सूचकाः",
    securityTab: "गुप्तता नियंत्रणम्",
    usageBillingTab: "उपयोगः तथा शुल्क संग्रहः",
    saveChanges: "यन्त्र व्यवस्था रक्षणम्",
    systemMatrix: "सिस्टम मैट्रिक्स",
    timezoneLabel: "समय मंडल व्यवस्था",
    languageLabel: "मुख्य भाषा निर्धारणम्",
    micInputLabel: "भाषा सूक्ष्म-तरङ्ग संग्रहकः",
    sampleRateLabel: "तरङ्ग आवृत्ति द्योतकता",
    modelSelectorLabel: "सक्रिय कृत्रिमबुद्धि मॉडलम्",
    confidenceLabel: "न्यूनतम ध्वनि सामर्थ्य मूल्य",
    noiseCancelLabel: "कोलाहल निवारक संकेत शुद्धीकरणम्",
    autoPredictLabel: "कालक्रमानुसार ध्वनि अनुमान प्रक्रिया",
    gridOverlayLabel: "त्रुटि-रहित ग्रिड व्यवस्था",
    dynamicLightingLabel: "तरङ्ग प्रखर प्रकाश किरणम्",
    hapticFeedbackLabel: "अंगुलि कम्पन प्रतिक्रिया"
  },
  "Mandarin (Dragon Matrix)": {
    appName: "奥朗智能 AI",
    tryDemo: "实时测试演示",
    navGrid: "系统矩阵",
    navUpload: "批量解析",
    navDemo: "波形沙盒",
    navResults: "诊测报告",
    navIdentity: "探员特征卡",
    navCommand: "指挥中心",
    navSettings: "选项设定",
    heroTitle: "解码矩阵完全激活",
    heroSubtitle: "声学情报分析解密协议",
    systemReady: "全域系统在线且完成校准",
    vocalRecord: "启动音频传感器捕捉",
    waveSandbox: "波形谱频可视化分析仪",
    uploadHeader: "载入极频声波原件",
    loginButton: "特工授权登入",
    signupButton: "特权准入注册",
    activeClearances: "系统网格机密等级授权",
    fieldAgent: "外勤探员",
    researcher: "科研院士",
    commander: "军区司令官",
    exitMatrix: "退出配置矩阵",
    autoSavedMsg: "系统配置已被安全自动保存",
    optionsMatrix: "配置矩阵",
    accountTab: "主要特工账号",
    audioModelTab: "声频采样与神经网络",
    appearanceTab: "矩阵可视化外观调节",
    notificationsTab: "实时警报与信号通知",
    securityTab: "系统防线与令牌设置",
    usageBillingTab: "数据用量及授权支付",
    saveChanges: "保存并校准遥测信号",
    systemMatrix: "全域系统控制矩阵",
    timezoneLabel: "系统地理时区校准矢量",
    languageLabel: "显示界面核心语系方案",
    micInputLabel: "麦克风捕捉增益振幅调节",
    sampleRateLabel: "声学频谱图物理采样率设定",
    modelSelectorLabel: "活动端深度神经网络决策实体",
    confidenceLabel: "声波分类推断的最小置信限制",
    noiseCancelLabel: "启用神经网络有源噪声滤除算法",
    autoPredictLabel: "极高速动态声波流音位预测同步",
    gridOverlayLabel: "在矩阵面板上覆盖精密刻度辅助网格",
    dynamicLightingLabel: "启用时变声波谱动态荧光炫渲染设计",
    hapticFeedbackLabel: "机械物理振动与触觉响应反馈开关"
  },
  "Italian (Milano Node)": {
    appName: "AURON AI",
    tryDemo: "Prova la Demo",
    navGrid: "Rete di Sistema",
    navUpload: "Caricamento Multiplo",
    navDemo: "Sandbox delle Onde",
    navResults: "Mappa Risultati",
    navIdentity: "Profilo Agente",
    navCommand: "Centro di Comando",
    navSettings: "Opzioni",
    heroTitle: "MATRICE DI DECRIPTAZIONE ATTIVA",
    heroSubtitle: "Protocollo di Intelligenza Acustica",
    systemReady: "Sistemi in Linea e Calibrati",
    vocalRecord: "Avvia Cattura Vocale",
    waveSandbox: "Decodificatore Onde Visivo",
    uploadHeader: "Carica File Acustico",
    loginButton: "Accesso Agente",
    signupButton: "Registrazione Sicura",
    activeClearances: "Classificazioni di Autorizzazione",
    fieldAgent: "Agente di Campo",
    researcher: "Ricercatore",
    commander: "Comandante",
    exitMatrix: "Esci dalla Matrice Opzioni",
    autoSavedMsg: "Configurazione Salvata Automaticamente",
    optionsMatrix: "Matrice Opzioni",
    accountTab: "Nodo Account",
    audioModelTab: "Audio & Modelli",
    appearanceTab: "Aspetto Grafico",
    notificationsTab: "Segnali & Notifiche",
    securityTab: "Misure di Sicurezza",
    usageBillingTab: "Consumo & Fatturazione",
    saveChanges: "Configura Parametri Telemetria",
    systemMatrix: "MATRICE DI SISTEMA",
    timezoneLabel: "Vettore Fuso Orario Comune",
    languageLabel: "Lingua UI dell'Applicazione",
    micInputLabel: "Guadagno in Ingresso del Microfono",
    sampleRateLabel: "Frequenza Campionamento Spettro",
    modelSelectorLabel: "Vettore Modello di Riconoscimento",
    confidenceLabel: "Soglia Minima Attendibilità Segnale",
    noiseCancelLabel: "Filtro Attivo di Soppressione Rumore",
    autoPredictLabel: "Sincronia Predittiva in Tempo Reale",
    gridOverlayLabel: "Mostra Griglia Spettrale di Precisione",
    dynamicLightingLabel: "Effetto di Illuminazione Dinamica",
    hapticFeedbackLabel: "Feedback Tattile dell'Interfaccia"
  }
};

/**
 * Accessor to fetch localized string based on configured language parameter
 */
export function getTranslatedUI(key: keyof TranslationDictionary, langOverride?: string): string {
  const activeLang = langOverride || getActiveLanguageKey();
  const dict = TRANSLATIONS[activeLang] || TRANSLATIONS["English (US)"];
  return dict[key] || TRANSLATIONS["English (US)"][key] || String(key);
}

/**
 * Retrieves normalized language key cached inside LocalStorage
 */
export function getActiveLanguageKey(): string {
  try {
    const val = localStorage.getItem("auron_language");
    if (val && TRANSLATIONS[val]) {
      return val;
    }
  } catch {}
  return "English (US)";
}

/**
 * Intelligent general text translator designed to replace static phrases dynamically.
 * Helps translate any labels, paragraphs, buttons, or logs anywhere across the whole app.
 */
export function t(text: string, langOverride?: string): string {
  const lang = langOverride || getActiveLanguageKey();
  if (lang === "English (US)") {
    return text;
  }

  // Exact matches
  const textClean = text.trim();
  const dict = TRANSLATIONS[lang] || TRANSLATIONS["English (US)"];

  const mapping: Record<string, string> = {
    // Navigation & Tabs
    "Home": dict.navGrid,
    "System Grid": dict.navGrid,
    "Upload": dict.navUpload,
    "Bulk Upload": dict.navUpload,
    "Demo": dict.navDemo,
    "Wave Sandbox": dict.navDemo,
    "Results": dict.navResults,
    "Results Map": dict.navResults,
    "My Identity": dict.navIdentity,
    "Identity Deck": dict.navIdentity,
    "Command Center": dict.navCommand,
    "Options": dict.navSettings,
    "SYSTEM MATRIX": dict.systemMatrix,
    "Signup Portal": dict.signupButton,
    "Security Registration": dict.signupButton,
    "Agent Login": dict.loginButton,
    "Login": dict.loginButton,
    "Exit Option Matrix": dict.exitMatrix,
    "Options Matrix": dict.optionsMatrix,

    // Settings tabs
    "Account": dict.accountTab,
    "Account Node": dict.accountTab,
    "Audio & Model": dict.audioModelTab,
    "Audio & Acoustic Models": dict.audioModelTab,
    "Appearance": dict.appearanceTab,
    "Appearance Matrix": dict.appearanceTab,
    "Notifications": dict.notificationsTab,
    "Notifications & Signals": dict.notificationsTab,
    "Security": dict.securityTab,
    "Security Protocol": dict.securityTab,
    "Billing": dict.usageBillingTab,
    "Usage & Billing": dict.usageBillingTab,
    "Usage & Matrix Billing": dict.usageBillingTab,

    // General settings fields & labels
    "System Timezone Vector": dict.timezoneLabel,
    "App UI Language Settings": dict.languageLabel,
    "Phonetic Language Paradigm": dict.vocalRecord, // fallback dynamic label
    "System Microphone Input Gain": dict.micInputLabel,
    "Spectrogram Sample Rate Selection": dict.sampleRateLabel,
    "Active Deep Learning Model Vector": dict.modelSelectorLabel,
    "Minimum Signal Confidence Matrix": dict.confidenceLabel,
    "Enable Noise Cancellation Signal Filter": dict.noiseCancelLabel,
    "Real-time Auditory Prediction Sync": dict.autoPredictLabel,
    "Toggle System Precision Grid Overlay": dict.gridOverlayLabel,
    "Enable Spectrogram Dynamic Lighting": dict.dynamicLightingLabel,
    "Tactical Haptic Interface Feedback": dict.hapticFeedbackLabel,
    "Save Telemetry Setup": dict.saveChanges,
    "Save All Changes": dict.saveChanges,

    // Common labels
    "Try Live Demo": dict.tryDemo,
    "Field Agent": dict.fieldAgent,
    "Researcher": dict.researcher,
    "Commander": dict.commander,
    "System Authorization Classifications": dict.activeClearances,
    "Systems Online & Calibrated": dict.systemReady,
    "Initiate Voice Capture": dict.vocalRecord,
    "Processing Vector": dict.vocalRecord,

    // Footer items
    "About Us": lang === "Greek (Classical)" ? "Σχετικά με εμάς" : lang === "Spanish (Castilian)" ? "Sobre Nosotros" : lang === "French (Parisian)" ? "À Propos" : lang === "German (Berlin Core)" ? "Über Uns" : lang === "Japanese (Neo-Tokyo)" ? "会社概要" : lang === "Mandarin (Dragon Matrix)" ? "关于我们" : lang === "Italian (Milano Node)" ? "Chi Siamo" : "About Us",
    "Contact Nodes": lang === "Greek (Classical)" ? "Κόμβοι Επικοινωνίας" : lang === "Spanish (Castilian)" ? "Nodos de Contacto" : lang === "French (Parisian)" ? "Noeuds de Contact" : lang === "German (Berlin Core)" ? "Kontaktknoten" : lang === "Japanese (Neo-Tokyo)" ? "お問い合わせ" : lang === "Mandarin (Dragon Matrix)" ? "联络节点" : lang === "Italian (Milano Node)" ? "Nodi di Contatto" : "Contact Nodes",
    "Privacy & Terms": lang === "Greek (Classical)" ? "Απόρρητο & Όροι" : lang === "Spanish (Castilian)" ? "Privacidad y Términos" : lang === "French (Parisian)" ? "Confidentialité & Conditions" : lang === "German (Berlin Core)" ? "Datenschutz & Nutzungsbedingungen" : lang === "Japanese (Neo-Tokyo)" ? "利用規約とプライバシー" : lang === "Mandarin (Dragon Matrix)" ? "隐私及条款" : lang === "Italian (Milano Node)" ? "Privacy e Termini" : "Privacy & Terms"
  };

  if (mapping[textClean]) {
    return mapping[textClean];
  }

  // Common descriptive mapping fallbacks
  const lowerText = textClean.toLowerCase();
  if (lowerText.includes("timezone")) return dict.timezoneLabel;
  if (lowerText.includes("ui language")) return dict.languageLabel;
  if (lowerText.includes("microphone input")) return dict.micInputLabel;
  if (lowerText.includes("sample rate")) return dict.sampleRateLabel;
  if (lowerText.includes("model vector")) return dict.modelSelectorLabel;
  if (lowerText.includes("confidence threshold")) return dict.confidenceLabel;
  if (lowerText.includes("noise cancellation")) return dict.noiseCancelLabel;
  if (lowerText.includes("auditory prediction")) return dict.autoPredictLabel;
  if (lowerText.includes("grid overlay")) return dict.gridOverlayLabel;
  if (lowerText.includes("dynamic lighting")) return dict.dynamicLightingLabel;
  if (lowerText.includes("haptic")) return dict.hapticFeedbackLabel;

  // Fuzzy matches / Word substitutions
  let translated = text;
  const wordSubs: Record<string, string> = {
    "Singapore": lang === "Greek (Classical)" ? "Σιγκαπούρη" : lang === "Spanish (Castilian)" ? "Singapur" : lang === "Japanese (Neo-Tokyo)" ? "シンガポール" : lang === "Mandarin (Dragon Matrix)" ? "新加坡" : "Singapore",
    "March 2026": lang === "Greek (Classical)" ? "Μάρτιος 2026" : lang === "Spanish (Castilian)" ? "Marzo 2026" : lang === "French (Parisian)" ? "Mars 2026" : lang === "Japanese (Neo-Tokyo)" ? "2026年3月" : "March 2026",
    "Tokyo": lang === "Japanese (Neo-Tokyo)" ? "東京" : "Tokyo",
    "London": lang === "French (Parisian)" ? "Londres" : "London"
  };

  for (const [enWord, langWord] of Object.entries(wordSubs)) {
    if (translated.includes(enWord)) {
      translated = translated.replaceAll(enWord, langWord);
    }
  }

  return translated;
}
