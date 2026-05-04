/*
 * Genomic Identity System - Scientific Path Logic
 * Includes: Nutrigenomics, Stress Response, and Sports Physiology
 */

function toggleDetails(id) {
    const modal = document.getElementById('reportModal');
    const modalBody = document.getElementById('modalBody');
    const storedDNA = localStorage.getItem("userDNA");

    if (!storedDNA) {
        alert("Please generate DNA first on the main page.");
        return;
    }

    modalBody.innerHTML = ""; 
    const userDNA = storedDNA;

    if (id === 'diet') {
    // 1. حساب النسبة العلمية بناءً على الطفرات
    const nutritionGenes = ["AGTC", "TTCG", "GCTA", "TTCA", "TCF7", "FTO", "CCTA", "CTTG", "TAS2", "ALDH"];
    let riskCount = 0;
    nutritionGenes.forEach(gene => { if(userDNA.includes(gene)) riskCount++; });
    const efficiencyScore = 100 - (riskCount * 10);

    // 2. الهيدر الجديد: النسبة يسار والشرح يمين
    const introSection = document.createElement("div");
    introSection.style.cssText = "display: flex; align-items: flex-start; gap: 30px; margin-bottom: 40px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px;";
    
    introSection.innerHTML = 
        <div style="font-size: 3.5rem; font-weight: 800; color: #00f2fe; line-height: 1;">${efficiencyScore}%</div>
        <div style="text-align: left;">
            <h3 style="margin: 0; color: #f8fafc; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 1px;">Genetic Efficiency Score</h3>
            <p style="margin: 10px 0 0; color: #94a3b8; font-size: 0.95rem; line-height: 1.6;">
                This metric quantifies your body's cellular capacity to absorb and utilize essential nutrients. 
                A score of ${efficiencyScore}% reflects your unique metabolic pathways influenced by ${nutritionGenes.length} genomic markers.
            </p>
        </div>
    ;
    modalBody.appendChild(introSection);

    // 3. دالة إضافة العناصر (بدون أيقونات) - متل ما طلبتي بالظبط
    const addSimpleItem = (container, title, gene, result, advice, titleColor) => {
        const item = document.createElement("div");
        item.style.cssText = margin-bottom: 25px; padding-left: 15px; border-left: 2px solid ${titleColor}44;;
        
        const isNormal = result.includes("Normal")  result.includes("Efficient")  result.includes("Tolerant");
        const resColor = isNormal ? "#2dd4bf" : "#ef4444";

        item.innerHTML = 
            <div style="color: ${titleColor}; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">${title}</div>
            <div style="color: rgba(248, 250, 252, 0.5); font-size: 0.85rem; margin-bottom: 6px;">Gene ID: ${gene}</div>
            <div style="color: #f8fafc; font-size: 0.95rem; margin-bottom: 4px;">Result: <span style="color: ${resColor}; font-weight: bold;">${result}</span></div>
            <div style="color: #94a3b8; font-size: 0.85rem; font-style: italic;">Advice: ${advice}</div>
        ;
        container.appendChild(item);
    };

    // 4. عرض الفيتامينات (بشكل بسيط)
    addHeader(modalBody, "Vitamins & Supplements", "#4ade80");
    addSimpleItem(modalBody, "Vitamin D Absorption", "VDR", userDNA.includes("AGTC") ? "Reduced Absorption" : "Normal", "Maintain moderate sun exposure.", "#4ade80");
    addSimpleItem(modalBody, "Vitamin B12 Levels", "FUT2", userDNA.includes("TTCG") ? "Tendency for Deficiency" : "Normal", "Focus on B12-rich foods.", "#4ade80");
    addSimpleItem(modalBody, "Vitamin A Conversion", "BCO1", userDNA.includes("GCTA") ? "Reduced Efficiency" : "Normal", "Include pre-formed Vitamin A.", "#4ade80");

    // 5. عرض النقاط السبعة (المعالجة الغذائية)
    addHeader(modalBody, "Nutritional Processing", "#d4af37");
    addSimpleItem(modalBody, "Sodium Sensitivity", "ACE", userDNA.includes("TTCA") ? "Salt Sensitive" : "Normal Response", "Limit salt intake to protect heart health.", "#d4af37");
    addSimpleItem(modalBody, "Sugar Processing", "TCF7L2", userDNA.includes("TCF7") ? "High Spiking Risk" : "Efficient Processing", "Focus on complex carbs and fiber.", "#d4af37");
    addSimpleItem(modalBody, "Fat Breakdown", "FTO", userDNA.includes("FTO") ? "Slower Breakdown" : "Efficient Breakdown", "Limit saturated fats.", "#d4af37");
    addSimpleItem(modalBody, "Caffeine Metabolism", "CYP1A2", userDNA.includes("CCTA") ? "Slow Metabolizer" : "Fast Metabolizer", "Avoid caffeine after 2 PM.", "#d4af37");
    addSimpleItem(modalBody, "Lactose Tolerance", "MCM6", userDNA.includes("CTTG") ? "Lactose Intolerant" : "Lactose Tolerant", "Try lactose-free alternatives.", "#d4af37");
    addSimpleItem(modalBody, "Bitter Perception", "TAS2R38", userDNA.includes("TAS2") ? "Super Taster" : "Normal Taster", "Sensitive to bitter greens.", "#d4af37");
    addSimpleItem(modalBody, "Alcohol Metabolism", "ALDH2", userDNA.includes("ALDH") ? "Slow Breakdown" : "Normal Response", "Avoid alcohol to prevent toxin buildup.", "#d4af37");

    modal.style.display = "block";
}















    else if (id === 'stress') {
        addHeader(modalBody, "Stress Response Analysis", "#818cf8");
        addReportItem(modalBody, "Stress Handling Style", "COMT", userDNA.includes("GAAA") ? "Worrier (Slow COMT)" : "Warrior (Fast COMT)", "Practice mindfulness.", "fas fa-brain");
        addReportItem(modalBody, "Emotional Reactivity", "MAOA", userDNA.includes("CCTG") ? "Highly Reactive" : "Balanced Response", "Fast emotional response.", "fas fa-bolt");
        modal.style.display = "block";
    }
    // تأكدي إن الـ HTML فيه كلمة 'sports' مو 'fitness'
    else if (id === 'sports' || id === 'fitness') {
        analyzeSports(userDNA, modalBody);
        modal.style.display = "block";
    }
    // --- 4. كرت النوم والساعة البيولوجية (Sleep Card) ---
    else if (id === 'sleep') {
        analyzeSleep(userDNA, modalBody);
        modal.style.display = "block";
    }
    // --- 5. كرت البشرة والجمال (Skin Card) ---
    else if (id === 'skin') {
        analyzeSkin(userDNA, modalBody);
        modal.style.display = "block";
    }
    // --- 6. كرت السمات الإدراكية (Cognitive Card) ---
    else if (id === 'cognitive') {
        analyzeCognitive(userDNA, modalBody);
        modal.style.display = "block";
    }
}

