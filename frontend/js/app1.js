// --- GENOVA Visual Identity: DNA-Driven Generative Fractal (Final Secure Version) ---

const container = document.getElementById('fractal-container');
container.innerHTML = ''; 

const canvas = document.createElement('canvas');
canvas.width = container.offsetWidth;
canvas.height = container.offsetHeight;
container.appendChild(canvas);

const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported in this browser.');
}

// ---------------------------------------------------------
// 1. الأمان: جلب الـ DNA من الصفحة الرئيسية ومنع الدخول المباشر
// ---------------------------------------------------------
const userDNA = localStorage.getItem("userDNA");



// ---------------------------------------------------------
// 2. نظام الذكاء الجيني (تحليل الـ DNA إلى خصائص بصرية)
// ---------------------------------------------------------
function analyzeDNA(dna) {
    let countA = 0, countC = 0, countG = 0, countT = 0;
    
    // حساب التكرارات
    for (let i = 0; i < dna.length; i++) {
        if (dna[i] === 'A') countA++;
        else if (dna[i] === 'C') countC++;
        else if (dna[i] === 'G') countG++;
        else if (dna[i] === 'T') countT++;
    }
    
    let total = dna.length || 1;
    let percentG = countG / total;
    let percentC = countC / total;

    // القاعدة 1: عدد البتلات يعتمد على نسبة G
    let arms = 4.0;
    if (percentG < 0.15) arms = 2.0;
    else if (percentG < 0.30) arms = 4.0;
    else if (percentG < 0.45) arms = 6.0;
    else arms = 8.0; // نسبة عالية = 8 أذرع فخمة

    // القاعدة 2: اتجاه الالتفاف يعتمد على A (زوجي أو فردي)
    let spiralDirection = (countA % 2 === 0) ? 1.0 : -1.0;

    // القاعدة 3: حجم البتلات وعرضها يعتمد على نسبة C
    let thickness = 1.8 + (percentC * 1.2); 

    // القاعدة 4: اللون الطاغي يعتمد على القاعدة المهيمنة
    let maxCount = Math.max(countA, countC, countG, countT);
    let col1, col2, col3;
    
    if (maxCount === countT) {
        // T طاغي: سيان نيوني وأزرق
        col1 = [0.0, 0.8, 1.0]; col2 = [0.1, 0.4, 0.9]; col3 = [0.0, 0.2, 0.6];
    } else if (maxCount === countC) {
        // C طاغي: زهري فاتح وبنفسجي
        col1 = [1.0, 0.4, 0.7]; col2 = [0.8, 0.1, 0.9]; col3 = [0.5, 0.0, 0.6];
    } else if (maxCount === countA) {
        // A طاغي: ذهبي وبرتقالي متوهج
        col1 = [1.0, 0.8, 0.2]; col2 = [1.0, 0.5, 0.0]; col3 = [0.6, 0.1, 0.0];
    } else {
        // G طاغي: نهدي وبنفسجي عميق جداً
        col1 = [0.7, 0.1, 1.0]; col2 = [0.4, 0.0, 0.8]; col3 = [0.2, 0.0, 0.4];
    }

    return { arms, spiralDirection, thickness, col1, col2, col3 };
}

const myFingerprint = analyzeDNA(userDNA);

// ---------------------------------------------------------
// 3. الـ Shaders (تتلقى الأوامر وترسم البصمة)
// ---------------------------------------------------------
const vertexShaderSource = [
    "attribute vec2 position;",
    "void main() {",
    "    gl_Position = vec4(position, 0.0, 1.0);",
    "}"
].join("\n");

