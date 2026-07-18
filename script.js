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

        promptHistory.unshift(data.result);

promptHistory = promptHistory.slice(0,10);

localStorage.setItem("promptHistory", JSON.stringify(promptHistory));

renderHistory();

if(promptHistory.length===0){

    historyBox.innerHTML="<p>No prompts yet.</p>";

    return;

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

const templateButtons = document.querySelectorAll(".template-btn");
const topicInput = document.getElementById("topic");

templateButtons.forEach(btn => {

    btn.addEventListener("click", () => {

        topicInput.value = btn.innerText;

    });

});

const searchBox = document.getElementById("templateSearch");

searchBox.addEventListener("input", () => {

    const value = searchBox.value.toLowerCase();

    templateButtons.forEach(btn => {

        if(btn.innerText.toLowerCase().includes(value)){
            btn.style.display = "inline-block";
        }else{
            btn.style.display = "none";
        }

    });

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