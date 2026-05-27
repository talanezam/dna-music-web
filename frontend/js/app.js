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
    // حساب النسبة العلمية بناءً على الطفرات
    const nutritionGenes = ["AGTC", "TTCG", "GCTA", "TTCA", "TCF7", "FTO", "CCTA", "CTTG", "TAS2", "ALDH2"];
    let riskCount = 0;
    
    // تحويل آمن ومضمون للنص لمنع أخطاء زمن التشغيل
    const dnaStr = String(storedDNA || userDNA);
    
    nutritionGenes.forEach(gene => { 
        if(dnaStr.indexOf(gene) !== -1) riskCount++; 
    });
    const efficiencyScore = 100 - (riskCount * 10);

    // 1. قسم الفيتامينات والمكملات (Vitamins & Supplements)
    addHeader(modalBody, "Vitamins & Supplements", "#ffffff");
    
    const vdrDesc = "This gene regulates the Vitamin D receptor protein primarily expressed in intestinal epithelial cells. It directly controls the active transport and absorption of dietary calcium and phosphate in the gut, indirectly influencing bone mineralization and immune system efficiency.";
    addSimpleItem(modalBody, "Vitamin D Absorption", "VDR", dnaStr.indexOf("AGTC") !== -1 ? "Reduced Absorption" : "Normal", "Maintain moderate sun exposure.", "#4ade80", vdrDesc);

    const fut2Desc = "This gene controls the expression of tissue antigens in the gastric mucosa and regulates gut microbiota composition. It indirectly dictates the absorption efficiency of Vitamin B12 in the terminal ileum by altering the microbial environment required for proper B12 uptake.";
    addSimpleItem(modalBody, "Vitamin B12 Levels", "FUT2", dnaStr.indexOf("TTCG") !== -1 ? "Tendency for Deficiency" : "Normal", "Focus on B12-rich foods.", "#4ade80", fut2Desc);

    const bco1Desc = "This gene codes for the key enzyme in the intestinal mucosa responsible for cleaving dietary carotenoids. It directly controls the conversion of plant-based beta-carotene into active Vitamin A within hepatic tissues, determining your metabolic reliance on preformed animal sources.";
    addSimpleItem(modalBody, "Vitamin A Conversion", "BCO1", dnaStr.indexOf("GCTA") !== -1 ? "Reduced Efficiency" : "Normal", "Include pre-formed Vitamin A.", "#4ade80", bco1Desc);

    // 2. قسم المعالجة الغذائية (Nutritional Processing)
    addHeader(modalBody, "Nutritional Processing", "#ffffff");

    const aceDesc = "This gene encodes an enzyme crucial for the renin-angiotensin system in vascular endothelial cells and kidneys. It directly regulates fluid balance and vascular resistance, making your renal and cardiovascular systems highly sensitive to dietary sodium intake.";
    addSimpleItem(modalBody, "Sodium Sensitivity", "ACE", dnaStr.indexOf("TTCA") !== -1 ? "Salt Sensitive" : "Normal Response", "Limit salt intake to protect heart health.", "#ffecaf", aceDesc);

    const tcf7Desc = "This gene influences a transcription factor critical for the Wnt signaling pathway in pancreatic beta-cells. It directly modulates insulin secretion and glucose homeostasis in response to carbohydrates, heavily dictating blood sugar spiking risks and metabolic regulation.";
    addSimpleItem(modalBody, "Sugar Processing", "TCF7L2", dnaStr.indexOf("TCF7") !== -1 ? "High Spiking Risk" : "Efficient Processing", "Focus on complex carbs and fiber.", "#ffecaf", tcf7Desc);

    const ftoDesc = "This gene regulates an RNA demethylase highly active in the hypothalamus, the brain's appetite control center. It modulates signaling pathways governing satiety and adipose tissue lipid accumulation, directly influencing how efficiently your body breaks down and stores dietary fats.";
    addSimpleItem(modalBody, "Fat Breakdown", "FTO", dnaStr.indexOf("FTO") !== -1 ? "Slower Breakdown" : "Efficient Breakdown", "Limit saturated fats.", "#ffecaf", ftoDesc);

    const cypDesc = "This gene encodes the primary cytochrome P450 enzyme in the liver responsible for xenobiotic clearance. It controls the metabolic breakdown rate of dietary caffeine in hepatic tissues, directly altering the duration of caffeine clearance from the bloodstream and its nervous stimulation.";
    addSimpleItem(modalBody, "Caffeine Metabolism", "CYP1A2", dnaStr.indexOf("CCTA") !== -1 ? "Slow Metabolizer" : "Fast Metabolizer", "Avoid caffeine after 2 PM.", "#ffecaf", cypDesc);

    const mcm6Desc = "This gene acts as the genomic enhancer element regulating LCT gene expression in the small intestine. It directly dictates whether lactase enzyme production persists into adulthood, governing the intestinal capacity to hydrolyze lactose without digestive distress.";
    addSimpleItem(modalBody, "Lactose Tolerance", "MCM6", dnaStr.indexOf("CTTG") !== -1 ? "Lactose Intolerant" : "Lactose Tolerant", "Try lactose-free alternatives.", "#ffecaf", mcm6Desc);

    const tasDesc = "This gene codes for a specific G-protein coupled taste receptor expressed on the tongue taste buds. It directly mediates the oral perception of bitter-tasting glucosinolates found in green vegetables, directly influencing dietary preferences and sensory sensitivity.";
    addSimpleItem(modalBody, "Bitter Perception", "TAS2R38", dnaStr.indexOf("TAS2") !== -1 ? "Super Taster" : "Normal Taster", "Sensitivity to bitter greens.", "#ffecaf", tasDesc);

    const aldhDesc = "This gene encodes the mitochondrial enzyme in the liver responsible for ethanol clearance. It directly regulates the oxidation of toxic acetaldehyde into acetate, determining how rapidly your hepatic tissue neutralizes alcohol-derived toxins to prevent inflammatory responses.";
    addSimpleItem(modalBody, "Alcohol Metabolism", "ALDH2", dnaStr.indexOf("ALDH") !== -1 ? "Slow Breakdown" : "Normal Response", "Avoid alcohol to prevent toxin buildup.", "#ffecaf", aldhDesc);

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

    else if (id === 'stress') {
    addHeader(modalBody, "Stress Response Analysis", "#f8de81");
    
    // تحويل آمن ومضمون للنص لمنع أي تعليق
    const dnaStr = String(storedDNA || userDNA);

    // 1. أسلوب التعامل مع التوتر (COMT)
    const comtDesc = "This gene codes for the catechol-O-methyltransferase enzyme, which breaks down neurotransmitters like dopamine in the prefrontal cortex of the brain. It directly modulates your cognitive clearance rate and emotional resilience under acute environmental pressure.";
    addSimpleItem(modalBody, "Stress Handling Style", "COMT", dnaStr.indexOf("GAAA") !== -1 ? "Worrier (Slow COMT)" : "Warrior (Fast COMT)", "Practice mindfulness.", "#f8de81", comtDesc);
    
    // 2. الاستجابة والانفعال العاطفي (MAOA)
    const maoaDesc = "This gene regulates the monoamine oxidase A enzyme in the central nervous system, responsible for clearing monoamine neurotransmitters like serotonin. It directly influences behavioral reactivity and neurological processing efficiency during high-stress stimuli.";
    addSimpleItem(modalBody, "Emotional Reactivity", "MAOA", dnaStr.indexOf("CCTG") !== -1 ? "Highly Reactive" : "Balanced Response", "Fast emotional response.", "#f8de81", maoaDesc);
    
    modal.style.display = "block";
}
}