const fragmentShaderSource = [
    "precision highp float;",
    "uniform vec2 u_resolution;",
    "uniform float u_arms;",       
    "uniform float u_spiral_dir;", 
    "uniform float u_thickness;",  
    "uniform vec3 u_col1;",        
    "uniform vec3 u_col2;",        
    "uniform vec3 u_col3;",        

    "void main() {",
    "    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.y, u_resolution.x);",
    "    vec2 z = uv * u_thickness;", 
    
    "    float angle = atan(z.y, z.x);",
    "    float radius = length(z);",
    "    float symmetry = 3.14159265 / u_arms;", 
    "    angle = mod(angle, 2.0 * symmetry) - symmetry;",
    "    z = radius * vec2(cos(angle), sin(angle));",
    
    "    vec2 c = vec2(0.285, 0.01 * u_spiral_dir);", 
    "    float trap1 = 100.0;",
    "    float trap2 = 100.0;",
    "    float trap3 = 100.0;",
    
    "    for(int i = 0; i < 60; i++) {",
    "        float nx = z.x*z.x - z.y*z.y + c.x;",
    "        float ny = 2.0*z.x*z.y + c.y;",
    "        z = vec2(nx, ny);",
    "        trap1 = min(trap1, abs(z.x) + abs(z.y));", 
    "        trap2 = min(trap2, length(z - vec2(0.5, 0.0)));", 
    "        trap3 = min(trap3, abs(z.x * z.y));", 
    "    }",
    
    "    float i1 = 0.015 / (trap1 + 0.002);",
    "    float i2 = 0.01 / (trap2 + 0.005);",
    "    float i3 = 0.01 / (trap3 + 0.005);",
    "    vec3 color = vec3(0.0);",
    
    "    color += i1 * u_col1;", 
    "    color += i2 * u_col2;", 
    "    color += i3 * u_col3;", 
    
    "    float core = 0.03 / (length(uv) + 0.005);",
    "    color += core * vec3(1.0, 0.9, 0.6) * max(0.0, 1.0 - length(uv)*3.0);",
    
    "    color = pow(color, vec3(1.2));",
    "    gl_FragColor = vec4(color, 1.0);",
    "}"
].join("\n");

function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

