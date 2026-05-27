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
// SECTION 4: THE GENOMIC SPIRAL (COMPLEX MANDELBROT)
// نسخة مطورة بناءً على "طرف الخيط" - تفاصيل دقيقة وخلفية داكنة
// =========================================================

function renderGenovaSpiral() {
    const spiralContainer = document.getElementById('mandelbrot-container'); 
    if (!spiralContainer) return;

    spiralContainer.innerHTML = ''; 
    const canvas2 = document.createElement('canvas');
    canvas2.width = spiralContainer.offsetWidth;
    canvas2.height = spiralContainer.offsetHeight;
    container2 = spiralContainer.appendChild(canvas2);

    const gl2 = canvas2.getContext('webgl');
    if (!gl2) return;

    const dna = localStorage.getItem("userDNA") || "ACGT";
    let cA = 0, cC = 0, cG = 0, cT = 0;
    for (let char of dna) {
        if (char === 'A') cA++; else if (char === 'C') cC++;
        else if (char === 'G') cG++; else if (char === 'T') cT++;
    }
    let total = dna.length || 1;
    let pC = cC / total, pA = cA / total;

    const palettes = {
        A: { c1:[1.0, 0.8, 0.2], c2:[0.6, 0.3, 0.0], c3:[0.01, 0.0, 0.02] }, // ذهبي
        C: { c1:[1.0, 0.2, 0.8], c2:[0.4, 0.1, 0.6], c3:[0.0, 0.0, 0.02] }, // زهري/موف
        G: { c1:[0.6, 0.2, 1.0], c2:[0.2, 0.0, 0.5], c3:[0.0, 0.0, 0.01] }, // بنفسجي عميق
        T: { c1:[0.0, 1.0, 1.0], c2:[0.0, 0.3, 0.6], c3:[0.0, 0.0, 0.02] }  // سيان
    };
    
    let maxBase = (cA >= cC && cA >= cG && cA >= cT) ? 'A' : (cC >= cG && cC >= cT) ? 'C' : (cG >= cT) ? 'G' : 'T';
    let pal = palettes[maxBase];

    const vs = `attribute vec2 p; void main(){ gl_Position=vec4(p,0,1); }`;
    const fs =` 
        precision highp float;
        uniform vec2 res;
        uniform float zoom;
        uniform float rot;
        uniform vec3 c1; uniform vec3 c2; uniform vec3 c3;

        void main() {
            // 1. تحويل الإحداثيات (Zoom مُعدل لرؤية الأشكال الصغيرة تنمو)
            vec2 uv = (gl_FragCoord.xy - 0.5 * res) / min(res.y, res.x);
            float s = sin(rot), co = cos(rot);
            uv = vec2(uv.x * co - uv.y * s, uv.x * s + uv.y * co);
            
            // 2. نقطة الارتكاز (Seahorse Valley) بزووم فائق
            vec2 c = vec2(-0.7452, 0.1127) + (uv / (zoom * 2.0));
            vec2 z = vec2(0.0);
            
            float iter = 0.0;
            float orbit = 1000.0;
            
            for(int i = 0; i < 256; i++) {
                z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + c;
                
                // Orbit Trap مُعدل لالتقاط "حواف" الأشكال الصغيرة
                orbit = min(orbit, length(z)); 
                
                if(length(z) > 4.0) break;
                iter += 1.0;
            }
            
            // 3. نظام تلوين "ناعم" وخلفية داكنة (Smooth Shading)
            float f = iter / 256.0;
            if (iter < 256.0) {
                // تباين عالي: الألوان تظهر فقط عند الاقتراب من الحواف
                float smooth_f = iter + 1.0 - log(log(length(z)))/log(2.0);
                f = smooth_f / 64.0; 
            }
            
            // دمج الألوان بناءً على العمق (c3 هي الخلفية السوداء)
            vec3 glow = (0.01 / (orbit + 0.005)) * c1;
            vec3 bg = mix(c3, c2, f);
            
            // النتيجة النهائية مع تباين قوي (Power) لضمان سواد الخلفية
            vec3 final = bg + glow;
            gl_FragColor = vec4(pow(final, vec3(1.3)), 1.0);
        }
    `;

    function createS(gl, src, type) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src); gl.compileShader(s);
        return s;
    }

    const program = gl2.createProgram();
    gl2.attachShader(program, createS(gl2, vs, gl2.VERTEX_SHADER));
    gl2.attachShader(program, createS(gl2, fs, gl2.FRAGMENT_SHADER));
    gl2.linkProgram(program); gl2.useProgram(program);
    const buffer = gl2.createBuffer();
    gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer);
    gl2.bufferData(gl2.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl2.STATIC_DRAW);
    const pL = gl2.getAttribLocation(program, "p");
    gl2.enableVertexAttribArray(pL); gl2.vertexAttribPointer(pL, 2, gl2.FLOAT, false, 0, 0);

    function draw() {
        if (canvas2.width !== spiralContainer.offsetWidth || canvas2.height !== spiralContainer.offsetHeight) {
            canvas2.width = spiralContainer.offsetWidth; canvas2.height = spiralContainer.offsetHeight;
            gl2.viewport(0, 0, canvas2.width, canvas2.height);
        }
        gl2.uniform2f(gl2.getUniformLocation(program, "res"), canvas.width, canvas.height);
        // تكبير الزووم ليتناسب مع التفاصيل الصغيرة
        gl2.uniform1f(gl2.getUniformLocation(program, "zoom"), 500.0 + (pC * 3000.0));
        gl2.uniform1f(gl2.getUniformLocation(program, "rot"), pA * 6.28);
        gl2.uniform3fv(gl2.getUniformLocation(program, "c1"), pal.c1);
        gl2.uniform3fv(gl2.getUniformLocation(program, "c2"), pal.c2);
        gl2.uniform3fv(gl2.getUniformLocation(program, "c3"), pal.c3);
        gl2.drawArrays(gl2.TRIANGLE_STRIP, 0, 4);
    }
    
    window.addEventListener('resize', draw);
    draw();
}

renderGenovaSpiral();