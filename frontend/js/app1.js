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
// 4. كبسولة الحلزون الجيني (Mandelbrot Spiral) - منطقة آمنة معزولة
// =========================================================
// =========================================================
// =========================================================
// 4. كبسولة الحلزون الجيني (Long Centered Neon Spiral)
// منطقة آمنة ومعزولة - لا تمس كود النجمة
// =========================================================

function renderGenovaSpiral() {
    const spiralContainer = document.getElementById('mandelbrot-container'); 
    if (!spiralContainer) return; 

    spiralContainer.innerHTML = ''; 
    const canvas = document.createElement('canvas');
    canvas.width = spiralContainer.offsetWidth;
    canvas.height = spiralContainer.offsetHeight;
    spiralContainer.appendChild(canvas);

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const localDNA = localStorage.getItem("userDNA") || "ATGC";

    // --- تحليل الـ DNA للتحكم بالتفاصيل ---
    let cA = 0, cC = 0, cG = 0, cT = 0;
    for (let i = 0; i < localDNA.length; i++) {
        let b = localDNA[i].toUpperCase();
        if (b === 'A') cA++; else if (b === 'C') cC++;
        else if (b === 'G') cG++; else if (b === 'T') cT++;
    }
    
    let total = localDNA.length; 
    let pG = cG / total, pC = cC / total, pA = cA / total;
    
    // الألوان النيونية
    let maxBase = Object.keys({A:cA, C:cC, G:cG, T:cT}).reduce((a, b) => ({A:cA, C:cC, G:cG, T:cT})[a] > ({A:cA, C:cC, G:cG, T:cT})[b] ? a : b);
    const palettes = {
        T: { c1:[0.0, 1.0, 1.0], c2:[0.0, 0.5, 1.0], c3:[0.0, 0.1, 0.4] }, // سيان ساطع
        C: { c1:[1.0, 0.2, 0.9], c2:[0.7, 0.0, 1.0], c3:[0.2, 0.0, 0.4] }, // بنفسجي/زهري
        A: { c1:[1.0, 0.9, 0.0], c2:[1.0, 0.4, 0.0], c3:[0.4, 0.1, 0.0] }, // ذهبي متوهج
        G: { c1:[0.7, 0.2, 1.0], c2:[0.4, 0.0, 0.9], c3:[0.1, 0.0, 0.4] }  // أرجواني عميق
    };
    let pal = palettes[maxBase];

    // إحداثيات دقيقة لمركز سلسلة حلزونية طويلة في ماندلبوت
    let baseX = -0.74364388;
    let baseY = 0.13182590;

    // الـ DNA يغير الانحناء والمركز بشكل طفيف جداً للحفاظ على التمركز
    let centerX = baseX + (pG * 0.0005);
    let centerY = baseY + (pA * 0.0005);
    
    // زووم عالي لإظهار السلسلة الطويلة (C يتحكم بعمق السلسلة)
    let zoomLevel = 3500.0 + (pC * 2000.0);

    const vsSource = `attribute vec2 position; void main() { gl_Position = vec4(position, 0.0, 1.0); }`;

    const fsSource =` 
        precision highp float;
        uniform vec2 u_res;
        uniform vec2 u_center;
        uniform float u_zoom;
        uniform vec3 u_c1; uniform vec3 u_c2; uniform vec3 u_c3;
        
        void main() {
            // ضبط الإحداثيات لتكون في منتصف الشاشة تماماً
            vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / min(u_res.y, u_res.x);
            vec2 c = u_center + uv / u_zoom;
            vec2 z = vec2(0.0);
            
            float iter = 0.0;
            float trap1 = 100.0; // للخطوط النيونية
            float trap2 = 100.0; // للتوهج الداخلي
            
            for(int i = 0; i < 250; i++) {
                z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
                
                // هندسة النيون: التقاط المسارات لإنشاء تأثير السلسلة الكهربائية
                trap1 = min(trap1, abs(z.x * z.y)); 
                trap2 = min(trap2, length(z - vec2(0.0))); 
                
                if(dot(z,z) > 16.0) break;
                iter++;
            }
            
            vec3 color = vec3(0.005, 0.01, 0.02); // خلفية كحلية داكنة جداً
            
            if(iter < 250.0) {
                float dist = length(z);
                float log_iter = iter - log2(log2(dist)) + 4.0;
                float m = log_iter / 250.0;
                
                // لون العمق (الظل)
                color = mix(u_c3, u_c2, m * 2.0);
                
                // إضافة تفاصيل النيون الساطعة جداً
                color += u_c1 * (0.01 / (trap1 + 0.002)); // خطوط حادة
                color += u_c2 * (0.02 / (trap2 + 0.01));  // توهج ناعم
            }
            
            // زيادة التباين (Contrast) لإبراز النيون
            gl_FragColor = vec4(pow(color, vec3(1.2)), 1.0);
        }
    `;
    function compile(gl, src, type) {
        const sh = gl.createShader(type);
        gl.shaderSource(sh, src); gl.compileShader(sh);
        return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
    }

    const vs = compile(gl, vsSource, gl.VERTEX_SHADER);
    const fs = compile(gl, fsSource, gl.FRAGMENT_SHADER);

    if (vs && fs) {
        const prog = gl.createProgram();
        gl.attachShader(prog, vs); gl.attachShader(prog, fs);
        gl.linkProgram(prog); gl.useProgram(prog);
        
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

        const posLoc = gl.getAttribLocation(prog, "position");
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

        function draw() {
            if (canvas.width !== spiralContainer.offsetWidth || canvas.height !== spiralContainer.offsetHeight) {
                canvas.width = spiralContainer.offsetWidth; canvas.height = spiralContainer.offsetHeight;
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
            gl.uniform2f(gl.getUniformLocation(prog, "u_res"), canvas.width, canvas.height);
            gl.uniform2f(gl.getUniformLocation(prog, "u_center"), centerX, centerY);
            gl.uniform1f(gl.getUniformLocation(prog, "u_zoom"), zoomLevel);
            gl.uniform3fv(gl.getUniformLocation(prog, "u_c1"), pal.c1);
            gl.uniform3fv(gl.getUniformLocation(prog, "u_c2"), pal.c2);
            gl.uniform3fv(gl.getUniformLocation(prog, "u_c3"), pal.c3);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
        window.addEventListener('resize', draw);
        draw();
    }
}

// تشغيل السلسلة الحلزونية
renderGenovaSpiral();