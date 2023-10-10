// Select DOM elements
const generateForm = document.querySelector(".generateForm");
const imageGallery = document.querySelector(".imageGallery");

// OpenAI API Key
const OPENAI_API_KEY = "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";

// Function to update image cards
const updateImgCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
        const imgCard = imageGallery.querySelectorAll(".imgCard")[index];
        const imgElement = imgCard.querySelector("img");
        const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
        imgElement.src = aiGeneratedimg;
        imgElement.onload = () => {
            imgCard.classList.remove("loading");
        };
    });
};

// Function to generate AI images
const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch(
            "https://api.openai.com/v1/images/generations",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    prompt: userPrompt,
                    n: parseInt(userImgQuantity),
                    size: "512x512",
                    response_format: "b64_json",
                }),
            }
        );

        if (!response.ok)
            throw new Error("Failed to generate the image. Please try again.");

        const { data } = await response.json();
        updateImgCard([...data]);
    } catch (error) {
        alert(error.message);
    }
};

// Function to handle form submission
const handleFormSubmission = (e) => {
    e.preventDefault();
    const userPrompt = e.target[0].value;
    const userImgQuantity = e.target[1].value;

    const imgCardMarkup = Array.from(
        { length: userImgQuantity },
        () =>
            `
        <div class="imgCard loading">
            <img src="assets/loader.svg" alt="image">
            <a href="#" class="downloadBtn">
                <img src="assets/download.svg" alt="download icon">
            </a>
        </div>
    `
    ).join("");

    imageGallery.innerHTML = imgCardMarkup;
    generateAiImages(userPrompt, userImgQuantity);
};
// Attach event listener for form submission
generateForm.addEventListener("submit", handleFormSubmission);
