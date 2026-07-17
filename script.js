const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {

    const platform = document.getElementById("platform").value;
    const topic = document.getElementById("topic").value;
    const result = document.getElementById("result");

    if (!topic.trim()) {
        alert("Please enter your idea.");
        return;
    }

    result.value = "Generating professional AI prompt...";

    try {

        const response = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                platform,
                topic
            })
        });

        const data = await response.json();

        if (data.result) {
            result.value = data.result;
        } else {
            result.value = data.error || "Unknown error";
        }

    } catch (error) {

        result.value = "Connection Error";

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