if (vertexShader && fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
        -1.0, -1.0,
         1.0, -1.0,
        -1.0,  1.0,
         1.0,  1.0
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const armsLocation = gl.getUniformLocation(program, "u_arms");
    const spiralDirLocation = gl.getUniformLocation(program, "u_spiral_dir");
    const thicknessLocation = gl.getUniformLocation(program, "u_thickness");
    const col1Location = gl.getUniformLocation(program, "u_col1");
    const col2Location = gl.getUniformLocation(program, "u_col2");
    const col3Location = gl.getUniformLocation(program, "u_col3");

    function render() {
        if (canvas.width !== container.offsetWidth || canvas.height !== container.offsetHeight) {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
        
        gl.uniform1f(armsLocation, myFingerprint.arms);
        gl.uniform1f(spiralDirLocation, myFingerprint.spiralDirection);
        gl.uniform1f(thicknessLocation, myFingerprint.thickness);
        gl.uniform3fv(col1Location, myFingerprint.col1);
        gl.uniform3fv(col2Location, myFingerprint.col2);
        gl.uniform3fv(col3Location, myFingerprint.col3);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    window.addEventListener('resize', render);
    render();
}
/*==================&&&&&&&&&&&&انتهاء كود النجمة &&&&&&&&&&&&&&&&&&&&&&&==========================*/
// =========================================================
// =========================================================
// SECTION 4: THE GENETIC MATRIX CRYSTAL (SACRED GEOMETRY)
// كود البلورة الكسورية المعتمد على ثلاثيات الـ DNA (Codons)
// =========================================================

function renderGenovaSpiral() {
    // 1. استهداف حاوية الكرت الثاني
    const container = document.getElementById('mandelbrot-container');
    if (!container) return;

    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. إعدادات الخلفية المظلمة الفخمة
    ctx.fillStyle = '#020206';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; // دمج ضوئي نيون عند تقاطع الخطوط

    // 3. جلب الـ DNA وتقسيمه إلى ثلاثيات (Codons)
    const dna = localStorage.getItem("userDNA") || "ATGCCGTAGACT";
    let codons = [];
    for (let i = 0; i < dna.length - 2; i += 3) {
        codons.push(dna.substring(i, i + 3).toUpperCase());
    }
    if (codons.length === 0) codons = ["ATG", "CCG", "TAG"];

    // حساب نسب القواعد لتحديد كثافة الشبكة وألوانها
    let cGC = 0, cAT = 0;
    for (let char of dna) {
        if (char === 'G' || char === 'C') cGC++;
        if (char === 'A' || char === 'T') cAT++;
    }
    let totalLen = dna.length || 1;
    let cyanDensity = cGC / totalLen;
    let goldDensity = cAT / totalLen;

    // 4. خوارزمية الرسم العودية للمصفوفة البلورية المقدسة (Sierpinski Matrix)
    function drawCrystalTriangle(x1, y1, x2, y2, x3, y3, depth, maxDepth, codonIndex) {
        if (depth > maxDepth) return;

        // جلب الثلاثية الحالية المؤثرة على هذا المستوى من البلورة
        let currentCodon = codons[codonIndex % codons.length];
        
        // قفل أمان جيني (OFF): إذا كانت الثلاثية شفرة توقف (Stop Codon)، يتم تخفيف إضاءة المثلث كلياً
        let isStopCodon = (currentCodon === "TAA" || currentCodon === "TAG"  ||currentCodon === "TGA");
        
        if (!isStopCodon) {
            // رسم المثلث الحالي بخطوط نيونية حادة
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();

            // تحديد اللون: خلط السيان والذهب بناءً على موقع الحروف في الكود
            if (currentCodon.includes("G") || currentCodon.includes("C")) {
                ctx.strokeStyle = '#00f0ff'; // سيان نيون حاد
                ctx.shadowColor = '#00f0ff';
                ctx.lineWidth = (maxDepth - depth) * 0.4 + 0.5;
            } else {
                ctx.strokeStyle = '#ffd700'; // ذهب متوهج
                ctx.shadowColor = '#ffd700';
                ctx.lineWidth = (maxDepth - depth) * 0.3 + 0.5;
            }

            ctx.shadowBlur = depth < 3 ? 10 : 2; // توهج ناعم للخارج وحدّة للداخل
            ctx.globalAlpha = 0.8 - (depth * 0.08); // تلاشي تدريجي للعمق لتجنب الطمس
            ctx.stroke();
        }

        // حساب نقاط المنتصف لتقسيم المثلث الكسوري إلى 3 مثلثات فرعية متناظرة
        const mx12 = (x1 + x2) / 2;
        const my12 = (y1 + y2) / 2;
        const mx23 = (x2 + x3) / 2;
        const my23 = (y2 + y3) / 2;
        const mx31 = (x3 + x1) / 2;
        const my31 = (y3 + y1) / 2;

        // الانتقال العودي للمستويات الأصغر (تنمو وتتداخل للداخل)
        // الحرف الأول يوجه النمو للمثلث العلوي، الثاني لليسرى، الثالث لليمنى
        drawCrystalTriangle(x1, y1, mx12, my12, mx31, my31, depth + 1, maxDepth, codonIndex + 1);
        drawCrystalTriangle(mx12, my12, x2, y2, mx23, my23, depth + 1, maxDepth, codonIndex + 2);
        drawCrystalTriangle(mx31, my31, mx23, my23, x3, y3, depth + 1, maxDepth, codonIndex + 3);
    }

    // 5. ضبط أبعاد وموقع البلورة في منتصف الكانفاس تماماً
    const size = Math.min(canvas.width, canvas.height) * 0.85;
    const height = size * (Math.sqrt(3) / 2);
    
    // إحداثيات رؤوس المثلث البلوري الكبير المتمركز في المنتصف
    const x1 = canvas.width / 2,          y1 = (canvas.height - height) / 2;
    const x2 = (canvas.width - size) / 2, y2 = y1 + height;
    const x3 = (canvas.width + size) / 2, y3 = y1 + height;

    // حساب عمق البلورة (كثافة الشبكة) بناءً على طول الـ DNA (بين عمق 4 إلى 7 لمنع الاكتظاظ)
    let crystalDepth = Math.min(7, Math.max(4, Math.floor(totalLen / 10)));

    // إطلاق رسم البلورة الكسورية المقدسة
    drawCrystalTriangle(x1, y1, x2, y2, x3, y3, 1, crystalDepth, 0);
}

// تشغيل البلورة الجينية عند تحميل الصفحة
window.addEventListener('load', renderGenovaSpiral);

//=================================================================================================
// =========================================================
// SECTION 5: FUTURE MASTER CANVAS INITIALIZATION
// حجز وإعداد مساحة الرسم للمستطيل العلوي الجديد
// =========================================================

function initMasterGeneticCanvas() {
    const masterContainer = document.getElementById('master-panel-container');
    if (!masterContainer) return;

    const masterCanvas = document.getElementById('masterGeneticCanvas');
    if (!masterCanvas) return;

    const masterCtx = masterCanvas.getContext('2d');
    if (!masterCtx) return;

    // دالة لضبط دقة أبعاد الكانفاس الداخيلة لتطابق حجم العنصر تماماً
    function resizeMasterCanvas() {
        masterCanvas.width = masterContainer.offsetWidth;
        masterCanvas.height = masterContainer.offsetHeight;

        // هنا حجزنا مكان الرسم (حالياً سنضع خلفية نظيفة ليكون جاهزاً للوحة القادمة)
        masterCtx.fillStyle = 'transparent'; 
        masterCtx.fillRect(0, 0, masterCanvas.width, masterCanvas.height);
        
        // يمكنكِ مستقبلاً كتابة كود الرسم هنا مباشرة داخل هذه الدالة...
    }

    // تشغيل الضبط الفوري وعند تغيير حجم الشاشة
    resizeMasterCanvas();
    window.addEventListener('resize', resizeMasterCanvas);
}

// تشغيل دالة الإعداد عند تحميل الصفحة
window.addEventListener('load', initMasterGeneticCanvas);
//=============================================================================
// =========================================================================
// SECTION 5: MASTER GENETIC MATRIX CRYSTAL GENERATOR (GENOVA NEON ENGINE)
// المحرك الإنتاجي المطور للوحة العلوية بناءً على المعاملات الكونية والحالات الأربع
// =========================================================================

// =========================================================================
// SECTION 5: MASTER GENETIC MATRIX COSMOLOGY GENERATOR (ULTIMATE ENGINE)
// المحرك الإنتاجي المتطور - اللوحة الكونية الموحدة عالية الكثافة والتداخل الكسيري
// =========================================================================

// =========================================================================
// GENOVA ENGINE - SHAPE 1: PYTHAGORAS SQUARE TREE (INDIVIDUAL 1)
// خوارزمية الشجرة المربعة الكسيرية بالنمط الهندسي والنيون المطلوب
// =========================================================================

// =========================================================================
// GENOVA ENGINE - SHAPE 1: DNA-DRIVEN PYTHAGORAS TREE (DYNAMIC COLORS)
// التعديل: ربط كثافة التفرع (GC) ولوحة الألوان (A-T-C-G Ratios) بالـ DNA
// =========================================================================

// =========================================================================
// GENOVA ENGINE - BACK TO THE LAST WORKING CODE (CRISP & CONTRASTY)
// العودة للكود الناجح والمضمون 100% باللون السيان والبنفسجي الثابت
// =========================================================================

// =========================================================================
// GENOVA ENGINE - SHAPE 1: DNA-DRIVEN PYTHAGORAS TREE
// خوارزمية الشجرة المكونة ديناميكياً بناءً على مؤشرات شريط الـ DNA
// =========================================================================

function initOrganicSquareTree() {
    const masterContainer = document.getElementById('master-panel-container');
    if (!masterContainer) return;

    const masterCanvas = document.getElementById('masterGeneticCanvas');
    if (!masterCanvas) return;

    const ctx = masterCanvas.getContext('2d');
    if (!ctx) return;

    // 1. جلب الـ DNA وتحليله كمؤشر برميجي (Genomic Mapping)
    const dna = localStorage.getItem("userDNA") || "ATGCCGTAGACTAGCCG"; // شريط افتراضي في حال عدم وجوده
    const L = dna.length || 1;
    let nC = 0, nG = 0;

    for (let i = 0; i < L; i++) {
        let base = dna[i].toUpperCase();
        if (base === 'C' || base === 'G') nC++;
    }

    // حساب نسبة الـ GC-Content (تتراوح بين 0 و 1)
    const gcContent = (nC + nG) / L;

    // القاعدة البرمجية: تحديد عمق التفرع (العجقة) ديناميكياً بناءً على الـ GC
    // إذا النسبة عالية بيوصل العمق لـ 8 (معجوقة جداً)، وإذا قليلة بيبقى عند 5 أو 6
    const maxDepth = Math.min(8, Math.max(5, Math.floor(gcContent * 5) + 5));

    // 2. دالة رسم المربعات بتوهج وسماكة تتأقلم مع العمق الكلي لمنع الطمس
    function drawNeonSquare(x1, y1, x2, y2, x3, y3, x4, y4, currentDepth) {
        ctx.save();
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.lineTo(x4, y4);
        ctx.closePath();

        // التعبئة البنفسجية الشفافة
        ctx.fillStyle = 'rgba(168, 85, 247, 0.28)'; 
        ctx.fill();

        // حساب النسبة البرمجية للعمق الحالي مقارنة بالعمق الأقصى
        const depthRatio = currentDepth / maxDepth; 
        
        // ضبط التوهج والسماكة: كل ما زاد العمق الكلي (العجقة)، بنحّف الخطوط عشان تطلع تفاصيل المربعات لولبية ونظيفة
        ctx.shadowBlur = (maxDepth > 7) ? 8 * depthRatio : 12 * depthRatio; 
        ctx.shadowColor = '#00f0ff';
        ctx.strokeStyle = '#00f0ff';
        
        // خطوط أنعم جداً للأعماق الكبيرة (مثل 8) لمنع تكتل اللون
        ctx.lineWidth = (maxDepth > 7) ? 0.3 + (1.0 * depthRatio) : 0.5 + (1.5 * depthRatio); 
        
        ctx.stroke();
        ctx.restore();
    }

    // 3. الخوارزمية العودية الثنائية
    function branchPythagoras(x1, y1, x2, y2, depth) {
        if (depth === 0) return;

        let dx = x2 - x1;
        let dy = y1 - y2;

        let x3 = x2 - dy;
        let y3 = y2 - dx;
        let x4 = x1 - dy;
        let y4 = y1 - dx;

        drawNeonSquare(x1, y1, x2, y2, x3, y3, x4, y4, depth);

        let x5 = x4 + (dx - dy) * 0.5;
        let y5 = y4 - (dx + dy) * 0.5;

        branchPythagoras(x4, y4, x5, y5, depth - 1); 
        branchPythagoras(x5, y5, x3, y3, depth - 1); 
    }

    // 4. بناء الجذع وتوليد اللوحة الفنية
    function drawCanvasContent() {
        const w = masterCanvas.width;
        const h = masterCanvas.height;

        ctx.fillStyle = '#020206';
        ctx.fillRect(0, 0, w, h);

        ctx.globalCompositeOperation = 'lighter';

        // أبعاد الجذع المتناسقة
        let baseWidth = 36; 
        let startX1 = w / 2 - baseWidth / 2;
        let startX2 = w / 2 + baseWidth / 2;
        let startY = h - 30; 

        let currentY = startY;
        let trunkHeight = 5; 

        for (let i = 0; i < trunkHeight; i++) {
            let nextY = currentY - baseWidth;
            drawNeonSquare(startX1, currentY, startX2, currentY, startX2, nextY, startX1, nextY, maxDepth);
            currentY = nextY;
        }

        // تشغيل التفرع بالعمق المحسوب ديناميكياً من الـ DNA
        branchPythagoras(startX1, currentY, startX2, currentY, maxDepth);
        // طباعة المؤشر الفني على الكانفاس لتوثيق العمل الجيني (إختياري وممتاز للمناقشة)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '12px monospace';
        ctx.fillText(`DNA Length: ${L} | GC Content: ${(gcContent * 100).toFixed(1)}% | Generated Depth: ${maxDepth}`, 20, 30);
    }

    function resizeCanvas() {
        masterCanvas.width = masterContainer.offsetWidth;
        masterCanvas.height = masterContainer.offsetHeight;
        drawCanvasContent();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

window.addEventListener('load', initOrganicSquareTree);