//دالة الرياضة ---------------------------------
function analyzeSports(dna, container) {
    // عنوان القسم بالأصفر الفاتح
    addHeader(container, "Sports Physiology Report", "#ffffff");

    const dnaStr = String(dna);

    // 1. نوع الألياف العضلية (ACTN3) - تأكدنا من إزالة الأقواس بعد length
    const powerScore = (dnaStr.match(/RR/g) || []).length;
    const enduranceScore = (dnaStr.match(/XX/g) || []).length; 
    const muscleRes = powerScore > enduranceScore ? "Fast-Twitch (Power focus)" : "Slow-Twitch (Endurance focus)";
    const muscleAdv = powerScore > enduranceScore ? "Focus on explosive training." : "Focus on steady-state cardio.";
    
    const actn3Desc = "This gene controls the alpha-actinin-3 protein, which is strictly expressed in fast-twitch muscle fibers. It dictates the velocity of muscle contractions, directly determining whether your musculoskeletal system is naturally optimized for explosive power or long-term metabolic endurance.";
    addSimpleItem(container, "Muscle Fiber Type", "ACTN3", muscleRes, muscleAdv, "#ffecaf", actn3Desc);

    // 2. سرعة الاستشفاء (IL-6)
    const isFastRec = dnaStr.indexOf("GGAA") !== -1 || dnaStr.indexOf("CC") !== -1;
    const recRes = isFastRec ? "Fast Recovery" : "Slow Recovery";
    const recAdv = isFastRec ? "High frequency allowed." : "Requires 48h rest between sessions.";
    
    const il6Desc = "This gene regulates Interleukin-6, a key cytokine that manages inflammatory responses in muscle tissue post-exercise. It dictates how quickly your cellular systems clear metabolic waste and repair microscopic muscle tears, directly setting your recovery timeline.";
    addSimpleItem(container, "Recovery Speed", "IL-6", recRes, recAdv, "#ffecaf", il6Desc);

    // 3. السعة الهوائية (NFIA) - تنظيف الـ length تماماً هنا أيضاً
    const isHighVO2 = dnaStr.indexOf("TT") !== -1 || (dnaStr.match(/A/g) || []).length > 15;
    const vo2Res = isHighVO2 ? "Exceptional VO2 Max" : "Normal Potential";
    const vo2Adv = "Benefits from HIIT training.";
    
    const nfiaDesc = "This gene influences cellular transcription factors regulating mitochondrial biogenesis and oxygen utilization efficiency in cardiovascular tissues. It determines your baseline VO2 Max potential and how efficiently your lungs and heart deliver oxygen to active cells.";
    addSimpleItem(container, "Aerobic Capacity", "NFIA", vo2Res, vo2Adv, "#ffecaf", nfiaDesc);

    // 4. خطر الإصابة (COL5A1)
    const isInjuryProne = dnaStr.indexOf("TTAA") !== -1 || dnaStr.indexOf("GT") !== -1;
    const injuryRes = isInjuryProne ? "Increased Risk" : "Robust Joint Structure";
    const injuryAdv = isInjuryProne ? "Focus on mobility and eccentric strengthening." : "Standard joint stability.";
    
    const col5a1Desc = "This gene codes for alpha-1 type V collagen, a structural protein forming the core framework of your tendons and ligaments. Variants directly affect the elasticity and structural tensile strength of joints, altering your body's natural susceptibility to soft-tissue injuries.";
    addSimpleItem(container, "Injury Risk", "COL5A1", injuryRes, injuryAdv, "#ffecaf", col5a1Desc);
}