function analyzeSports(dna, container) {
    addHeader(container, "Sports Physiology Report", "#2dd4bf");

    const powerScore = (dna.match(/RR/g) || []).length;
    const enduranceScore = (dna.match(/XX/g) || []).length;
    const muscleRes = powerScore > enduranceScore ? "Fast-Twitch (Power focus)" : "Slow-Twitch (Endurance focus)";
    const muscleAdv = powerScore > enduranceScore ? "Focus on explosive training." : "Focus on steady-state cardio.";
    addReportItem(container, "Muscle Fiber Type", "ACTN3", muscleRes, muscleAdv, "fas fa-bolt");

    const isFastRec = dna.includes("GGAA") || dna.includes("CC");
    const recRes = isFastRec ? "Fast Recovery" : "Slow Recovery";
    const recAdv = isFastRec ? "High frequency allowed." : "Requires 48h rest between sessions.";
    addReportItem(container, "Recovery Speed", "IL-6", recRes, recAdv, "fas fa-battery-full");

    const isHighVO2 = dna.includes("TT")  ||(dna.match(/A/g) || []).length > 15;
    addReportItem(container, "Aerobic Capacity", "NFIA", isHighVO2 ? "Exceptional VO2 Max" : "Normal Potential", "Benefits from HIIT training.", "fas fa-lungs");

    const isInjuryProne = dna.includes("TTAA") || dna.includes("GT");
    addReportItem(container, "Injury Risk", "COL5A1", isInjuryProne ? "Increased Risk" : "Robust Joint Structure", "Focus on mobility.", "fas fa-shield-alt");
}
function addHeader(container, text, color) {
    const h = document.createElement("h2");
    h.innerText = text;
    // استخدام التمبلت سترينج `` للستايل
    h.style.cssText = `color:${color}; font-size:1.3rem; margin-top:25px; margin-bottom:12px; border-bottom:1px solid ${color}; display:inline-block;`;
    container.appendChild(h);
}

