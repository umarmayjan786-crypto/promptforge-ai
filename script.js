const historyBox = document.getElementById("history");

let promptHistory = JSON.parse(localStorage.getItem("promptHistory")) || [];

function renderHistory(){

    historyBox.innerHTML = "";

    promptHistory.forEach((prompt)=>{

        const div = document.createElement("div");

        div.className = "history-item";

        div.textContent = prompt.substring(0,80)+"...";

        div.onclick = ()=>{

            document.getElementById("result").value = prompt;

        };

        historyBox.appendChild(div);

    });

}


const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {

    const platform = document.getElementById("platform").value;
    const category = document.getElementById("category").value;
    const topic = document.getElementById("topic").value;
    const result = document.getElementById("result");

    if (!topic.trim()) {
        alert("Please enter your idea.");
        return;
    }

    result.value = "Generating professional AI prompt..."; 

generateBtn.disabled = true;
generateBtn.innerText = "⏳ Generating...";

    try {

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                platform,
                category,
                topic
            })
        });

        const data = await response.json();

        if (data.result) {
            result.value = data.result;
        } else {
            result.value = data.error || "Unknown error";
        }
        generateBtn.disabled = false;
        generateBtn.innerText = "🚀 Generate Prompt";

       if (data.result) {

    promptHistory.unshift(data.result);

    promptHistory = promptHistory.slice(0, 10);

    localStorage.setItem(
        "promptHistory",
        JSON.stringify(promptHistory)
    );

    renderHistory();

} else {

    historyBox.innerHTML = "<p>No prompts yet.</p>";

}


    } catch (error) {

        console.error(error);
result.value = error.message || "Something went wrong.";
generateBtn.disabled = false;
        generateBtn.innerText = "🚀 Generate Prompt";
    }

});

const copyBtn = document.getElementById("copyBtn");

copyBtn.addEventListener("click", async () => {

    const result = document.getElementById("result");

    if (!result.value.trim()) {
        alert("No prompt to copy!");
        return;
    }

    try {
        await navigator.clipboard.writeText(result.value);

        copyBtn.innerText = "✅ Copied!";

        setTimeout(() => {
            copyBtn.innerText = "📋 Copy Prompt";
        }, 2000);

    } catch (err) {
        alert("Copy failed.");
    }

});

renderHistory();

document.getElementById("topic")
.addEventListener("keydown",(e)=>{

if(e.ctrlKey && e.key==="Enter"){

generateBtn.click();

}

});

const themeBtn = document.getElementById("themeBtn");

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        themeBtn.innerText = "☀️ Light Mode";
    }else{
        themeBtn.innerText = "🌙 Dark Mode";
    }

});



// =========================
// TEMPLATE SYSTEM
// =========================

const templateButtons = document.querySelectorAll(".template-btn");
const templateSearch = document.getElementById("templateSearch");
const templateCategory = document.getElementById("templateCategory");
const topicInput = document.getElementById("topic");

// Click → Auto Fill
templateButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        topicInput.value = btn.innerText;

    });

});

// Search + Category Filter
function filterTemplates(){

    const search = templateSearch.value.toLowerCase();
    const category = templateCategory.value;

    templateButtons.forEach(btn=>{

        const text = btn.innerText.toLowerCase();
        const btnCategory = btn.dataset.category;

        const searchMatch = text.includes(search);
        const categoryMatch =
            category==="all" ||
            btnCategory===category;

        if(searchMatch && categoryMatch){

            btn.style.display="inline-block";

        }else{

            btn.style.display="none";

        }

    });

}

templateSearch.addEventListener("input", filterTemplates);

templateCategory.addEventListener("change", filterTemplates);

// ===========================
// TOAST
// ===========================

const toast = document.getElementById("toast");

function showToast(message){

    toast.innerText = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2000);

}

// ===========================
// COPY SUCCESS
// ===========================

copyBtn.addEventListener("click",()=>{

    showToast("✅ Prompt Copied");

});

// ===========================
// CLEAR HISTORY
// ===========================

const clearBtn =
document.getElementById("clearHistoryBtn");

clearBtn.addEventListener("click",()=>{

    promptHistory=[];

    localStorage.removeItem("promptHistory");

    renderHistory();

    showToast("🗑 History Cleared");

});

