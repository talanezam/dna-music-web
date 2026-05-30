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
// =====================================================================
// 🧬 دالة توليد ماندلبورت الجيني (Mandelbrot Set) بأداء 0 ثانية/
            // ⬢ تثبيت سيربنسكي السداسي عالي الكثافة في المساحة اليمينية
            // =====================================================================
// ⬢ تهيئة وإعداد كانفاس الكارد الثاني (Genomic Spiral) مية بالمية
        // =====================================================================
            // ⬢ تثبيت سيربنسكي السداسي الجيني المتدرج (Genomic Hexaflake)
            // =====================================================================
            // =====================================================================
            // ⬢ 1. تهيئة وإعداد كانفاس الكارد الثاني (Genomic Spiral)
            // =====================================================================
           



            // =====================================================================
            // ⬢ تثبيت سيربنسكي السداسي الجيني المطور (الحل النهائي الجاهز مية بالمية)
            // =====================================================================
            // =====================================================================
            // 🔮 تثبيت المصفوفة التوأم المتداخلة (Concentric Interlocking Twin)
            // =====================================================================
           // =====================================================================
            // 🔮 تثبيت شكل النواة والتابع (Center & Satellite) الموزون داخل الشاشة
            // =====================================================================
            const mContainer = document.getElementById('mandelbrot-container');
            if (mContainer) {
                mContainer.innerHTML = ''; 
                const mCanvas = document.createElement('canvas');
                mCanvas.width = mContainer.offsetWidth || 400;
                mCanvas.height = mContainer.offsetHeight || 400;
                mContainer.appendChild(mCanvas);
                const ctx = mCanvas.getContext('2d');

                let targetDNA = (typeof userDNA !== 'undefined' && userDNA) ? userDNA : 'ATCGGTTAACCGGGTTTAAA';

                let countC = (targetDNA.match(/C/g) || []).length;
                let countG = (targetDNA.match(/G/g) || []).length;
                let cgPercent = ((countC + countG) / (targetDNA.length || 1)) * 100;

                let maxHexDepth = cgPercent > 60 ? 5 : 4; 
                if (mCanvas.width < 500) maxHexDepth = Math.min(maxHexDepth, 4); 

                let hexX = mCanvas.width / 2;
                let hexY = mCanvas.height / 2;
                let hexRadius = Math.min(mCanvas.width, mCanvas.height) * 0.48;

                ctx.save();
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                
           // 🧱 [محرّك التوزيع القطبي السداسي العملاق - نسخة الاندماج Macro-Shape]
        
   // 🧱 [محرك التوزيع الفركتلي الذاتي - سداسية كبرى مفرغة ومطرزة بالكامل]
        let macroRadius = Math.min(mCanvas.width, mCanvas.height) * 0.44; // القطر الكلي للوحة
        let mainX = mCanvas.width / 2;
        let mainY = mCanvas.height / 2;
        let mosaicDepth = 2; // أمان الأداء الخارق مية بالمية 🚀

        // الحسابات الهندسية للنسب الفركتلية (تطابق الفركتل الصغير بالملّي)
        let dist1 = (2 / 3) * macroRadius;
        let radius1 = macroRadius / 3;

        // 1️⃣ رسم البلورة المركزية الأساسية بالنواة مباااشرة
        drawAdvancedHexaflake(ctx, mainX, mainY, radius1 * 0.9, mosaicDepth, mosaicDepth, targetDNA);

        // 2️⃣ حلقة توزيع الأذرع الستة المحيطة بالنواة لإنشاء النجمة المفرغة الكبرى
        for (let i = 0; i < 6; i++) {
            let angle1 = (i * Math.PI) / 3;
            let x1 = mainX + Math.cos(angle1) * dist1;
            let y1 = mainY + Math.sin(angle1) * dist1;

            // رسم السداسيات المتوسطة المحيطة
            drawAdvancedHexaflake(ctx, x1, y1, radius1 * 1.05, mosaicDepth, mosaicDepth, targetDNA);

            // 3️⃣ تفرير الطبقة الخارجية الأصغر حول كل ذراع لتعطي الهيكل الفركتلي الكامل والتداخل الفخم
            let dist2 = (2 / 3) * radius1;
            let radius2 = radius1 / 3;

            for (let j = 0; j < 6; j++) {
                let angle2 = (j * Math.PI) / 3;
                let x2 = x1 + Math.cos(angle2) * dist2;
                let y2 = y1 + Math.sin(angle2) * dist2;

                // رسم السداسيات الطرفية المكملة للشكل الكلي
                drawAdvancedHexaflake(ctx, x2, y2, radius2 * 1.15, mosaicDepth, mosaicDepth, targetDNA);
            }
        }
                ctx.restore();
                // 🛡️ درع حماية وعزل كامل (Scope Isolation) لمنع تداخل الأسماء نهائياً
        
                // =====================================================================
        // 🔮 بلوك تشغيل مسار جوليا الجيني الآمن (Concentric Julia Setup)
        // =====================================================================
        const juliaContainer = document.getElementById('julia-container') || document.getElementById('julia-canvas');
        if (juliaContainer) {
            let juliaCanvas;
            if (juliaContainer.tagName.toLowerCase() === 'canvas') {
                juliaCanvas = juliaContainer;
            } else {
                juliaContainer.innerHTML = '';
                juliaCanvas = document.createElement('canvas');
                juliaCanvas.width = juliaContainer.offsetWidth || 400;
                juliaCanvas.height = juliaContainer.offsetHeight || 400;
                juliaContainer.appendChild(juliaCanvas);
            }
            
            const juliaCtx = juliaCanvas.getContext('2d');
            let juliaDNA = (typeof userDNA !== 'undefined' && userDNA) ? userDNA : ((typeof targetDNA !== 'undefined') ? targetDNA : 'ATCGGTTAACCGGGTTTAAA');
            
            // استدعاء دالة جوليا الصافية
            drawJuliaSet(juliaCtx, juliaCanvas.width, juliaCanvas.height, juliaDNA);
        }
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
    // ضبط دقة الرسم لتطابق الحجم الجديد بالـ HTML وتمنع أي غبش
    masterCanvas.width = masterContainer.clientWidth; 
    masterCanvas.height = 650;

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

// =====================================================================
        // ✨ الخطوة 1: تجهيز البكسلات ورسم فضاء ماندلبورت كـ خلفية للجدارية ✨
        // =====================================================================
        const imageData = ctx.createImageData(w, h);
        const pixels = imageData.data;

        // حدود الرياضيات لسنترة ماندلبورت الحالية (التصغير والإزاحة المعتمدة)
        const minRe = -4.0, maxRe = 1.0; 
        const minIm = -3.0, maxIm = 1.4; 
        const maxIter = 32; 

        // تشغيل النمط المتناثر بناءً على جينات المستخدم
        let isScattered = (dominantBase === 'G' || dominantBase === 'A');

        // =====================================================================
        // 🎨 لوحة الألوان المرئية لـ "جينوفا" (عدلي بالماوس فوراً من المربع الملون!)
        // =====================================================================
        
        // 🔴 [النمط T - ثايمين]
        const T_heart = '#350656'; 
        const T_glow  = '#9b6dd4'; 

        // 🟡 [النمط A - أدنين]
        const A_heart = '#00073c'; 
        const A_glow  = '#ffee00'; 

        // 🟣 [النمط C - سايتوسين]
        const C_heart = '#2d0f37'; 
        const C_glow  = '#8bbcfd'; 

        // 🔵 [النمط G - جوانين الافتراضي]
        const G_heart = '#230046'; 
        const G_glow  = '#008cff'; 


        // ⚙️ دالة ذكية ومضادة للصدمات لتفكيك الألوان مهما تغيرت صيغتها (Hex, RGB, RGBA)
        function parseColorToRGB(colorStr) {
            let defaultRGB = { r: 0, g: 140, b: 255 };
            if (!colorStr) return defaultRGB;
            
            let str = colorStr.trim().toLowerCase();
            
            // دعم صيغ rgb و rgba بالكامل إذا حولها الـ VS Code تلقائياً عند السحب
            if (str.startsWith('rgb')) {
                let match = str.match(/rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
                if (match) {
                    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
                }
            }
            
            // دعم صيغ الـ Hex بجميع أشكالها (3 أو 4 أو 6 أو 8 خانات) مع حماية ضد الـ NaN
            if (str.startsWith('#')) {
                let c = str.replace('#', '');
                if (c.length === 3 || c.length === 4) {
                    return {
                        r: parseInt(c.charAt(0) + c.charAt(0), 16) || 0,
                        g: parseInt(c.charAt(1) + c.charAt(1), 16) || 0,
                        b: parseInt(c.charAt(2) + c.charAt(2), 16) || 0
                    };
                }
                if (c.length >= 6) {
                    return {
                        r: parseInt(c.substring(0, 2), 16) || 0,
                        g: parseInt(c.substring(2, 4), 16) || 0,
                        b: parseInt(c.substring(4, 6), 16) || 0
                    };
                }
            }
            return defaultRGB;
        }

        // تفكيك اللوحة بأمان تام قبل الدخول في الحلقات التكرارية العملاقة لضمان السرعة الخارقة
        const rgbHeartT = parseColorToRGB(T_heart); const rgbGlowT = parseColorToRGB(T_glow);
        const rgbHeartA = parseColorToRGB(A_heart); const rgbGlowA = parseColorToRGB(A_glow);
        const rgbHeartC = parseColorToRGB(C_heart); const rgbGlowC = parseColorToRGB(C_glow);
        const rgbHeartG = parseColorToRGB(G_heart); const rgbGlowG = parseColorToRGB(G_glow);

        // 🌌 الحلقة الكبرى لصبغ الفضاء الكوزمي بكسل بكسل
       // 🌌 الحلقة الكبرى المطورة لصبغ الفضاء الكوزمي مع تدرج سديمي مدمج بكسل بكسل
        for (let y = 0; y < h; y++) {
            let ci = minIm + (y / h) * (maxIm - minIm);
            for (let x = 0; x < w; x++) {
                let cr = minRe + (x / w) * (maxRe - minRe);

                let zr = 0.0, zi = 0.0;
                let iter = 0;

                while (zr * zr + zi * zi <= 4.0 && iter < maxIter) {
                    let temp = zr * zr - zi * zi + cr;
                    zi = 2.0 * zr * zi + ci;
                    zr = temp;
                    iter++;
                }

                let pixelIdx = (y * w + x) * 4;
                let r = 0, g = 0, b = 0;

                // 🌌 حساب بُعد البكسل الحالي عن مركز الشاشة ديناميكياً لصنع عمق السديم
                let distX = (x - w / 2) / (w / 2);
                let distY = (y - h / 2) / (h / 2);
                let dist = Math.min(1, Math.sqrt(distX * distX + distY * distY));

                // 🔥 تعديل: رفعنا قوة إضاءة ألوان التدرج الكوني ليظهر الوهج البنفسجي/الأزرق بوضوح ورا الشجرة
                let baseR = Math.floor(35 * (1 - dist) + 2 * dist);  // لون أحمر كوزمي في المركز
                let baseG = Math.floor(15 * (1 - dist) + 2 * dist);  // لون أخضر كوزمي في المركز
                let baseB = Math.floor(85 * (1 - dist) + 6 * dist);  // لون أزرق لافندر مشع في المركز

                if (iter === maxIter) {
                    // تلوين قلب ماندلبورت الداخلي (جوا)
                    if (dominantBase === 'T') {
                        r = rgbHeartT.r; g = rgbHeartT.g; b = rgbHeartT.b;
                    } else if (dominantBase === 'A') {
                        r = rgbHeartA.r; g = rgbHeartA.g; b = rgbHeartA.b;
                    } else if (dominantBase === 'C') {
                        r = rgbHeartC.r; g = rgbHeartC.g; b = rgbHeartC.b;
                    } else {
                        r = rgbHeartG.r; g = rgbHeartG.g; b = rgbHeartG.b;
                    }
                } else {
                    // حسابات الوميض والسطوع للحواف والحارق الخارجي
                    let ratio = iter / maxIter;
                    let glow = Math.pow(ratio, 1.2);
                    let coreIntensity = Math.pow(ratio, 6.0);

                    if (isScattered) {
                        let sparkle = (Math.sin(iter * 3.5) + 1) * 0.5;
                        glow = Math.pow(ratio, 1.5) * sparkle;
                    }

                    // استدعاء ألوان التوهج (برّا) المحددة من اللوحة المرئية
                    let glowR = 0, glowG = 0, glowB = 0;
                    if (dominantBase === 'T') {
                        glowR = rgbGlowT.r; glowG = rgbGlowT.g; glowB = rgbGlowT.b;
                    } else if (dominantBase === 'A') {
                        glowR = rgbGlowA.r; glowG = rgbGlowA.g; glowB = rgbGlowA.b;
                    } else if (dominantBase === 'C') {
                        glowR = rgbGlowC.r; glowG = rgbGlowC.g; glowB = rgbGlowC.b;
                    } else {
                        glowR = rgbGlowG.r; glowG = rgbGlowG.g; glowB = rgbGlowG.b;
                    }

                    // دمج التوهج فوق ألوان الأرضية السديمية المحسوبة لكل بكسل بالملّي
                    r = Math.min(255, Math.floor(baseR + glowR * glow + 255 * coreIntensity));
                    g = Math.min(255, Math.floor(baseG + glowG * glow + 255 * coreIntensity));
                    b = Math.min(255, Math.floor(baseB + glowB * glow + 255 * coreIntensity));
                }

                // حقن البكسلات النهائي
                pixels[pixelIdx] = r;
                pixels[pixelIdx + 1] = g;
                pixels[pixelIdx + 2] = b;
                pixels[pixelIdx + 3] = 255;
            }
        }
        
        // سكّب بكسلات فضاء ماندلبورت فوراً على الشاشة الكبيرة
       // ctx.putImageData(imageData, 0, 0);
        

        // تصفير كامل وإجبار الخلفية المظلمة المعتمة وتفعيل المزج النيوني
      
        // ✨ تفعيل التدرج الكوني العميق للخلفية (بديل الأسود السادة)
        let bgGradient = ctx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, Math.max(w, h));
        bgGradient.addColorStop(0, '#0c0721');   // قلب السديم: بنفسجي كوزمي غامق
        bgGradient.addColorStop(0.5, '#040414'); // أزرق ليلي عميق يمتص الضوء
        bgGradient.addColorStop(1, '#010105');   // الأطراف: أسود معتم مية بالمية لزيادة التباين
        
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, w, h);
        ctx.globalCompositeOperation = 'lighter';
        
        ctx.fillStyle = '#ffffff'; // لون سيان نيوني متناسق مع الثيم