function addHeader(container, text, color) {
    const h = document.createElement("h2");
    h.innerText = text;
    
    // تعديل الحجم لـ 1.6rem وزيادة وزن الخط لـ 700 (Bold)
    h.style.cssText =` 
        color: ${color}; 
        font-size: 1.6rem; 
        font-weight: 700; 
        margin-top: 25px; 
        margin-bottom: 16px; 
        border-bottom: 2px solid ${color}; 
        display: inline-block;
        padding-bottom: 4px;
        letter-spacing: 0.5px;
    `;
    container.appendChild(h);
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
    // توحيد لون عنوان القسم بالأصفر الفاتح الجديد
    addHeader(container, "Sleep & Circadian Rhythm Report", "#ffffff");

    const dnaStr = String(dna);

    // 1. النمط الزمني (CLOCK)
    const nightOwlGen = dnaStr.indexOf("CC") !== -1 || dnaStr.indexOf("GG") !== -1;
    const nightOwlRes = nightOwlGen ? "Night Owl (Evening Preference)" : "Early Bird (Morning Preference)";
    const nightOwlAdv = nightOwlGen ? "Plan your most creative tasks during your peak energy hours." : "Maintain a consistent morning routine.";
    
    const clockDesc = "This gene regulates the CLOCK protein, a core component of the molecular circadian pacemaker in the brain's suprachiasmatic nucleus. It directly modulates the transcription-translation feedback loops that dictate your natural peak alertness hours, separating early birds from night owls.";
    addSimpleItem(container, "Chronotype", "CLOCK", nightOwlRes, nightOwlAdv, "#ffecaf", clockDesc);

    // 2. استقلاب الكافيين والنوم (CYP1A2)
    const slowCaffeine = dnaStr.indexOf("CCTA") !== -1 || dnaStr.indexOf("AA") !== -1;
    const caffRes = slowCaffeine ? "Slow Metabolizer (High Impact)" : "Fast Metabolizer (Low Impact)";
    const caffAdv = slowCaffeine ? "Stop caffeine intake at least 8-10 hours before bed." : "Normal caffeine tolerance.";
    
    const cypDesc = "This gene encodes the cytochrome P450 enzyme in the liver, which is primarily responsible for breaking down caffeine. Variants in this gene alter the enzyme's processing speed, directly dictating how fast caffeine is cleared from your bloodstream and how heavily it alerts your central nervous system.";
    addSimpleItem(container, "Caffeine & Sleep", "CYP1A2", caffRes, caffAdv, "#ffecaf", cypDesc);

    // 3. عمق النوم (ADA)
    const lightSleeper = dnaStr.indexOf("AG") !== -1 || dnaStr.indexOf("TT") !== -1;
    const lightRes = lightSleeper ? "Light Sleeper" : "Deep Sleeper";
    const lightAdv = lightSleeper ? "Use white noise or blackout curtains to minimize disturbances." : "Good sleep quality retention.";
    
    const adaDesc = "This gene encodes adenosine deaminase, an enzyme critical for metabolizing adenosine in the central nervous system. Adenosine accumulation in the brain drives homeostatic sleep pressure; variations alter this clearance, directly influencing sleep depth and slow-wave activity.";
    addSimpleItem(container, "Sleep Depth", "ADA", lightRes, lightAdv, "#ffecaf", adaDesc);

    // 4. الحاجة لساعات النوم (DEC2)
    const shortSleeper = dnaStr.indexOf("DEC2") !== -1 || (dnaStr.match(/G/g)  ||[]).length > 20;
    const shortRes = shortSleeper ? "Short Sleeper (6-7h)" : "Standard Sleeper (7-9h)";
    const shortAdv = shortSleeper ? "Thrive on less sleep, but ensure consistency." : "Ensure consistent sleep timing even on weekends.";
    
    const dec2Desc = "This gene acts as a transcriptional repressor in the core molecular clock mechanism regulating sleep-wake homeostasis in the hypothalamus. Specific point mutations dramatically alter the neural requirement for sleep duration, allowing full cognitive function on fewer hours of rest.";
    addSimpleItem(container, "Sleep Duration Needs", "DEC2", shortRes, shortAdv, "#ffecaf", dec2Desc);

    // 5. الحساسية للضوء الأزرق (OPN4)
    const blueLightSens = dnaStr.indexOf("TC") !== -1 || dnaStr.indexOf("GG") !== -1;
    const blueRes = blueLightSens ? "Highly Sensitive" : "Normal Response";
    const blueAdv = blueLightSens ? "Wear blue-light blocking glasses 2 hours before sleep." : "Standard screen tolerance.";
    
    const opn4Desc = "This gene codes for melanopsin, a photopigment expressed in intrinsically photosensitive retinal ganglion cells in the eyes. These cells project directly to the brain's master clock, mediating light-induced suppression of melatonin secretion and altering your neuroendocrine sensitivity to artificial blue light.";
    addSimpleItem(container, "Blue Light Sensitivity", "OPN4", blueRes, blueAdv, "#ffecaf", opn4Desc);
}
/**
 * دالة تحليل البشرة والجمال الشاملة
 */
