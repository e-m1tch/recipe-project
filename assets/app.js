document.getElementById('recipe-form').addEventListener('submit', function(e){
    e.preventDefault();
    addRecipeToDOM();
    resetForm();
});

document.getElementById('recipeName').addEventListener('input', updatePreview);
document.getElementById('recipeInstructions').addEventListener('input', updatePreview);

function addRecipeToDOM() {
    const name = document.getElementById('recipeName').value;
    const instructions = document.getElementById('recipeInstructions').value;
    const newRecipe = document.createElement('div');
    newRecipe.className = 'recipe';
    newRecipe.innerHTML = `<h3>${name}</h3><p>${instructions}</p>`;
    document.getElementById('recipes').appendChild(newRecipe);
}

function resetForm() {
    document.getElementById('recipeName').value = '';
    document.getElementById('recipeInstructions').value = '';
    updatePreview();
}

function updatePreview() {
    document.getElementById('previewName').textContent = document.getElementById('recipeName').value;
    document.getElementById('previewInstructions').textContent = document.getElementById('recipeInstructions').value;
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const name = document.getElementById('recipeName').value;
    const instructions = document.getElementById('recipeInstructions').value;

    const pdf = new jsPDF();
    pdf.setFontSize(22);
    pdf.text(name, 20, 30);

    pdf.setFontSize(16);
    const lineHeight = 10; // Height of each line
    const maxLinesPerPage = 20; // Adjusted to avoid overlap with title
    const lines = pdf.splitTextToSize(instructions, 160); // Wrap text
    
    let page = 1;
    for(let i = 0; i < lines.length; i++) {
        // Check if we need to add a new page
        if (i % maxLinesPerPage === 0 && i !== 0) {
            pdf.addPage();
            page++;
        }
        // Calculate the y-position
        const y = (i % maxLinesPerPage + 4) * lineHeight + 20 * (page - 1); // Adjusted coordinates
        pdf.text(lines[i], 20, y);
    }

    const fileName = name.replace(/[^a-zA-Z0-9]/g, '_') + '.pdf'; // Sanitize the recipe name and use as file name
    pdf.save(fileName);
}



function exportRecipe() {
    const name = document.getElementById('recipeName').value;
    const instructions = document.getElementById('recipeInstructions').value;
    const recipeData = JSON.stringify({ name, instructions });
    const blob = new Blob([recipeData], { type: "text/json;charset=utf-8" });
    saveAs(blob, "recipe.json");
}

function importRecipe() {
    const fileInput = document.getElementById('importFile');
    const file = fileInput.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = JSON.parse(e.target.result);
            document.getElementById('recipeName').value = data.name || "";
            document.getElementById('recipeInstructions').value = data.instructions || "";
            updatePreview();
        };
        reader.readAsText(file);
    }
}