ctx.font = '20px monospace';
ctx.textAlign = 'center';
ctx.fillText("GENOVA SYSTEM: PROCESSING GENETIC DATA...", w / 2, h / 2);

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
        

       // =====================================================================
        // 🎨 لوحة ألوان جسد وأغصان الشجرة التوليدية (عدلي بالنظر من المربع الملون!)
        // هنا تقدري تتحكمي بتوهج الأغصان، لون الخطوط الرئيسية، ولون التعبئة الشفاف
        // =====================================================================

        // 🟡 [النمط A - أدنين]
        const A_branchGlow    = '#4a00e0'; // 👈 كبسي هون لتغيير توهج الأغصان
        const A_branchStrokeA = '#f556a5'; // 👈 لون الخطوط الأولية للغصن
        const A_branchStrokeB = '#8800ff'; // 👈 لون الخطوط الثانوية للغصن
        const A_branchFill    = '#b25fff72'; // 👈 لون التعبئة الداخلي (تقدري تحركي شريط الشفافية بالماوس!)
        
        // 🔴 [النمط T - ثايمين]
        const T_branchGlow    = '#00f2ff'; 
        const T_branchStrokeA = '#3bd8ff'; 
        const T_branchStrokeB = '#06c1ff'; 
        const T_branchFill    = '#b25fff57';
       
        // 🟣 [النمط C - سايتوسين]
        const C_branchGlow    = '#3bcc02'; 
        const C_branchStrokeA = '#038bdf'; 
        const C_branchStrokeB = '#8fff79'; 
        const C_branchFill    = '#b25fff57';
       
        // 🔵 [النمط G - جوانين الافتراضي]
        const G_branchGlow    = '#a200ff'; 
        const G_branchStrokeA = '#79ebff'; 
        const G_branchStrokeB = '#ff7af2'; 
        const G_branchFill    = '#a855f740'; 
       
        // 🔄 إعادة بناء كائن الـ palette ديناميكياً لتشغيله آلياً بدون تخريب بقية دالات الشجرة
        let palette = {};
        if (dominantBase === 'A') {
            palette = { glow: A_branchGlow, strokeA: A_branchStrokeA, strokeB: A_branchStrokeB, fill: A_branchFill };
        } else if (dominantBase === 'T') {
            palette = { glow: T_branchGlow, strokeA: T_branchStrokeA, strokeB: T_branchStrokeB, fill: T_branchFill };
        } else if (dominantBase === 'C') {
            palette = { glow: C_branchGlow, strokeA: C_branchStrokeA, strokeB: C_branchStrokeB, fill: C_branchFill };
        } else {
            palette = { glow: G_branchGlow, strokeA: G_branchStrokeA, strokeB: G_branchStrokeB, fill: G_branchFill };
        }

        function drawNeonSquare(x1, y1, x2, y2, x3, y3, x4, y4, currentDepth) {
            ctx.save();
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineTo(x3, y3); ctx.lineTo(x4, y4); ctx.closePath();
            ctx.fillStyle = palette.fill; ctx.fill();
            const depthRatio = currentDepth / maxDepth; 

            // ✨ تفعيل هالة التوهج النيوني الشاملة لكل جسد وفروع الشجرة ديناميكياً
        ctx.shadowColor = palette.glow;
        ctx.shadowBlur = 6 + 16 * depthRatio; // وميض نيون ذكي يتصاعد بقوة وجمال نحو الأطراف
            

            ctx.strokeStyle = (currentDepth % 2 === 0) ? palette.strokeA : palette.strokeB;
        
        // 🔥 التعديل الفني: سُمك انسيابي يبدأ عريضاً وقوياً (3.8px) بالأسفل وينحف تدريجياً لـ (0.4px) بالأطراف
        ctx.lineWidth = 0.4 + 3.4 * Math.pow(depthRatio, 2);
        
        ctx.stroke(); 
        ctx.restore();
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

           // 1. حساب نسب التفرع والارتفاع ديناميكياً بناءً على السيناريوهات الأربعة الكبرى
let pFactor = 0.50; // التمركز الأفقي الافتراضي (حالة A المستقيمة)
let hFactor = 0.55; // الارتفاع العمودي الافتراضي (حالة A المستقيمة)

if (dominantBase === 'T') { 
    pFactor = 0.77; hFactor = 0.70; // تفوق الفرع الأيمن ليصنع انحناءً حلزونياً لليمين
} else if (dominantBase === 'C') { 
    pFactor = 0.82; hFactor = 0.55; // تفوق الفرع الأيسر ليصنع انحناءً حلزونياً لليسار
} else if (dominantBase === 'G') { 
    pFactor = 0.83; hFactor = 0.58;  // تقليل الارتفاع لتفرش الأغصان بشكل أفقي عريض جداً
}

// 2. تطبيق المعادلات الهندسية الكسيرية الجديدة المربوطة بالـ DNA
let x5 = x4 + dx * pFactor - dy * hFactor;
let y5 = y4 - dx * hFactor - dy * pFactor;

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
        
       setTimeout(() => {
    // إعادة مسح الشاشة السوداء لتختفي كلمة Processing ويبدأ الرسم النظيف
   ctx.globalCompositeOperation = 'source-over'; // نمط الرسم العادي لمسح الكلمة القديمة تماماً
   ctx.putImageData(imageData,0,0)
//ctx.fillStyle = '#020206';
//ctx.fillRect(0, 0, w, h);
ctx.globalCompositeOperation = 'lighter';     // إعادة تشغيل النمط النيوني المتوهج للشجرة

// =====================================================================
        // 📐 هندسة الجذور: بناء مثلث سيربينسكي والخطوط العمودية النقية للجذع 📐
        // =====================================================================
        // =====================================================================
        // 📐 هندسة الجذور: الحل الوسط الفخم (جذع ممتد، عريض، وبدون خطوط أفقية) 📐
        // =====================================================================
let triangleHeight = 200; 
        let baseWidth = 45;       
        let topX = w / 2;
        let topY = h - 15 - triangleHeight; 

        // 🔥 التوسيع الفخم: جعلنا قاعدة المثلث أعرض (175 بكسل يمين ويسار) لتناسب الارتفاع المرتفع
        let leftX = topX - 165; 
        let leftY = h - 15;
        let rightX = topX + 165; 
        let rightY = h - 15;

        // 🔥 زيادة التفاصيل: عمق 5 يعطيكِ تفاصيل بلورية مذهلة داخل المثلث 💎
        let fractalDepth = 6; 

        let startY = topY + 35;             
        let trunkLength = 170;               
        let endY = startY - trunkLength;
        let startX1 = topX - baseWidth / 2;
        let startX2 = topX + baseWidth / 2;

        // 🧬 دالة بناء مثلث سيربينسكي الفركتلي التكراري
        function drawSierpinski(x1, y1, x2, y2, x3, y3, depth) {
            if (depth === 0) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.lineTo(x3, y3);
                ctx.closePath();
                ctx.stroke();
                return;
            }
            let x12 = (x1 + x2) / 2, y12 = (y1 + y2) / 2;
            let x23 = (x2 + x3) / 2, y23 = (y2 + y3) / 2;
            let x31 = (x3 + x1) / 2, y31 = (y3 + y1) / 2;

            drawSierpinski(x1, y1, x12, y12, x31, y31, depth - 1);
            drawSierpinski(x12, y12, x2, y2, x23, y23, depth - 1);
            drawSierpinski(x31, y31, x23, y23, x3, y3, depth - 1);
        }

        // =====================================================================
        // 🎨 لوحة ألوان مثلث سيربنسكي المرئية (عدلي بالنظر من المربع الملون!)
        // =====================================================================
        
        // 🔴 [النمط T - ثايمين]
        const T_triLine = '#9dc9ff'; // 👈 كبسي هون لتغيير لون خطوط المثلث (جوا)
        const T_triGlow = '#00b7ff'; // 👈 كبسي هون لتغيير لون توهج المثلث (برّا)

        // 🟡 [النمط A - أدنين]
        const A_triLine = '#ffee80'; // 👈 كبسي هون لتغيير لون خطوط المثلث (جوا)
        const A_triGlow = '#ffcc00'; // 👈 كبسي هون لتغيير لون توهج المثلث (برّا)

        // 🟣 [النمط C - سايتوسين]
        const C_triLine = '#faffb3'; // 👈 كبسي هون لتغيير لون خطوط المثلث (جوا)
        const C_triGlow = '#deb4ff'; // 👈 كبسي هون لتغيير لون توهج المثلث (برّا)

        // 🔵 [النمط G - جوانين الافتراضي]
        const G_triLine = '#e6f7ff'; // 👈 كبسي هون لتغيير لون خطوط المثلث (جوا)
        const G_triGlow = '#00f0ff'; // 👈 كبسي هون لتغيير لون توهج المثلث (برّا)

        // 🔄 تطبيق الألوان تلقائياً حسب القاعدة النتروجينية المسيطرة للعينة
        let currentTriLine = '#ffffff';
        let currentTriGlow = '#00f0ff';

        if (dominantBase === 'T') {
            currentTriLine = T_triLine; currentTriGlow = T_triGlow;
        } else if (dominantBase === 'A') {
            currentTriLine = A_triLine; currentTriGlow = A_triGlow;
        } else if (dominantBase === 'C') {
            currentTriLine = C_triLine; currentTriGlow = C_triGlow;
        } else {
            currentTriLine = G_triLine; currentTriGlow = G_triGlow;
        }

        // 🔺 تشغيل الوميض والنيون للمثلث بالعمق الهندسي الجديد
        ctx.strokeStyle = currentTriLine; 
        ctx.lineWidth = 1.1;               // خط أنحف لتظهر التفاصيل البلورية بوضوح عالي
        ctx.shadowColor = currentTriGlow; 
        ctx.shadowBlur = 15;               // قوة الوميض النيوني المحيط بالمثلث

        // استدعاء الرسم بالتوسيع والتفاصيل الجديدة
        drawSierpinski(topX, topY, leftX, leftY, rightX, rightY, fractalDepth);

        // 🛑 تصفير التوهج فوراً لحماية الجذع والأغصان القادمة من التغبيش
        ctx.shadowBlur = 0;
        // 🌳 2. رسم الجذع النقي: خطين عموديين متوازيين فقط يمران فوق القمة (بدون أي خط أفقي مزعج)
       // =====================================================================
    // 🎨 لوحة ألوان الجذع (الخطين المتوازيين) المرئية - عدلي بالنظر فوراً!
    // =====================================================================
    
    // 🔴 [النمط T - ثايمين]
    const T_trunkColor = '#3ed2ff'; // 👈 لون خطوط الجذع (جوا)
    const T_trunkGlow  = '#75e1ff'; // 👈 لون توهج الجذع (برّا)

    // 🟡 [النمط A - أدنين]
    const A_trunkColor = '#ffffff'; // 👈 لون خطوط الجذع (أبيض ناصع متناسق مع الأصفر)
    const A_trunkGlow  = '#ffcc00'; // 👈 لون توهج الجذع (أصفر ذهبي دافئ ليناسب ثيم A)

    // 🟣 [النمط C - سايتوسين]
    const C_trunkColor = '#fdf8ff'; // 👈 لون خطوط الجذع (جوا)
    const C_trunkGlow  = '#6137a0'; // 👈 لون توهج الجذع نهدي فاتح (برّا)

    // 🔵 [النمط G - جوانين الافتراضي]
    const G_trunkColor = '#9c37be'; // 👈 لون خطوط الجذع (جوا)
    const G_trunkGlow  = '#e991f8'; // 👈 لون توهج الجذع (سيان مشع متطابق مع المثلث)


    // 🔄 تطبيق ألوان الجذع وتوهجه تلقائياً حسب النمط الجيني المسيطر للعينة
    let currentTrunkColor = '#ffffff';
    let currentTrunkGlow = '#00f0ff';

    if (dominantBase === 'T') {
        currentTrunkColor = T_trunkColor; currentTrunkGlow = T_trunkGlow;
    } else if (dominantBase === 'A') {
        currentTrunkColor = A_trunkColor; currentTrunkGlow = A_trunkGlow;
    } else if (dominantBase === 'C') {
        currentTrunkColor = C_trunkColor; currentTrunkGlow = C_trunkGlow;
    } else {
        currentTrunkColor = G_trunkColor; currentTrunkGlow = G_trunkGlow;
    }

    // رسم الخطوط العمودية النقية بناءً على الألوان الديناميكية الجديدة
    ctx.strokeStyle = currentTrunkColor; 
    ctx.lineWidth = 2;

    // تفعيل هالة نيون الجذع المتناسقة جينياً
    ctx.shadowColor = currentTrunkGlow;
    ctx.shadowBlur = 20; 

    ctx.beginPath();
    
    // الخط العمودي الأيسر (ينطلق من داخل المثلث ويصعد فوقه)
    ctx.moveTo(startX1, startY);
    ctx.lineTo(startX1, endY);
    
    // الخط العمودي الأيمن (ينطلق من داخل المثلث ويصعد فوقه)
    ctx.moveTo(startX2, startY);
    ctx.lineTo(startX2, endY);
    
    ctx.stroke();
    // =====================================================================
    // ⚡ الفكرة الثانية: مسرع الطاقة النيوني (Neon Pulse Ladder) بين الخطين
    // =====================================================================
    ctx.save();
    ctx.strokeStyle = currentTrunkGlow; // بيأخذ لون نيون النمط الجيني المسيطر فوراً
    ctx.lineWidth = 3;                  // خطوط أفقية رشيقة ودقيقة جداً لعدم إحداث زحمة
    ctx.shadowColor = currentTrunkGlow;
    ctx.shadowBlur = 12;                // هالة نيون حادة ونظيفة تشع بانتظام

    // رسم نبضات الطاقة بانتظام هندسي متناظر من الأسفل للأعلى
    let pulseSpacing = 10; // 👈 المسافة بالبكسل بين كل خط وخط (تقدري تكبريها أو تصغريها)
    
    for (let pulseY = startY; pulseY >= endY; pulseY -= pulseSpacing) {
        ctx.beginPath();
        ctx.moveTo(startX1, pulseY); // ينطلق من الخط الأيسر بالملّي
        ctx.lineTo(startX2, pulseY); // يقفل عند الخط الأيمن بالملّي
        ctx.stroke();
    }
    ctx.restore();

    // 🛑 [هام جداً] تصفير التوهج فوراً لحماية الأغصان القادمة من التغبيش
    ctx.shadowBlur = 0;

        // 🚀 3. انطلاق تفرعات الشجرة التوليدية فوراً من نهاية الخطين المرتفعين بالمنتصف
       
    branchPythagoras(startX1, endY, startX2, endY, maxDepth);
    // 🌌 4. إضافة غبار النيون وجزيئات الطاقة الجينية حول فروع الشجرة
            ctx.save();
            // توليد 120 جزيء ضوئي دقيق سابح حول الهيكل العلوي
            for (let i = 0; i < 210; i++) {
                let px = Math.random() * w;                     // توزيع عشوائي على عرض الشاشة
                let py = Math.random() * (h * 0.55);            // تركيز الغبار بالنصف العلوي حول الأغصان
                
                // تنويع الألوان ديناميكياً بين أبيض ثلجي وتوهج القاعدة المسيطرة
                ctx.fillStyle = (Math.random() > 0.4) ? palette.glow : '#ffffff';
                ctx.globalAlpha = Math.random() * 0.7;          // شفافية عشوائية ليعطي عمق وأبعاد
                
                ctx.shadowColor = palette.glow;
                ctx.shadowBlur = Math.random() * 8 + 3;         // هالة توهج متفاوتة لكل نجمة
                
                ctx.beginPath();
                ctx.arc(px, py, Math.random() * 1.5 + 0.5, 0, Math.PI * 2); // أحجام دقيقة وناعمة جداً
                ctx.fill();
            }
            ctx.restore();
});
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

