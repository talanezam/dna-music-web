// دالة لإظهار وإخفاء التفاصيل داخل الكروت
function toggleDetails(id) {
    const element = document.getElementById(id);
    
    // إذا كان مخفي بنظهره، وإذا ظاهر بنخفيه
    if (element.style.display === "block") {
        element.style.display = "none";
    } else {
        element.style.display = "block";
    }
}

console.log("System Ready: Genomic Logic Loaded.");