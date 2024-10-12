const steelSections = {
    "Steel Plates and Sheets": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Chequered Steel Plates": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Seamless Steel Pipes - Circular": ["Length (mm)", "Outer Diameter (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Square": ["Length (mm)", "Side Length (mm)", "Thickness (mm)"],
    "Hollow Structural Sections - Rectangular": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Round Steel Bars": ["Length (mm)", "Diameter (mm)"],
    "Square Steel Bars": ["Length (mm)", "Side Length (mm)"],
    "Flat Bars": ["Length (mm)", "Width (mm)", "Thickness (mm)"],
    "Equal Angles": ["Length (mm)", "Leg Length (mm)", "Thickness (mm)"],
    "Unequal Angles": ["Length (mm)", "Leg Length 1 (mm)", "Leg Length 2 (mm)", "Thickness (mm)"],
    "T-profile": ["Length (mm)", "Width (mm)", "Height (mm)", "Thickness (mm)"],
    "Hexagonal Sections": ["Length (mm)", "Flat to Flat Distance (mm)"]
};

function showFields() {
    const sectionType = document.getElementById("sectionType").value;
    const fieldsContainer = document.getElementById("fields");
    const sectionImage = document.getElementById("sectionImage");

    fieldsContainer.innerHTML = '';
    sectionImage.style.display = "none";

    if (sectionType === "UPN") {
        window.location.href = "https://mohmohragrag.github.io/Calculator_Elsafwaa/upn/index.html";
    } else if (sectionType === "IPN") {
        window.location.href = "https://mohmohragrag.github.io/Calculator_Elsafwaa/ipn/index.html";
    } else if (sectionType === "IPE") {
        window.location.href = "https://mohmohragrag.github.io/Calculator_Elsafwaa/ipe/index.html";
    } else if (sectionType === "HEA") {
        window.location.href = "https://mohmohragrag.github.io/Calculator_Elsafwaa/hea/index.html";
    } else if (sectionType === "HEB") {
        window.location.href = "https://mohmohragrag.github.io/Calculator_Elsafwaa/heb/index.html";
    } else if (sectionType && steelSections[sectionType]) {
        steelSections[sectionType].forEach(field => {
            const inputField = document.createElement("input");
            inputField.type = "number";
            inputField.placeholder = field;
            inputField.oninput = calculateWeight;
            fieldsContainer.appendChild(inputField);
        });

        sectionImage.src = `images/${sectionType.replace(/\s+/g, '_').toLowerCase()}.png`;
        sectionImage.style.display = "block";
    } else {
        alert("Invalid section type selected. Please choose a valid option.");
    }
}

function calculateWeight() {
    const sectionType = document.getElementById("sectionType").value;
    const fields = document.getElementById("fields").children;
    const quantity = parseFloat(document.getElementById("quantity").value) || 1; // Default to 1 if not a valid number
    const density = 7850; // kg/m³ for steel
    let weight = 0;

    if (sectionType && fields.length > 0) {
        const values = Array.from(fields).map(field => parseFloat(field.value));

        if (values.some(value => isNaN(value) || value <= 0)) {
            document.getElementById("result").innerHTML = "Please enter valid dimensions for all fields. Values must be greater than zero.";
            return;
        }

        switch (sectionType) {
            case "Steel Plates and Sheets":
                const [lengthPlate, widthPlate, thicknessPlate] = values;
                weight = (lengthPlate / 1000) * (widthPlate / 1000) * (thicknessPlate / 1000) * density;
                break;

            case "Chequered Steel Plates":
                const [lengthCheq, widthCheq, thicknessCheq] = values;
                const adjustedThickness = (thicknessCheq + 0.3);
                weight = (lengthCheq / 1000) * (widthCheq / 1000) * (adjustedThickness / 1000) * density;
                break;

            case "Seamless Steel Pipes - Circular":
                const [lengthPipe, outerDiameter, thicknessPipe] = values;
                weight = ((outerDiameter - thicknessPipe) * thicknessPipe * (lengthPipe + 20) * 0.025) / 1000;
                break;

            case "Hollow Structural Sections - Square":
                const [lengthSquare, sideLengthSquare, thicknessSquare] = values;
                const outerAreaSquare = Math.pow(sideLengthSquare / 1000, 2); // المساحة الخارجية
                const innerAreaSquare = Math.pow((sideLengthSquare - 2 * thicknessSquare) / 1000, 2); // المساحة الداخلية
                weight = (lengthSquare / 1000) * (outerAreaSquare - innerAreaSquare) * density;
                break;

            case "Hollow Structural Sections - Rectangular":
                const [lengthRect, widthRect, heightRect, thicknessRect] = values;
                const outerAreaRect = (widthRect / 1000) * (heightRect / 1000); // المساحة الخارجية
                const innerAreaRect = ((widthRect - 2 * thicknessRect) / 1000) * ((heightRect - 2 * thicknessRect) / 1000); // المساحة الداخلية
                weight = (lengthRect / 1000) * (outerAreaRect - innerAreaRect) * density;
                break;

            case "Round Steel Bars":
                const [lengthRound, diameterRound] = values;
                weight = (lengthRound / 1000) * (Math.PI / 4) * Math.pow((diameterRound / 1000), 2) * density;
                break;

            case "Square Steel Bars":
                const [lengthSquareBar, sideLengthSquareBar] = values;
                weight = (lengthSquareBar / 1000) * Math.pow((sideLengthSquareBar / 1000), 2) * density;
                break;

            case "Flat Bars":
                const [lengthFlat, widthFlat, thicknessFlat] = values;
                weight = (lengthFlat / 1000) * (widthFlat / 1000) * (thicknessFlat / 1000) * density;
                break;

            case "Equal Angles":
                const [lengthEqual, legLengthEqual, thicknessEqual] = values;
                weight = (lengthEqual / 1000) * ((legLengthEqual / 1000) * (legLengthEqual / 1000) - ((legLengthEqual - thicknessEqual) / 1000) * ((legLengthEqual - thicknessEqual) / 1000)) * density;
                break;

            case "Unequal Angles":
                const [lengthUnequal, legLength1Unequal, legLength2Unequal, thicknessUnequal] = values;
                weight = (lengthUnequal / 1000) * (((legLength1Unequal / 1000) * (legLength2Unequal / 1000)) - (((legLength1Unequal - thicknessUnequal) / 1000) * ((legLength2Unequal - thicknessUnequal) / 1000))) * density;
                break;

            case "T-profile":
                const [lengthT, widthT, heightT, thicknessT] = values;
                weight = (lengthT / 1000) * ((widthT / 1000) * (heightT / 1000) - ((widthT - 2 * thicknessT) / 1000) * ((heightT - thicknessT) / 1000)) * density;
                break;

            case "Hexagonal Sections":
                const [lengthHex, flatToFlat] = values;
                const hexArea = (3 * Math.sqrt(3) / 2) * Math.pow((flatToFlat / 1000), 2);
                weight = lengthHex * hexArea * density / 1000; // Convert to kg
                break;

            default:
                document.getElementById("result").innerHTML = "Invalid section type.";
                return;
        }

        // Multiply by quantity
        weight *= quantity;

        // Display the result
        document.getElementById("result").innerHTML = `Total Weight: ${weight.toFixed(3)} kg`;
    } else {
        document.getElementById("result").innerHTML = "Please select a section type and enter valid dimensions.";
    }
}