// ===========================
// WORD COUNTER
// ===========================

const wordCount =
document.getElementById("wordCount");

const charCount =
document.getElementById("charCount");

topicInput.addEventListener("input",()=>{

    const text = topicInput.value;

    const words =
    text.trim()===""
    ?0
    :text.trim().split(/\s+/).length;

    wordCount.innerText =
    "Words: "+words;

    charCount.innerText =
    "Characters: "+text.length;

});


// ===========================
// DOWNLOAD PROMPT
// ===========================

const downloadBtn =
document.getElementById("downloadBtn");

downloadBtn.addEventListener("click",()=>{

    const text=result.value;

    if(!text.trim()){

        showToast("No Prompt");

        return;

    }

    const blob=new Blob([text],{type:"text/plain"});

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download="PromptForge-Prompt.txt";

    a.click();

    showToast("Prompt Downloaded");

});

// ===========================
// GENERATE AGAIN
// ===========================

const regenerateBtn=
document.getElementById("regenerateBtn");

regenerateBtn.addEventListener("click",()=>{

    generateBtn.click();

});

// ===========================
// CLEAR TOPIC
// ===========================

const clearTopicBtn=
document.getElementById("clearTopicBtn");

clearTopicBtn.addEventListener("click",()=>{

    topicInput.value="";

    wordCount.innerText="Words: 0";

    charCount.innerText="Characters: 0";

    showToast("Topic Cleared");

});

// ==========================
// POPULAR + RECENT
// ==========================

const popularTemplates = [
"Realistic Portrait",
"Cinematic Video",
"Facebook Ad",
"Blog Writing",
"HTML Landing Page"
];

const popularBox =
document.getElementById("popularTemplates");

const recentBox =
document.getElementById("recentTemplates");

let recent =
JSON.parse(localStorage.getItem("recent")) || [];

function renderPopular(){

popularBox.innerHTML="";

popularTemplates.forEach(name=>{

const div=document.createElement("div");

div.className="popular-item";

div.innerText=name;

div.onclick=()=>{

topicInput.value=name;

};

popularBox.appendChild(div);

});

}

function renderRecent(){

recentBox.innerHTML="";

recent.forEach(name=>{

const div=document.createElement("div");

div.className="popular-item";

div.innerText=name;

div.onclick=()=>{

topicInput.value=name;

};

recentBox.appendChild(div);

});

}

templateButtons.forEach(btn=>{

btn.addEventListener("click",()=>{

recent.unshift(btn.innerText);

recent=[...new Set(recent)];

recent=recent.slice(0,5);

localStorage.setItem(
"recent",
JSON.stringify(recent)
);

renderRecent();

});

});

renderPopular();

renderRecent();
// =============================
// FAVORITES + POPULAR + RECENT
// =============================

const favButtons = document.querySelectorAll(".fav-btn");
const popularBox = document.getElementById("popularTemplates");
const recentBox = document.getElementById("recentTemplates");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let recent = JSON.parse(localStorage.getItem("recentTemplates")) || [];

function renderPopular() {

    popularBox.innerHTML = "";

    favorites.forEach(name => {

        const btn = document.createElement("button");

        btn.textContent = name;

        btn.onclick = () => {

            document.getElementById("topic").value = name;

        };

        popularBox.appendChild(btn);

    });

}

function renderRecent() {

    recentBox.innerHTML = "";

    recent.forEach(name => {

        const btn = document.createElement("button");

        btn.textContent = name;

        btn.onclick = () => {

            document.getElementById("topic").value = name;

        };

        recentBox.appendChild(btn);

    });

}

favButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const name =
            btn.previousElementSibling.innerText;

        if (!favorites.includes(name)) {

            favorites.unshift(name);

            favorites = favorites.slice(0, 8);

            localStorage.setItem(
                "favorites",
                JSON.stringify(favorites)
            );

            renderPopular();

        }

    });

});

templateButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        const name = btn.innerText;

        recent = recent.filter(x => x !== name);

        recent.unshift(name);

        recent = recent.slice(0, 8);

        localStorage.setItem(
            "recentTemplates",
            JSON.stringify(recent)
        );

        renderRecent();

    });

});

renderPopular();
renderRecent();