// 🧬 دالة سيربنسكي السداسية المطورة بالتدرج الثنائي الجيني
// 🧬 دالة سيربنسكي السداسية الجينية المتقدمة (حل نهائي ومدمج مية بالمية)
// 🧬 دالة سيربنسكي السداسية الجينية المتقدمة (نسخة آمنة مية بالمية ومشروحة سطر بسطر)
// 🧬 دالة سيربنسكي السداسية الجينية بنظام ألوان الـ HEX السهل (مشروحة سطر بسطر)
// 🧬 دالة سيربنسكي السداسية الجينية المتقدمة - نسخة الإبداع الهندسي الصافي (HEX)
function drawAdvancedHexaflake(ctx, x, y, radius, depth, maxDepth, dnaStr) {
    
    // 🛡️ صمام أمان: لو السلسلة فيها مشكلة بيعتمد حروف افتراضية عشان الكانفاس ما يختفي
    let dna = (typeof dnaStr === 'string' && dnaStr) ? dnaStr : 'ATCG';

    // 🎨 [باليت الألوان بنظام الـ HEX] - غيري الرموز هنا مبااااشرة بالنسخ واللصق على كيفك
    const colorOuter = '#00f0ff'; // ⬢ اللون الخارجي: سيان نيون ليزري مشع
    const colorInner = '#9d4edd'; // ⬢ اللون الداخلي: أرجواني كوزمي عميق

    // 📐 حساب نسبة العمق الحالي (من 1.0 في أقصى الخارج لـ 0.0 في المركز لجوا)
    let depthRatio = depth / maxDepth;

    ctx.save(); // حفظ حالة الكانفاس قبل تطبيق الألوان والخطوط الجديدة

    // ✨ [التناوب اللوني الذكي]: الطبقات الزوجية بتاخذ لون السيان، والفردية بتاخذ الأرجواني لخلق نسيج متداخل غني
    ctx.strokeStyle = (depth % 2 === 0) ? colorOuter : colorInner;
    ctx.shadowColor = ctx.strokeStyle;

    // 🔒 [حماية الأداء]: التوهج النيوني الثقيل بيشتغل برة بس (15 بكسل)، وجوا (0) عشان اللابتوب ما يعلق
    ctx.shadowBlur = (depth === maxDepth) ? 15 : 0;

    // 📐 [التحكم بالشفافية وسُمك الخط]: الخطوط برة سميكة ومعتمة، وجوا بتصير خيوط دقيقة وشفافة لتعطي بُعد ونفق بصري
    ctx.globalAlpha = 0.3 + 0.7 * depthRatio;
    ctx.lineWidth = 0.4 + 2.0 * depthRatio;

    ctx.beginPath(); // بدء مسار رسم السداسي الحالي
    
    // حلقة بناء النقاط الستة للشكل السداسي المنتظم
    for (let i = 0; i < 6; i++) {
        let angle = (i * Math.PI) / 3; // الزاوية الهندسية (60 درجة لكل رأس)

        // 🔍 قراءة الجين المقابل لهذا الرأس بالظبط
        let baseIndex = (depth * 6 + i) % dna.length;
        let base = dna[baseIndex] || 'A';

        // 🧬 [تعديل الأبعاد جينياً]: لو الحرف A أو G بيعمل نبضة وتمدد طفيف بالرأس بيكسر جمود الهيكل
        let pulse = (base === 'A' || base === 'G') ? 1.03 : 0.97;

        let hX = x + Math.cos(angle) * radius * pulse;
        let hY = y + Math.sin(angle) * radius * pulse;

        if (i === 0) ctx.moveTo(hX, hY);
        else ctx.lineTo(hX, hY);

        // 🔮 [النقاط المجهرية الفخمة]: لو الحرف C أو T بنرسم نقطة مضيئة ناعمة جداً كأنها جزيء مشع
        if (depth <= 2 && (base === 'C' || base === 'T')) {
            ctx.fillStyle = colorOuter;
            ctx.fillRect(hX - 1, hY - 1, 2, 2); // رسم مربع مجهري ناعم مية بالمية على الرأس
        }
    }
    
    ctx.closePath(); // إغلاق الشكل
    if (depth < maxDepth) ctx.stroke(); // طباعة الخطوط الملونة على الشاشة
    ctx.restore(); // استعادة حالة الكانفاس

    if (depth === 0) return; // شرط التوقف الحاسم لمنع التعليق

    // الحسابات الفركتلية للطبقات الأصغر لجوا
    let newRadius = radius / 3;
    let dist = (2 / 3) * radius;

    // إطلاق الأذرع الستة العودية
    for (let i = 0; i < 6; i++) {
        let angle = (i * Math.PI) / 3;

        // 🔍 قراءة الجين لتطبيق تأثير الالتواء الحلزوني (Twist)
        let baseIndex = (depth * 6 + i) % dna.length;
        let base = dna[baseIndex] || 'A';
        
        // لو الحرف T أو C بيعمل انحراف زاوية مذهل (0.04 راديان) بيخلي الفروع تلف متل الدوامة الجينية
        let twist = (base === 'T' || base === 'C') ? 0.04 : 0;

        let newX = x + Math.cos(angle + twist) * dist;
        let newY = y + Math.sin(angle + twist) * dist;

        // استدعاء عودي لبناء الطبقة الداخلية التالية
        drawAdvancedHexaflake(ctx, newX, newY, newRadius, depth - 1, maxDepth, dna);
    }
}
//--------------------&&&&&&&&&&&&&&&&&&&&&&&&&&بدأ دالة جوليا&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&&&&&&&&&****************************************&&&&&&&&&&&&&&&&&&&&&&&&&&&**************************
//--------------------&&&&&&&&&&&&&&&&&&&&&&&&&&بدأ دالة جوليا&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&&&&&&&&&****************************************&&&&&&&&&&&&&&&&&&&&&&&&&&&**************************
//--------------------&&&&&&&&&&&&&&&&&&&&&&&&&&بدأ دالة جوليا&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
//&&&&&&&&&&&&&&****************************************&&&&&&&&&&&&&&&&&&&&&&&&&&&**************************
// 🧬 دالة رسم فركتل جوليا الجيني الجديد (توضع بأسفل الملف تماماً)
// 🧬 دالة رسم فركتل جوليا الجيني المطور (توضع بأسفل ملف app1.js تماماً)
// 🧬 دالة رسم فركتل جوليا الجيني بنظام التعتيم الكوزمي (توضع بأسفل الملف تماماً)
// 🧬 دالة رسم فركتل جوليا الجيني بنظام الوهج النيوني والكوزمي (توضع بأسفل الملف)
// 🧬 دالة رسم فركتل جوليا الجيني المطور بنظام التنعيم اللوغاريتمي المزدوج وفلترة الحواف الذكية
// (توضع بأسفل الملف لضمان النظافة البرمجية مية بالمية)
// 🧬 دالة رسم فركتل جوليا الجيني المطور - نسخة الخلفية البيج الناعمة والمركز المجهري الصافي
function drawJuliaSet(ctx, width, height, dnaStr) {
    ctx.clearRect(0, 0, width, height);
    
    // 1️⃣ قراءة وتحليل قواعد الـ DNA
    let targetDNA = dnaStr || 'ATCGGTTAACCGGGTTTAAA';
    let countA = (targetDNA.match(/A/g) || []).length;
    let countT = (targetDNA.match(/T/g) || []).length;
    let countC = (targetDNA.match(/C/g) || []).length;
    let countG = (targetDNA.match(/G/g) || []).length;
    let total = targetDNA.length || 1;

    // ثوابت المجرات اللولبية المتشابكة الموزونة جينياً بدقة
    // 1️⃣ إيجاد القاعدة النيتروجينية المسيطرة (صاحبة أكبر تكرار بالملف)
    let maxCount = Math.max(countA, countT, countC, countG);
    let dominantBase = 'G'; // القيمة الافتراضية
    
    if (maxCount === countA) dominantBase = 'A';
    else if (maxCount === countT) dominantBase = 'T';
    else if (maxCount === countC) dominantBase = 'C';
    else if (maxCount === countG) dominantBase = 'G';

    // 2️⃣ تعيين قيم الثوابت السحرية والمحرضات بناءً على القاعدة المسيطرة
    let cX, cY;

    if (dominantBase === 'G') {
        // 🟢 إذا كانت G هي المسيطرة: المجرات اللولبية المتشابكة (القيم الحالية الفخمة تبعكِ)
        cX = -0.4 + ((countA - countT) / total) * 0.007;
        cY = 0.6 + ((countC - countG) / total) * 0.005;
    } 
    else if (dominantBase === 'A') {
        // 🔵 إذا كانت A هي المسيطرة: حلزونات وادي فرس البحر الكثيفة
        cX = -0.74543 + ((countA - countT) / total) * 0.001;
        cY = 0.11301 + ((countC - countG) / total) * 0.001;
    } 
    else if (dominantBase === 'C') {
        // 🔴 إذا كانت C هي المسيطرة: تلافيف أرنب دواندي الدائرية المتناسقة
        cX = -0.8 + ((countA - countT) / total) * 0.009;
        cY = 0.156 + ((countC - countG) / total) * 0.009;
    } 
    else if (dominantBase === 'T') {
        // 🟡 إذا كانت T هي المسيطرة: التلافيف الناعمة الممتدة والطويلة
        cX = -0.8 + ((countA - countT) / total) * 0.002;
        cY = 0.156 + ((countC - countG) / total) * 0.003;
    }


    let imgData = ctx.createImageData(width, height);
    let data = imgData.data;
    let minDim = Math.min(width, height);
    
    let maxIterations = 250; // قيمة مثالية تضمن دقة التفاصيل وسرعة الأداء
    let zoom = 1.3;          // حجم متناسق يضمن ظهور التلافيف كاملة بداخل الكارد

    // 2️⃣ حلقة الحسابات الرياضية المصلحة الأبعاد لمنع التمطيط
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            
            let zx = (x - width / 2) / (minDim / 2) * zoom;
            let zy = (y - height / 2) / (minDim / 2) * zoom;

            let i = maxIterations;
            // حد هروب 16.0 يضمن استقرار معادلة التنعيم اللوغاريتمي
            while (zx * zx + zy * zy < 16.0 && i > 0) {
                let tmp = zx * zx - zy * zy + cX;
                zy = 2.0 * zx * zy + cY;
                zx = tmp;
                i--;
            }

            let pix = (x + y * width) * 4;

            // 🎨 لوحة القواعد الأربعة: (انقري على أي مربع بـ VS Code لتغيير لون القاعدة)
            let colorA = '#ff9100'; // 🔵 لون شكل قاعدة A (فرس البحر)
            let colorT = '#b310b9'; // 🟢 لون شكل قاعدة T (التلافيف الممتدة)
            let colorC = '#002aff'; // 🔴 لون شكل قاعدة C (أرنب دواندي)
            let colorG = '#d946ef'; // 🔮 لون شكل قاعدة G (المجرات اللولبية الفخمة)

            // اختيار اللون تلقائياً بناءً على القاعدة المسيطرة بالـ DNA
            let chosenHex = colorG; 
            if (dominantBase === 'A') chosenHex = colorA;
            else if (dominantBase === 'T') chosenHex = colorT;
            else if (dominantBase === 'C') chosenHex = colorC;
            else if (dominantBase === 'G') chosenHex = colorG;

            // تفكيك اللون المختار لقنوات RGB البرمجية تلقائياً
            let rTheme = parseInt(chosenHex.substring(1, 3), 16);
            let gTheme = parseInt(chosenHex.substring(3, 5), 16);
            let bTheme = parseInt(chosenHex.substring(5, 7), 16);

            if (i === 0) {
                // 🔮 تلوين داخل الفركتل بنفس اللون المختار بدل السواد الكتيم البشع
                let v = Math.sqrt(zx * zx + zy * zy);
                let innerWave = Math.sin(v * 20.0) * 0.15 + 0.85; // تموجات دقيقة تبرز تفاصيل الداخل بنعومة
                
                data[pix + 0] = Math.max(0, Math.min(255, Math.floor(rTheme * innerWave)));
                data[pix + 1] = Math.max(0, Math.min(255, Math.floor(gTheme * innerWave)));
                data[pix + 2] = Math.max(0, Math.min(255, Math.floor(bTheme * innerWave)));
                data[pix + 3] = 255;
            } else {
                // معادلة التنعيم اللوغاريتمي المزدوج الفائق للخطوط الخارجية
                let n = maxIterations - i;
                let log_zn = Math.log(zx * zx + zy * zy) / 2.0;
                let nu = Math.log(log_zn / Math.log(2.0)) / Math.log(2.0);
                let smoothN = n + 1.0 - nu;
                let mu = smoothN / maxIterations;

                let blend = Math.pow(mu, 0.55); 
                let wave = Math.sin(mu * 6.28 * 1.5) * 0.12 + 0.88; 

                // دمج لوغاريتمي انسيابي يحافظ على نظافة الخلفية بيج (253, 245, 230)
                let r = Math.floor(253 * (1 - blend) + rTheme * blend * wave);
                let g = Math.floor(245 * (1 - blend) + gTheme * blend * wave);
                let b = Math.floor(230 * (1 - blend) + bTheme * blend * wave);

                data[pix + 0] = Math.max(0, Math.min(255, r));
                data[pix + 1] = Math.max(0, Math.min(255, g));
                data[pix + 2] = Math.max(0, Math.min(255, b));
                data[pix + 3] = 255;
            } 
            
        }
    }
    ctx.putImageData(imgData, 0, 0);
}