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
    let thickness = 2.2 + (percentC * 3.0); 

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