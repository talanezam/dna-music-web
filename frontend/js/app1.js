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
    // 1. استهدف حاوية الكرت الثاني
    const container = document.getElementById('mandelbrot-container');
    if (!container) return;

    container.innerHTML = '';
    const canvas = document.createElement('canvas');
    
    // أبعاد أمان للحاوية لضمان عدم حدوث شاشة فارغة
    canvas.width = container.offsetWidth || 350;
    canvas.height = container.offsetHeight || 350;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 2. إعدادات الخلفية المظلمة الفخمة والدمج النيوني
    ctx.fillStyle = '#020206';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter'; 

    // 3. جلب الـ DNA وتحليله لمعرفة الحرف المهيمن (Genomic Mapping)
    const dna = localStorage.getItem("userDNA") || "ATGCCGTAGACT";
    let codons = [];
    for (let i = 0; i < dna.length - 2; i += 3) {
        codons.push(dna.substring(i, i + 3).toUpperCase());
    }
    if (codons.length === 0) codons = ["ATG", "CCG", "TAG"];

    // حساب تكرار الحروف لتحديد لون المثلث الموحد
    let nA = 0, nT = 0, nC = 0, nG = 0;
    for (let char of dna) {
        let base = char.toUpperCase();
        if (base === 'A') nA++;
        else if (base === 'T') nT++;
        else if (base === 'C') nC++;
        else if (base === 'G') nG++;
    }
    let totalLen = dna.length || 1;

    // خوارزمية تحديد الحرف المهيمن لربط اللون الموحد للمثلت
    let dominantBase = 'A';
    let maxCount = nA;
    if (nT > maxCount) { dominantBase = 'T'; maxCount = nT; }
    if (nC > maxCount) { dominantBase = 'C'; maxCount = nC; }
    if (nG > maxCount) { dominantBase = 'G'; maxCount = nG; }

    // تعريف الألوان الأربعة الموحدة بدقة حسب طلبك
    let triangleColor = '#00f0ff'; // الافتراضي أزرق فاتح سيان
    let paletteName = "";

    switch(dominantBase) {
        case 'A': // 1. أزرق فاتح (سيان) يلي عملناه
            triangleColor = '#00f0ff';
            paletteName = "Light Blue Cyan (A-Type)";
            break;
        case 'T': // 2. بنفسجي فاتح
            triangleColor = '#ad5aff';
            paletteName = "Light Purple (T-Type)";
            break;
        case 'C': // 3. بنفسجي غامق نيوني
            triangleColor = '#fcf391';
            paletteName = "Dark Neon Purple (C-Type)";
            break;
        case 'G': // 4. زهري
            triangleColor = '#ff00aa';
            paletteName = "Neon Pink (G-Type)";
            break;
    }

    // 4. خوارزمية الرسم العودية للمصفوفة البلورية الموحدة اللون
    function drawCrystalTriangle(x1, y1, x2, y2, x3, y3, depth, maxDepth, codonIndex) {
        if (depth > maxDepth) return;

        // حساب نقاط المنتصف للتفرع الكسيري الداخلي
        const mx12 = (x1 + x2) / 2;
        const my12 = (y1 + y2) / 2;
        const mx23 = (x2 + x3) / 2;
        const my23 = (y2 + y3) / 2;
        const mx31 = (x3 + x1) / 2;
        const my31 = (y3 + y1) / 2;

        let currentCodon = codons[codonIndex % codons.length];
        let isStopCodon = (currentCodon === "TAA" || currentCodon === "TAG" || currentCodon === "TGA");
        
        if (!isStopCodon) {
            // رسم المثلث الخارجي (الكل يأخذ نفس اللون الموحد للحالة الحالية ليكون لون واحد)
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.lineTo(x3, y3);
            ctx.closePath();

           ctx.strokeStyle = triangleColor;
ctx.lineWidth = (maxDepth - depth) * 0.35 + 0.55;
if (depth === 1) {
    ctx.shadowColor = triangleColor;
    ctx.shadowBlur = 10;
} else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}

            ctx.shadowBlur = depth === 1 ? 10 :0; 
            ctx.globalAlpha = 0.85 - (depth * 0.07); 
            ctx.stroke();
            
            ctx.globalAlpha = 1.0; // قفل حماية الشفافية للكانفاس

            // رسم التفاصيل الإضافية (المثلث المقلوب الداخلي) بنسخة أنعم وأخف من نفس اللون لمنع العجقة البصرية
            if (depth < maxDepth) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(mx12, my12);
                ctx.lineTo(mx23, my23);
                ctx.lineTo(mx31, my31);
                ctx.closePath();
                ctx.strokeStyle = triangleColor; 
                ctx.globalAlpha = 0.3; // جعل الخط الداخلي شفاف وناعم جداً لبروز التفاصيل الفخمة
                ctx.lineWidth = 0.5;
                ctx.stroke();
                ctx.restore();
            }
        }

        // الانتقال العودي للمستويات الأصغر للداخل
        drawCrystalTriangle(x1, y1, mx12, my12, mx31, my31, depth + 1, maxDepth, codonIndex + 1);
        drawCrystalTriangle(mx12, my12, x2, y2, mx23, my23, depth + 1, maxDepth, codonIndex + 2);
        drawCrystalTriangle(mx31, my31, mx23, my23, x3, y3, depth + 1, maxDepth, codonIndex + 3);
    }

    // 5. ضبط أبعاد وموقع البلورة في منتصف الكانفاس تماماً
    const size = Math.min(canvas.width, canvas.height) * 0.85;
    const height = size * (Math.sqrt(3) / 2);
    
    const x1 = canvas.width / 2,          y1 = (canvas.height - height) / 2;
    const x2 = (canvas.width - size) / 2, y2 = y1 + height;
    const x3 = (canvas.width + size) / 2, y3 = y1 + height;

    // حساب عمق البلورة (كثافة الشبكة) بناءً على طول الـ DNA
    let crystalDepth = Math.min(7, Math.max(4, Math.floor(totalLen / 10)));

    // إطلاق رسم البلورة الكسورية الموحدة
    drawCrystalTriangle(x1, y1, x2, y2, x3, y3, 1, crystalDepth, 0);

    // طباعة اسم اللون الحالي للتوثيق الفني بأسفل الكانفاس بشكل ناعم
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '11px monospace';
    ctx.fillText(`Dominant: ${dominantBase} | Theme: ${paletteName}`, 15, canvas.height - 15);
}