function addReportItem(container, title, gene, result, advice, icon) {
    const div = document.createElement("div");
    
    const isRisk = result.includes("Reduced") || 
                   result.includes("Sensitive") || 
                   result.includes("Intolerant") || 
                   result.includes("Deficiency") || 
                   result.includes("Slow") || 
                   result.includes("Risk") || 
                   result.includes("High") || 
                   result.includes("Worrier");
    
    const statusColor = isRisk ? "#ef4444" : "#2dd4bf";
    
    div.style.cssText = `display:flex; align-items:center; margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px; border-left:5px solid ${statusColor};`;
    
    div.innerHTML = 
       ` <div style="font-size:1.8rem; margin-right:15px; color:${statusColor}; min-width:50px; text-align:center;">
            <i class="${icon}"></i>
        </div>
        <div>
            <h3 style="color:#f8fafc; font-size:1.1rem; margin:0;">${title}</h3>
            <p style="color:#94a3b8; font-size:0.9rem; margin:4px 0;">Gene: ${gene} | Result: <span style="color:${statusColor};">${result}</span></p>
            <p style="color:#cbd5e1; font-size:0.85rem; margin:0;">Advice: ${advice}</p>
        </div>
    ;`
    container.appendChild(div);
}

function closeModal() {
    document.getElementById('reportModal').style.display = "none";
}

window.onclick = function(event) {
    const m = document.getElementById('reportModal');
    if (event.target == m) m.style.display = "none";
};
/**
 * دالة تحليل النوم والساعة البيولوجية
 */
function analyzeSleep(dna, container) {
    addHeader(container, "Sleep & Circadian Rhythm Report", "#818cf8");

    // 1. النمط الزمني (Chronotype)
    const nightOwlGen = dna.includes("CC") || dna.includes("GG");
    addReportItem(container, "Chronotype", "CLOCK", 
        nightOwlGen ? "Night Owl (Evening Preference)" : "Early Bird (Morning Preference)", 
        "Plan your most creative tasks during your peak energy hours.", "fas fa-moon");

    // 2. استقلاب الكافيين وتأثيره على النوم
    const slowCaffeine = dna.includes("CCTA") || dna.includes("AA");
    addReportItem(container, "Caffeine & Sleep", "CYP1A2", 
        slowCaffeine ? "Slow Metabolism (High Impact)" : "Fast Metabolism (Low Impact)", 
        "Stop caffeine intake at least 8-10 hours before bed.", "fas fa-coffee");

    // 3. عمق النوم (Sleep Depth)
    const lightSleeper = dna.includes("AG") || dna.includes("TT");
    addReportItem(container, "Sleep Depth", "ADA", 
        lightSleeper ? "Light Sleeper" : "Deep Sleeper", 
        "Use white noise or blackout curtains to minimize disturbances.", "fas fa-bell");

    // 4. الحاجة لساعات النوم (Sleep Duration)
    const shortSleeper = dna.includes("DEC2") || (dna.match(/G/g) || []).length > 20;
    addReportItem(container, "Sleep Duration Needs", "DEC2", 
        shortSleeper ? "Short Sleeper (6-7h)" : "Standard Sleeper (7-9h)", 
        "Ensure consistent sleep timing even on weekends.", "fas fa-clock");

    // 5. الحساسية للضوء الأزرق
    const blueLightSens = dna.includes("TC") || dna.includes("GG");
    addReportItem(container, "Blue Light Sensitivity", "OPN4", 
        blueLightSens ? "Highly Sensitive" : "Normal Response", 
        "Wear blue-light blocking glasses 2 hours before sleep.", "fas fa-mobile-alt");

    // 6. متلازمة تململ الساقين (RLS)
    const rlsRisk = dna.includes("BTBD9") || dna.includes("CCAA");
    addReportItem(container, "Restless Legs Tendency", "BTBD9", 
        rlsRisk ? "Increased Tendency" : "Low Risk / Stable", 
        "Check Ferritin levels and do light leg stretching before bed.", "fas fa-walking");
}
/**
 * دالة تحليل البشرة والجمال الشاملة
 */
