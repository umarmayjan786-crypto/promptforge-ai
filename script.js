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