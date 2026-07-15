const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", () => {

    const platform = document.getElementById("platform").value;
    const topic = document.getElementById("topic").value;
    const result = document.getElementById("result");

    if (topic.trim() === "") {
        alert("Please enter your idea.");
        return;
    }

    result.value = "Generating prompt...";
});