function analyzeSkin(dna, container) {
    // عنوان القسم مأخوذ بالظبط من صورتك وباللون الأصفر الفاتح
    addHeader(container, "Genomic Dermatology Report", "#ffffff");

    const dnaStr = String(dna);

    // 1. تشكل الكولاجين (COL1A1)
    const colDesc = "This gene encodes the major component of type I collagen, the primary structural protein of the dermal extracellular matrix. It directly influences skin density, firmness, and the structural integrity of the cutaneous tissue.";
    addSimpleItem(container, "Collagen Formation", "COL1A1", dnaStr.indexOf("AA") !== -1 ? "Accelerated Breakdown Risk" : "Normal Retention", "Focus on Vitamin C and peptides to support collagen synthesis.", "#ffecaf", colDesc);

    // 2. الحساسية للشمس (MC1R)
    const mc1rDesc = "This gene regulates the melanocortin 1 receptor on melanocytes, driving the switch between pheomelanin and protective eumelanin synthesis. It determines your skin's natural UV shielding and baseline photoaging defense mechanisms.";
    addSimpleItem(container, "Sun Sensitivity", "MC1R", dnaStr.indexOf("TT") !== -1 ? "High Photo-Sensitivity" : "Standard UV Resilience", "Apply broad-spectrum SPF 50+ is essential daily.", "#ffecaf", mc1rDesc);

    // 3. خطر التصبغات (SLC24A5)
    const slcDesc = "This gene codes for a potassium-dependent sodium-calcium exchanger that plays a significant role in melanogenesis and melanosome maturation within epidermal layers. It directly modulates melanin accumulation patterns and hyperpigmentation risks.";
    addSimpleItem(container, "Pigmentation Risk", "SLC24A5", dnaStr.indexOf("GG") !== -1 ? "High Melasma Prone" : "Balanced Melanin Production", "Incorporate brightening agents like Kojic acid or Vitamin C.", "#ffecaf", slcDesc);

    // 4. حاجز البشرة والترطيب (FLG)
    const flgDesc = "This gene codes for profilaggrin, which is metabolized into filaggrin to maintain the structural integrity of the stratum corneum. It directly impacts natural moisturizing factor (NMF) production, skin hydration levels, and epidermal barrier resilience.";
    addSimpleItem(container, "Skin Barrier & Hydration", "FLG", dnaStr.indexOf("CC") !== -1 ? "Weak Barrier (Dry Skin)" : "Optimal Hydration", "Use Ceramides and Hyaluronic acid to lock in moisture.", "#ffecaf", flgDesc);

    // 5. الدفاع ضد الإجهاد التأكسدي (NQO1)
    const nqoDesc = "This gene encodes a cytoplasmic reductase that prevents the one-electron reduction of quinones, protecting cutaneous cellular membranes from radical-induced lipid peroxidation and accelerating cellular detoxification pathways.";
    addSimpleItem(container, "Oxidative Stress Defense", "NQO1", dnaStr.indexOf("AA") !== -1 ? "Reduced Antioxidant Capacity" : "Optimal Cellular Defense", "Apply topical antioxidants and eat antioxidant-rich foods.", "#ffecaf", nqoDesc);

    // 6. المرونة وعلامات التمدد (ELN)
    const elnDesc = "This gene encodes elastin, a major structural protein of the extracellular matrix that provides elasticity and resilience to dermal tissues. It governs the skin's capacity to recoil after stretching, directly dictating stretch mark susceptibility.";
    addSimpleItem(container, "Elasticity & Stretch Marks", "ELN", dnaStr.indexOf("TT") !== -1 ? "Highly Resilient Tissue" : "Standard Elasticity", "Advice: Normal tissue elasticity.", "#ffecaf", elnDesc);

    // 7. الاستجابة الالتهابية لحب الشباب (TNF-a)
    const tnfDesc = "This gene codes for tumor necrosis factor-alpha, a potent pro-inflammatory cytokine produced by macrophages and keratinocytes. It dictates the intensity of the cutaneous immune cascade in response to follicular blockages, directly modulating acne severity.";
    addSimpleItem(container, "Inflammatory Acne Response", "TNF-a", dnaStr.indexOf("GG") !== -1 ? "Highly Reactive" : "Balanced Response", "Use calming ingredients like Niacinamide or Centella.", "#ffecaf", tnfDesc);
}
/**
 * دالة تحليل السمات الإدراكية والذكاء
 */

