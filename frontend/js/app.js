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

    // --- 1. كرت التغذية (Diet Card) ---
    if (id === 'diet') {
        addHeader(modalBody, "Vitamins & Supplements Analysis", "#4ade80");
        
        // فيتامين D
        addReportItem(modalBody, "Vitamin D Absorption", "VDR", 
            userDNA.includes("AGTC") ? "Reduced Absorption" : "Normal", 
            "Maintain moderate sun exposure.", "fas fa-sun");

        // فيتامين B12
        addReportItem(modalBody, "Vitamin B12 Levels", "FUT2", 
            userDNA.includes("TTCG") ? "Tendency for Deficiency" : "Normal", 
            "Focus on B12-rich foods.", "fas fa-capsules");

        // فيتامين A
        addReportItem(modalBody, "Vitamin A Conversion", "BCO1", 
            userDNA.includes("GCTA") ? "Reduced Efficiency" : "Normal", 
            "Include pre-formed Vitamin A.", "fas fa-eye");

        addHeader(modalBody, "Nutritional Genomics Traits", "#d4af37");

        // الملح
        addReportItem(modalBody, "Sodium Sensitivity", "ACE", 
            userDNA.includes("TTCA") ? "Salt Sensitive" : "Normal", 
            "Limit salt intake.", "fas fa-salt-shaker");

        // السكر
        addReportItem(modalBody, "Sugar Processing", "TCF7L2", 
            userDNA.includes("GACG") ? "Lower Sensitivity" : "Normal", 
            "Choose complex carbs.", "fas fa-cube");

        // الكافيين
        addReportItem(modalBody, "Caffeine Sensitivity", "CYP1A2", 
            userDNA.includes("CCTA") ? "Slow Metabolizer" : "Normal", 
            "Avoid coffee after 3 PM.", "fas fa-coffee");

        // اللاكتوز
        addReportItem(modalBody, "Lactose Intolerance", "MCM6", 
            userDNA.includes("CTTG") ? "Lactose Intolerant" : "Normal", 
            "Try lactose-free milk.", "fas fa-glass-milk");

        modal.style.display = "block";
    } 
    
    // --- 2. كرت التوتر (Stress Card) ---
    else if (id === 'stress') {
        addHeader(modalBody, "Stress Response Analysis", "#818cf8");

        addReportItem(modalBody, "Stress Handling Style", "COMT", 
            userDNA.includes("GAAA") ? "Worrier (Slow COMT)" : "Warrior (Fast COMT)", 
            "Practice mindfulness.", "fas fa-brain");

        addReportItem(modalBody, "Emotional Reactivity", "MAOA", 
            userDNA.includes("CCTG") ? "Highly Reactive" : "Balanced Response", 
            "Fast emotional response.", "fas fa-bolt");

        modal.style.display = "block";
    }
}

// دالة العناوين
function addHeader(container, text, color) {
    const h = document.createElement("h2");
    h.innerText = text;
    h.style.cssText = "color:" + color + "; font-size:1.3rem; margin-top:25px; margin-bottom:12px; border-bottom:1px solid " + color + "; display:inline-block;";
    container.appendChild(h);
}

function addReportItem(container, title, gene, result, advice, icon) {
    const div = document.createElement("div");
    
    // تصحيح السطر 85: إضافة علامات || بين الشروط
    const isRisk = result.includes("Reduced") || result.includes("Sensitive") || result.includes("Intolerant") || result.includes("Deficiency") || result.includes("Slow") || result.includes("Worrier");
    
    const color = isRisk ? "#ef4444" : "#22c55e"; 

    div.style.cssText = "display:flex; align-items:center; margin-bottom:15px; padding:15px; background:rgba(255,255,255,0.05); border-radius:12px; border-left:5px solid " + color + ";";
    
    // تصحيح الأسطر 90-93: بناء النص البرمجي بشكل سليم
    let html = '<div style="font-size:1.8rem; margin-right:15px; color:' + color + '; min-width:50px; text-align:center;"><i class="' + icon + '"></i></div>';
    html += '<div>';
    html += '<h3 style="color:#f8fafc; font-size:1.1rem; margin:0;">' + title + '</h3>';
    html += '<p style="color:#94a3b8; font-size:0.9rem; margin:4px 0;">Gene: ' + gene + ' | Result: <span style="color:' + color + ';">' + result + '</span></p>';
    html += '<p style="color:#cbd5e1; font-size:0.85rem; margin:0;">Advice: ' + advice + '</p>';
    html += '</div>';
    
    div.innerHTML = html;
    container.appendChild(div);
}
// إغلاق النافذة
function closeModal() {
    document.getElementById('reportModal').style.display = "none";
}

window.onclick = function(event) {
    const m = document.getElementById('reportModal');
    if (event.target == m) m.style.display = "none";
};