function analyzeSkin(dna, container) {
    addHeader(container, "Genomic Dermatology Report", "#f472b6"); // لون زهري للبشرة

    // 1. الكولاجين والمرونة
    const collagenGen = dna.includes("GG") || dna.includes("CC");
    addReportItem(container, "Collagen Formation", "COL1A1", 
        collagenGen ? "High Elasticity" : "Accelerated Breakdown Risk", 
        "Focus on Vitamin C and peptides to support collagen synthesis.", "fas fa-sparkles");

    // 2. الحساسية من الشمس
    const sunSens = dna.includes("MC1R") || dna.includes("TT");
    addReportItem(container, "Sun Sensitivity", "MC1R", 
        sunSens ? "High Photosensitivity" : "Natural UV Protection", 
        "Broad-spectrum SPF 50+ is essential daily.", "fas fa-sun");

    // 3. خطر التصبغات
    const pigmentRisk = dna.includes("AG") || dna.includes("CC");
    addReportItem(container, "Pigmentation Risk", "SLC24A5", 
        pigmentRisk ? "High (Melasma Prone)" : "Low / Balanced", 
        "Incorporate Brightening agents like Kojic acid or Vitamin C.", "fas fa-certificate");

    // 4. ترطيب البشرة
    const drySkin = dna.includes("FLG") || dna.includes("AA");
    addReportItem(container, "Skin Barrier & Hydration", "FLG", 
        drySkin ? "Weak Barrier (Dry Skin)" : "Strong Barrier (Hydrated)", 
        "Use Ceramides and Hyaluronic acid to lock in moisture.", "fas fa-droplet");

    // 5. الشيخوخة الناتجة عن الأكسدة
    const agingRisk = dna.includes("NQO1") || dna.includes("GT");
    addReportItem(container, "Oxidative Stress Defense", "NQO1", 
        agingRisk ? "Reduced Antioxidant Capacity" : "Optimal Defense", 
        "Apply topical antioxidants and eat antioxidant-rich foods.", "fas fa-hourglass-half");

    // 6. علامات التمدد والسيلوليت
    const stretchMarks = dna.includes("ELN") || dna.includes("GGAA");
    addReportItem(container, "Elasticity & Stretch Marks", "ELN", 
        stretchMarks ? "Increased Vulnerability" : "Highly Resilient Tissue", 
        "Keep skin deeply moisturized with Shea butter or oils during weight changes.", "fas fa-lines-leaning");

    // 7. الميل لحب الشباب والالتهاب
    const acneProne = dna.includes("IL-6") || dna.includes("CC");
    addReportItem(container, "Inflammatory Acne Response", "TNF-a", 
        acneProne ? "Highly Reactive" : "Stable Response", 
        "Use calming ingredients like Niacinamide or Centella.", "fas fa-virus-slash");
}
/**
 * دالة تحليل السمات الإدراكية والذكاء
 */
function analyzeCognitive(dna, container) {
    addHeader(container, "Cognitive & Mental Traits Report", "#a78bfa"); // لون بنفسجي للذكاء

    // 1. مرونة التعلم والذاكرة
    const memoryGen = dna.includes("AG") || dna.includes("TT");
    addReportItem(container, "Learning Plasticity", "BDNF", 
        memoryGen ? "High Neuroplasticity" : "Standard Growth", 
        "Engage in lifelong learning to keep neural pathways active.", "fas fa-brain");

    // 2. سرعة معالجة المعلومات
    const quickProcess = dna.includes("CC") || dna.includes("GG");
    addReportItem(container, "Information Processing", "KIBRA", 
        quickProcess ? "Rapid Recall Speed" : "Focus-Driven Recall", 
        "Use visualization techniques to enhance memory retrieval.", "fas fa-bolt-lightning");

    // 3. النمط الإبداعي
    const creativeGen = dna.includes("TTAA") || dna.includes("GT");
    addReportItem(container, "Creative Tendencies", "DRD2", 
        creativeGen ? "Divergent Thinker (Creative)" : "Convergent Thinker (Logical)", 
        "Balance your natural style with brainstorming exercises.", "fas fa-lightbulb");

    // 4. جين المغامرة والفضول
    const explorerGen = dna.includes("CT") || dna.includes("AA");
    addReportItem(container, "Adventure Quotient", "DRD4", 
        explorerGen ? "High (Novelty Seeker)" : "Balanced (Stability Oriented)", 
        "Channel your curiosity into new skills or travel experiences.", "fas fa-compass");

    // 5. الانتباه الانتقائي (التركيز)
    const focusGen = dna.includes("CC") || dna.includes("TT");
    addReportItem(container, "Attentional Control", "CHRNA4", 
        focusGen ? "Sharp Focus" : "Broad Awareness (Easily Distracted)", 
        "Try 'Deep Work' sessions to maximize your productivity.", "fas fa-target-shot");
}/**
 * دالة توليد التقرير الشامل بصيغة PDF
 */