function analyzeCognitive(dna, container) {
    // توحيد لون عنوان القسم بالأصفر الفاتح الجديد
    addHeader(container, "Cognitive Performance Report", "#ffffff");

    const dnaStr = String(dna);

    // 1. المرونة العصبية والتعلم (BDNF)
    const highBDNF = dnaStr.indexOf("GG") !== -1 || dnaStr.indexOf("AA") !== -1;
    const bdnfRes = highBDNF ? "Optimized Neuroplasticity" : "Standard Neuroplasticity";
    const bdnfAdv = highBDNF ? "Thrive in high-complexity cognitive tasks." : "Incorporate memory techniques and active recall.";
    
    const bdnfDesc = "This gene regulates Brain-Derived Neurotrophic Factor, a protein highly active in the hippocampus and cerebral cortex. It plays a critical role in the survival of neurons, synaptic plasticity, and long-term potentiation, directly dictating your cognitive adaptability, learning velocity, and neuroplastic capacity.";
    addSimpleItem(container, "Neuroplasticity & Learning", "BDNF", bdnfRes, bdnfAdv, "#ffecaf", bdnfDesc);

    // 2. قوة الذاكرة واسترجاع المعلومات (KIBRA)
    const highMemory = dnaStr.indexOf("CC") !== -1 || dnaStr.indexOf("CT") !== -1;
    const memoryRes = highMemory ? "Enhanced Memory Retention" : "Normal Memory Potential";
    const memoryAdv = highMemory ? "Excellent spatial and episodic memory hold." : "Support working memory with structured digital tools.";
    
    const kibraDesc = "This gene encodes a neuronal protein found in the postsynaptic density of cells in the hippocampus and cortex. It interacts with key signaling pathways involved in synaptic restructuring, directly influencing your brain's cellular capacity for high-density memory retention and spatial recall.";
    addSimpleItem(container, "Memory Retention", "KIBRA", memoryRes, memoryAdv, "#ffecaf", kibraDesc);

    // 3. التركيز وتأشير الدوبامين (DRD2)
    const fastFocus = dnaStr.indexOf("TT") !== -1 || dnaStr.indexOf("GT") !== -1;
    const focusRes = fastFocus ? "High Baseline Focus" : "Balanced Cognitive Flexibility";
    const focusAdv = fastFocus ? "Great for deep-work sessions without distraction." : "Use time-blocking techniques to maintain focus on single tasks.";
    
    const drd2Desc = "This gene modulates the density of Dopamine Receptor D2 in the striatum and prefrontal cortex of the brain. It regulates synaptic transmission efficiency within reward and executive networks, directly determining baseline attention span, goal-directed focus, and cognitive flexibility under multitasking scenarios.";
    addSimpleItem(container, "Focus & Attention", "DRD2", focusRes, focusAdv, "#ffecaf", drd2Desc);
}
/**
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
    addPDFSection(content, "Vitamins & Supplements Analysis", "#1e40af", [
        { title: "Vitamin D", res: dna.includes("AGTC"), pos: "Reduced Absorption: Maintain moderate sun exposure.", neg: "Normal Absorption: Balanced levels." },
        { title: "Vitamin B12", res: dna.includes("TTCG"), pos: "Tendency for Deficiency: Focus on B12-rich foods.", neg: "Normal Levels: Stable absorption." },
        { title: "Vitamin A", res: dna.includes("GCTA"), pos: "Reduced Efficiency: Include pre-formed Vitamin A in diet.", neg: "Normal Conversion: Efficient processing." }
    ]);

    // --- 2. قسم المعالجة الغذائية (Nutritional Processing - 7 Points) ---
    addPDFSection(content, "Nutritional Processing", "#1e40af", [
        { title: "Sodium Sensitivity", res: dna.includes("TTCA"), pos: "Salt Sensitive: Limit salt to protect heart health.", neg: "Normal: Standard salt intake is fine." },
        { title: "Sugar Processing", res: dna.includes("TCF7"), pos: "High Spiking Risk: Focus on complex carbs and fiber.", neg: "Efficient: Your body handles glucose well." },
        { title: "Fat Breakdown", res: dna.includes("FTO"), pos: "Slower Breakdown: Limit saturated fats (red meat/butter).", neg: "Efficient: Balanced fat intake is well-processed." },
        { title: "Caffeine Sensitivity", res: dna.includes("CCTA"), pos: "Slow Metabolizer: Avoid caffeine after 2:00 PM.", neg: "Fast: Caffeine is cleared quickly from your system." },
        { title: "Lactose Intolerance", res: dna.includes("CTTG"), pos: "Lactose Intolerant: Try lactose-free or plant milk.", neg: "Tolerant: Dairy products are well-tolerated." },
        { title: "Bitter Taste", res: dna.includes("TAS2"), pos: "Super Taster: Sensitive to bitter greens (Broccoli/Kale).", neg: "Normal: You enjoy bitter vegetables easily." },
        { title: "Alcohol Metabolism", res: dna.includes("ALDH"), pos: "Slow Breakdown: Avoid alcohol due to toxin buildup.", neg: "Normal: Standard metabolic response." }
    ]);

    // 2. Stress & Mental Health (توتر)
    addPDFSection(content, "Stress & Mental Health", "#1e40af", [
        { title: "Stress Response (COMT)", res: dna.includes("GAAA"), pos: "Worrier: High focus but needs meditation to manage anxiety.", neg: "Warrior: Calm under pressure, thrives in high-stress tasks." }
    ]);

    // 3. Sports Physiology (رياضة)
    addPDFSection(content, "Sports Physiology", "#1e40af", [
        { title: "Muscle Fiber Type", res: (dna.match(/RR/g) || []).length > (dna.match(/XX/g)||  []).length, pos: "Power/Sprint: Focus on heavy lifting and explosive movements.", neg: "Endurance: Focus on long-distance cardio and stamina." },
        { title: "Recovery Speed", res: dna.includes("GGAA"), pos: "Fast: Can handle high-frequency training sessions.", neg: "Slow: Requires 48-72h rest between intense workouts." },
        { title: "Injury Risk", res: dna.includes("CCAA"), pos: "High Risk: Focus on mobility, warm-ups, and collagen support.", neg: "Low Risk: Standard warm-up is sufficient." }
    ]);

    // 4. Sleep & Circadian Rhythm (نوم)
    addPDFSection(content, "Sleep & Circadian Rhythm", "#1e40af", [
        { title: "Chronotype", res: dna.includes("CC") || dna.includes("GG"), pos: "Night Owl: Peak mental energy is in the evening.", neg: "Early Bird: Peak mental energy is in the early morning." },
        { title: "Caffeine Sleep Impact", res: dna.includes("AA"), pos: "High Impact: Even small amounts can ruin deep sleep quality.", neg: "Low Impact: Caffeine clears the system quickly." },
        { title: "Sleep Depth", res: dna.includes("AG") || dna.includes("TT"), pos: "Light Sleeper: Use earplugs/eye masks to prevent waking.", neg: "Deep Sleeper: Highly restorative sleep cycles." },
        { title: "Sleep Duration", res: dna.includes("DEC2"), pos: "Short Sleeper: Naturally functions well on 6-7 hours.", neg: "Standard Sleeper: Needs 7-9 hours for full recovery." },
        { title: "Blue Light Sensitivity", res: dna.includes("TC"), pos: "High: Blue light drastically blocks your melatonin.", neg: "Normal: Standard response to evening screen time." },
        { title: "Restless Legs (RLS)", res: dna.includes("BTBD9"), pos: "Increased Risk: Stretch legs and check Iron/Magnesium levels.", neg: "Low Risk: No significant movement issues during sleep." }
    ]);
    // 5. Dermatology & Beauty (بشرة)
    addPDFSection(content, "Dermatology & Beauty", "#1e40af", [
        { title: "Collagen Formation", res: dna.includes("GG"), pos: "Optimal: Skin maintains elasticity well.", neg: "At Risk: Use Peptides and Vitamin C to support structure." },
        { title: "Sun Sensitivity", res: dna.includes("MC1R"), pos: "High: SPF 50+ is mandatory to prevent DNA damage.", neg: "Normal: Natural protection, SPF 30 is sufficient." },
        { title: "Pigmentation Risk", res: dna.includes("AG"), pos: "High: Prone to sunspots; use brightening serums.", neg: "Low: Even skin tone distribution." },
        { title: "Skin Hydration", res: dna.includes("FLG"), pos: "Dry/Sensitive: Use Ceramides to repair skin barrier.", neg: "Normal: Healthy natural hydration levels." },
        { title: "Oxidative Stress", res: dna.includes("NQO1"), pos: "High Aging Risk: Use topical antioxidants (Vitamin E/C).", neg: "Optimal Defense: Natural resilience against pollution." },
        { title: "Stretch Marks", res: dna.includes("ELN"), pos: "Vulnerable: Keep skin lubricated with oils/shea butter.", neg: "Resilient: High tissue elasticity." },
        { title: "Acne/Inflammation", res: dna.includes("IL-6"), pos: "Reactive: Use Niacinamide to calm inflammatory responses.", neg: "Stable: Minimal inflammatory reaction to bacteria." }
    ]);

    // 6. Cognitive Traits (إدراك)
    addPDFSection(content, "Cognitive Traits", "#1e40af", [
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

// دالة إضافة العناصر (صارت عامة برات الدوال عشان تشتغل بالكل)
const addSimpleItem = (container, title, gene, result, advice, titleColor, scientificDesc) => {
    const item = document.createElement("div");
    item.style.cssText = `margin-bottom: 28px; padding-left: 15px; border-left: 2px solid ${titleColor}44;`;

    const isNormal = result.includes("Normal") || result.includes("Efficient") || result.includes("Tolerant") || result.includes("Sleeper") || result.includes("Response");
    const resColor = isNormal ? "#2dd4bf" : "#ef4444";

    item.innerHTML = `
        <div class="standard-view">
            <div style="color: ${titleColor}; font-size: 1.3rem; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.3px;">${title}</div>
            
            <div style="color: #f8fafc; font-size: 0.95rem; margin-bottom: 6px;">Result: <span style="color: ${resColor}; font-weight: bold;">${result}</span></div>
            <div style="color: #e0f2fe; font-size: 0.95rem; line-height: 1.4; font-weight: 400; margin-bottom: 8px;">
                <span style="color: #7597d7; font-weight: 600;">Advice:</span> ${advice}
            </div>
        </div>
        
        <div class="scientific-view" style="display: none; margin-top: 10px; padding: 12px; background: rgba(255, 255, 255, 0.02); border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.05); margin-bottom: 6px;">
            <div style="color: #b877fd; font-size: 1.1rem; font-weight: 600; margin-bottom: 4px;">🧬 Genetic Marker: <span style="color: #ffffff; font-weight: bold;">${gene}</span></div>
            <div style="color: #94a3b8; font-size: 0.85rem; line-height: 1.4;">
                ${scientificDesc}
            </div>
        </div>

        <div style="color: #76b6d1; font-size: 0.85rem; font-weight: 500; text-decoration: underline; cursor: pointer; display: inline-block; margin-top: 2px;"
             onclick="const sv = this.parentElement.querySelector('.scientific-view'); if(sv.style.display === 'none') { sv.style.display = 'block'; this.innerText = 'Hide Scientific Details'; } else { sv.style.display = 'none'; this.innerText = 'Scientific Details'; }">
            Scientific Details
        </div>
   ` ;
    container.appendChild(item);
};