// -----------------------------------------------------------------
// نظام التشغيل الآمن والفوري لحل مشكلة التبويبات كلياً
// -----------------------------------------------------------------
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    renderGenovaSpiral();
} else {
    window.addEventListener('DOMContentLoaded', renderGenovaSpiral);
}

//=============================================================================
// =========================================================================
// =========================================================================
// SECTION 5: MASTER GENETIC MATRIX CRYSTAL GENERATOR (PROXIMAL SYNTHESIS)
// كود الدمج الاحترافي - الشجرة والمثلث شغالين معاً على نفس اللوحة بدون تغيير المنطق
// =========================================================================

function initMasterGeneticCanvas() {
    const masterContainer = document.getElementById('master-panel-container');
    if (!masterContainer) return;

    const masterCanvas = document.getElementById('masterGeneticCanvas');
    if (!masterCanvas) return;

    const ctx = masterCanvas.getContext('2d');
    if (!ctx) return;

    // دالة المعالجة والتوليد المشترك للشكلين معاً
    function drawMasterArt() {
        const w = masterCanvas.width;
        const h = masterCanvas.height;

        // جلب الـ DNA وتحليله المشترك للقواعد الجينية
        const dna = localStorage.getItem("userDNA") || "ATGCCGTAGACTAGCCG"; 
        const L = dna.length || 1;
        let nA = 0, nT = 0, nC = 0, nG = 0;

        for (let i = 0; i < L; i++) {
            let base = dna[i].toUpperCase();
            if (base === 'A') nA++;
            else if (base === 'T') nT++;
            else if (base === 'C') nC++;
            else if (base === 'G') nG++;
        }

        // تحديد الحرف المهيمن المشترك لتحديد الألوان ديناميكياً للشكلين معاً
        let dominantBase = 'A';
        let maxCount = nA;
        if (nT > maxCount) { dominantBase = 'T'; maxCount = nT; }
        if (nC > maxCount) { dominantBase = 'C'; maxCount = nC; }
        if (nG > maxCount) { dominantBase = 'G'; maxCount = nG; }

        // تصفير كامل وإجبار الخلفية المظلمة المعتمة وتفعيل المزج النيوني
        ctx.fillStyle = '#020206';
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';

        // =================================================================
        // [1] إعداد ورسم الشكل الأول: الشجرة المربعة (نفس المنطق الداخلي تماماً)
        // =================================================================
        const gcContent = (nC + nG) / L;
        const maxDepth = Math.min(8, Math.max(5, Math.floor(gcContent * 5) + 5));

        
         let crystalDepth = Math.min(7, Math.max(4, Math.floor(L / 10)));

         let codons = [];
        for (let i = 0; i < dna.length - 2; i += 3) {
            codons.push(dna.substring(i, i + 3).toUpperCase());
        }
        

        let palette = {};
        switch(dominantBase) {
            case 'A': palette = { glow: '#4a00e0', strokeA: '#ff007f', strokeB: '#00f0ff', fill: 'rgba(178, 95, 255, 0.34)' }; break;
            case 'T': palette = { glow: '#00f2ff', strokeA: '#7000c6', strokeB: '#06c1ff', fill: 'rgba(178, 95, 255, 0.34)' }; break;
            case 'C': palette = { glow: '#3bcc02', strokeA: '#038bdf', strokeB: '#8fff79', fill: 'rgba(178, 95, 255, 0.34)' }; break;
            case 'G': palette = { glow: '#a200ff', strokeA: '#79ebff', strokeB: '#ff7af2', fill: 'rgba(168, 85, 247, 0.25)' }; break;
        }

        function drawNeonSquare(x1, y1, x2, y2, x3, y3, x4, y4, currentDepth) {
            ctx.save();
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath();
            ctx.fillStyle = palette.fill; ctx.fill();
            const depthRatio = currentDepth / maxDepth; 
            
            if (currentDepth > maxDepth - 2) {
    ctx.shadowColor = palette.glow;
    ctx.shadowBlur = 12 * depthRatio;
} else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
}
            ctx.strokeStyle = (currentDepth % 2 === 0) ? palette.strokeA : palette.strokeB;
            ctx.lineWidth = (maxDepth > 7) ? 0.3 + (1.0 * depthRatio) : 0.5 + (1.5 * depthRatio); 
            ctx.stroke(); ctx.restore();
        }

        function branchPythagoras(x1, y1, x2, y2, depth) {
          if (depth === 0) {
    // 1. حساب نقطة الرأس الثالثة ليشكّل مثلث متساوي الأضلاع ينطلق للخارج من نهاية الغصن
    let dx = x2 - x1;
    let dy = y2 - y1;
    let x3 = x1 + dx * 0.5 - dy * 0.866;
    let y3 = y1 + dy * 0.5 + dx * 0.866;

    // 2. استدعاء البلورة الجينية لتتفتح عند رأس الغصن الحالي مع الحفاظ على منطق الـ Codons
    // المتغيرات (crystalDepth) ممررة تلقائياً لأن الدالة معزولة داخلياً
    drawCrystalTriangle(x1, y1, x2, y2, x3, y3, 1, 3, 0);
    return;
}
            let dx = x2 - x1; let dy = y1 - y2;
            let x3 = x2 - dy; let y3 = y2 - dx;
            let x4 = x1 - dy; let y4 = y1 - dx;
            drawNeonSquare(x1, y1, x2, y2, x3, y3, x4, y4, depth);
            let x5 = x4 + (dx - dy) * 0.5; let y5 = y4 - (dx + dy) * 0.5;
            branchPythagoras(x4, y4, x5, y5, depth - 1); 
            branchPythagoras(x5, y5, x3, y3, depth - 1); 
        }
        let triangleColor = '#00f0ff';
        switch(dominantBase) {
            case 'A': triangleColor = '#ffb700'; break;
            case 'T': triangleColor = '#6a00ab'; break;
            case 'C': triangleColor = '#fbff83'; break;
            case 'G': triangleColor = '#355ad5'; break;
        }

        // دمج ورسم الشجرة في النصف السفلي لتصعد وتتداخل للأعلى
        let baseWidth = 36; 
        let startX1 = w / 2 - baseWidth / 2; let startX2 = w / 2 + baseWidth / 2; let startY = h - 25; 
        let currentY = startY; let trunkHeight = 5; 

        for (let i = 0; i < trunkHeight; i++) {
            let nextY = currentY - baseWidth;
            drawNeonSquare(startX1, currentY, startX2, currentY, startX2, nextY, startX1, nextY, maxDepth);
            currentY = nextY;
        }
        branchPythagoras(startX1, currentY, startX2, currentY, maxDepth);


        // =================================================================
        // [2] إعداد ورسم الشكل الثاني: المثلث البلوري الموحد (نفس المنطق الداخلي تماماً)
        // =================================================================
        
        if (codons.length === 0) codons = ["ATG", "CCG", "TAG"];

        

        function drawCrystalTriangle(x1, y1, x2, y2, x3, y3, depth, maxDepth, codonIndex) {
            if (depth > maxDepth) return;
            const mx12 = (x1 + x2) / 2; const my12 = (y1 + y2) / 2;
            const mx23 = (x2 + x3) / 2; const my23 = (y2 + y3) / 2;
            const mx31 = (x3 + x1) / 2; const my31 = (y3 + y1) / 2;

            let currentCodon = codons[codonIndex % codons.length];
            let isStopCodon = (currentCodon === "TAA" || currentCodon === "TAG" || currentCodon === "TGA");
            
            if (!isStopCodon) {
                ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.closePath();
                ctx.strokeStyle = triangleColor; ctx.shadowColor = triangleColor;
                ctx.lineWidth = (maxDepth - depth) * 0.35 + 0.55;
                ctx.shadowBlur = depth < 3 ? 10 : 2; ctx.globalAlpha = 0.85 - (depth * 0.07); ctx.stroke();
                ctx.globalAlpha = 1.0; 

                if (depth < maxDepth) {
                    ctx.save(); ctx.beginPath(); ctx.moveTo(mx12, my12); ctx.lineTo(mx23, my23); ctx.lineTo(mx31, my31); ctx.closePath();
                    ctx.strokeStyle = triangleColor; ctx.globalAlpha = 0.3; ctx.lineWidth = 0.5; ctx.stroke(); ctx.restore();
                }
            }
            drawCrystalTriangle(x1, y1, mx12, my12, mx31, my31, depth + 1, maxDepth, codonIndex + 1);
            drawCrystalTriangle(mx12, my12, x2, y2, mx23, my23, depth + 1, maxDepth, codonIndex + 2);
            drawCrystalTriangle(mx31, my31, mx23, my23, x3, y3, depth + 1, maxDepth, codonIndex + 3);
        }

        // وضع المثلث في النصف العلوي المتمركز ليتداخل بشكل فخم ومحسوب مع تاج الشجرة الصاعد
        const size = Math.min(w, h) * 0.62; // تم تصغير الحجم قليلاً ليحدث الاندماج الهندسي المثالي بمنتصف الواجهة
        const height = size * (Math.sqrt(3) / 2);
        
        // إحداثيات التمركز المشترك بوسط اللوحة تماماً فوق الجذع
        const tx1 = w / 2;
        const ty1 = (h / 2) - (height / 2) - 10;
        const tx2 = (w / 2) - (size / 2);
        const ty2 = ty1 + height;
        const tx3 = (w / 2) + (size / 2);
        const ty3 = ty1 + height;
        
       
        
        // إطلاق رسم المثلث المدمج مع الشجرة
       // drawCrystalTriangle(tx1, ty1, tx2, ty2, tx3, ty3, 1, crystalDepth, 0);

        // بصمة التوثيق للاندماج الجيني بـ GENOVA
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; ctx.font = '11px monospace';
        ctx.fillText(`GENOVA CORE SYNTHESIS: TREE & CRYSTAL MESH ACTIVE`, 20, 25);
    }
    // إدارة وضبط الأبعاد التلقائية لضمان الاستجابة الكاملة للشاشة
    function resizeMasterCanvas() {
        masterCanvas.width = masterContainer.offsetWidth;
        masterCanvas.height = masterContainer.offsetHeight;
        drawMasterArt();
    }

    resizeMasterCanvas();
    window.addEventListener('resize', resizeMasterCanvas);
}

// تشغيل اللوحة المدمجة الكبرى عند تحميل الصفحة
window.addEventListener('load', initMasterGeneticCanvas);