function generateFullPDF() {
    const storedDNA = localStorage.getItem("userDNA");
    if (!storedDNA) {
        alert("Please generate DNA first.");
        return;
    }

    // إنشاء حاوية مؤقتة للتقرير (لن يراها المستخدم)
    const element = document.createElement('div');
    element.style.padding = '40px';
    element.style.color = '#1e293b';
    element.style.background = '#ffffff'; // خلفية بيضاء للطباعة
    element.innerHTML = `
        <h1 style="text-align:center; color:#1e40af; border-bottom:3px solid #1e40af; padding-bottom:10px;">
            Genomic Interpretive Manual
        </h1>
        <p style="text-align:center; font-style:italic;">Your personalized biological blueprint</p>
        <div id="pdfContent"></div>
    ;`

    const contentArea = element.querySelector('#pdfContent');

    // 1. تشغيل كل دوال التحليل داخل الحاوية المؤقتة
    // سنستخدم نفس الدوال السابقة ولكن سنرسلها للحاوية الجديدة
    analyzeDiet(storedDNA, contentArea);
    analyzeSports(storedDNA, contentArea);
    analyzeSleep(storedDNA, contentArea);
    analyzeSkin(storedDNA, contentArea);
    analyzeCognitive(storedDNA, contentArea);
    analyzeStressForPDF(storedDNA, contentArea);

    // إعدادات الـ PDF
    const opt = {
        margin:       10,
        filename:     'My_Genomic_Manual.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // تنفيذ التحويل والتحميل
    html2pdf().set(opt).from(element).save();
}

/**
 * دالة مساعدة للتوتر مخصصة للـ PDF (لأنها لم تكن دالة منفصلة سابقاً)
 */
function analyzeStressForPDF(dna, container) {
    addHeader(container, "Stress Response Analysis", "#818cf8");
    addReportItem(container, "Stress Handling", "COMT", dna.includes("GAAA") ? "Worrier" : "Warrior", "Recommended: Mindfulness.", "fas fa-brain");
}

/**
 * تعديل بسيط لدالة analyzeDiet لتستقبل container (عشان تشتغل بالـ PDF)
 */
function analyzeDiet(dna, container) {
    addHeader(container, "Nutrigenomics & Diet", "#4ade80");
    addReportItem(container, "Caffeine Sensitivity", "CYP1A2", dna.includes("CCTA") ? "Slow" : "Fast", "Limit caffeine intake.", "fas fa-coffee");
    // يمكنك إضافة باقي بنود التغذية هنا بنفس الطريقة
}
function generateFullPDF() {
    const dna = localStorage.getItem("userDNA");
    if (!dna) {
        alert("Please generate DNA first.");
        return;
    }

    const element = document.createElement('div');
    element.style.padding = '30px';
    element.style.fontFamily = 'Arial, sans-serif';

    element.innerHTML = `
        <div style="text-align:center; border-bottom: 3px solid #1e40af; margin-bottom: 30px; padding-bottom: 10px;">
            <h1 style="color:#1e40af; margin:0;">Full Genomic Interpretive Manual</h1>
            <p style="color:#64748b;">Comprehensive Action Plan & Recommendations</p>
        </div>
        <div id="pdfContent"></div>
    ;`

    const content = element.querySelector('#pdfContent');

    // --- 1. قسم الفيتامينات (Vitamins & Supplements) ---
    addPDFSection(content, "Vitamins & Supplements Analysis", "#4ade80", [
        { title: "Vitamin D", res: dna.includes("AGTC"), pos: "Reduced Absorption: Maintain moderate sun exposure.", neg: "Normal Absorption: Balanced levels." },
        { title: "Vitamin B12", res: dna.includes("TTCG"), pos: "Tendency for Deficiency: Focus on B12-rich foods.", neg: "Normal Levels: Stable absorption." },
        { title: "Vitamin A", res: dna.includes("GCTA"), pos: "Reduced Efficiency: Include pre-formed Vitamin A in diet.", neg: "Normal Conversion: Efficient processing." }
    ]);

    // --- 2. قسم المعالجة الغذائية (Nutritional Processing - 7 Points) ---
    addPDFSection(content, "Nutritional Processing", "#d4af37", [
        { title: "Sodium Sensitivity", res: dna.includes("TTCA"), pos: "Salt Sensitive: Limit salt to protect heart health.", neg: "Normal: Standard salt intake is fine." },
        { title: "Sugar Processing", res: dna.includes("TCF7"), pos: "High Spiking Risk: Focus on complex carbs and fiber.", neg: "Efficient: Your body handles glucose well." },
        { title: "Fat Breakdown", res: dna.includes("FTO"), pos: "Slower Breakdown: Limit saturated fats (red meat/butter).", neg: "Efficient: Balanced fat intake is well-processed." },
        { title: "Caffeine Sensitivity", res: dna.includes("CCTA"), pos: "Slow Metabolizer: Avoid caffeine after 2:00 PM.", neg: "Fast: Caffeine is cleared quickly from your system." },
        { title: "Lactose Intolerance", res: dna.includes("CTTG"), pos: "Lactose Intolerant: Try lactose-free or plant milk.", neg: "Tolerant: Dairy products are well-tolerated." },
        { title: "Bitter Taste", res: dna.includes("TAS2"), pos: "Super Taster: Sensitive to bitter greens (Broccoli/Kale).", neg: "Normal: You enjoy bitter vegetables easily." },
        { title: "Alcohol Metabolism", res: dna.includes("ALDH"), pos: "Slow Breakdown: Avoid alcohol due to toxin buildup.", neg: "Normal: Standard metabolic response." }
    ]);

    // 2. Stress & Mental Health (توتر)
    addPDFSection(content, "Stress & Mental Health", "#818cf8", [
        { title: "Stress Response (COMT)", res: dna.includes("GAAA"), pos: "Worrier: High focus but needs meditation to manage anxiety.", neg: "Warrior: Calm under pressure, thrives in high-stress tasks." }
    ]);

    // 3. Sports Physiology (رياضة)
    addPDFSection(content, "Sports Physiology", "#2dd4bf", [
        { title: "Muscle Fiber Type", res: (dna.match(/RR/g) || []).length > (dna.match(/XX/g)||  []).length, pos: "Power/Sprint: Focus on heavy lifting and explosive movements.", neg: "Endurance: Focus on long-distance cardio and stamina." },
        { title: "Recovery Speed", res: dna.includes("GGAA"), pos: "Fast: Can handle high-frequency training sessions.", neg: "Slow: Requires 48-72h rest between intense workouts." },
        { title: "Injury Risk", res: dna.includes("CCAA"), pos: "High Risk: Focus on mobility, warm-ups, and collagen support.", neg: "Low Risk: Standard warm-up is sufficient." }
    ]);

    // 4. Sleep & Circadian Rhythm (نوم)
    addPDFSection(content, "Sleep & Circadian Rhythm", "#fbbf24", [
        { title: "Chronotype", res: dna.includes("CC") || dna.includes("GG"), pos: "Night Owl: Peak mental energy is in the evening.", neg: "Early Bird: Peak mental energy is in the early morning." },
        { title: "Caffeine Sleep Impact", res: dna.includes("AA"), pos: "High Impact: Even small amounts can ruin deep sleep quality.", neg: "Low Impact: Caffeine clears the system quickly." },
        { title: "Sleep Depth", res: dna.includes("AG") || dna.includes("TT"), pos: "Light Sleeper: Use earplugs/eye masks to prevent waking.", neg: "Deep Sleeper: Highly restorative sleep cycles." },
        { title: "Sleep Duration", res: dna.includes("DEC2"), pos: "Short Sleeper: Naturally functions well on 6-7 hours.", neg: "Standard Sleeper: Needs 7-9 hours for full recovery." },
        { title: "Blue Light Sensitivity", res: dna.includes("TC"), pos: "High: Blue light drastically blocks your melatonin.", neg: "Normal: Standard response to evening screen time." },
        { title: "Restless Legs (RLS)", res: dna.includes("BTBD9"), pos: "Increased Risk: Stretch legs and check Iron/Magnesium levels.", neg: "Low Risk: No significant movement issues during sleep." }
    ]);
    // 5. Dermatology & Beauty (بشرة)
    addPDFSection(content, "Dermatology & Beauty", "#f472b6", [
        { title: "Collagen Formation", res: dna.includes("GG"), pos: "Optimal: Skin maintains elasticity well.", neg: "At Risk: Use Peptides and Vitamin C to support structure." },
        { title: "Sun Sensitivity", res: dna.includes("MC1R"), pos: "High: SPF 50+ is mandatory to prevent DNA damage.", neg: "Normal: Natural protection, SPF 30 is sufficient." },
        { title: "Pigmentation Risk", res: dna.includes("AG"), pos: "High: Prone to sunspots; use brightening serums.", neg: "Low: Even skin tone distribution." },
        { title: "Skin Hydration", res: dna.includes("FLG"), pos: "Dry/Sensitive: Use Ceramides to repair skin barrier.", neg: "Normal: Healthy natural hydration levels." },
        { title: "Oxidative Stress", res: dna.includes("NQO1"), pos: "High Aging Risk: Use topical antioxidants (Vitamin E/C).", neg: "Optimal Defense: Natural resilience against pollution." },
        { title: "Stretch Marks", res: dna.includes("ELN"), pos: "Vulnerable: Keep skin lubricated with oils/shea butter.", neg: "Resilient: High tissue elasticity." },
        { title: "Acne/Inflammation", res: dna.includes("IL-6"), pos: "Reactive: Use Niacinamide to calm inflammatory responses.", neg: "Stable: Minimal inflammatory reaction to bacteria." }
    ]);

    // 6. Cognitive Traits (إدراك)
    addPDFSection(content, "Cognitive Traits", "#a78bfa", [
        { title: "Learning Plasticity", res: dna.includes("AG"), pos: "High: Brain adapts quickly to new complex skills.", neg: "Standard: Needs repetition to solidify new memory pathways." },
        { title: "Processing Speed", res: dna.includes("CC"), pos: "Rapid: Fast recall and information processing.", neg: "Focused: Slower but more meticulous information recall." },
        { title: "Creative Style", res: dna.includes("TTAA"), pos: "Divergent: Natural flair for creative problem solving.", neg: "Convergent: Stronger in logical and analytical deduction." },
        { title: "Adventure/Novelty", res: dna.includes("CT"), pos: "High: Driven by new experiences and risk-taking.", neg: "Low: Prefers stability, routine, and calculated safety." },
        { title: "Attentional Focus", res: dna.includes("CC"), pos: "Laser Focus: High ability to ignore external distractions.", neg: "Broad Focus: Better at monitoring multiple environment cues." }
    ]);

    const opt = {
        margin: 10,
        filename: 'My_Genomic_Manual.pdf',
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function addPDFSection(container, title, color, items) {
    // لاحظي استخدام علامة الحرف (ذ) في بداية السطر ونهايته
    let html = `<div style="margin-bottom: 25px; page-break-inside: avoid;">
        <h2 style="color:${color}; border-left: 6px solid ${color}; padding-left: 10px; font-size: 20px; margin-bottom: 10px;">${title}</h2>
        <table style="width: 100%; border-collapse: collapse; background: #f9fafb;">`;
    
    items.forEach(item => {
        const advice = item.res ? item.pos : item.neg;
        html += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 10px; font-weight: bold; width: 30%; color: #374151;">${item.title}</td>
                <td style="padding: 10px; color: #4b5563;">${advice}</td>
            </tr>`;
    });

    html +=` </table></div>`;
    container.innerHTML += html;
}