// scripts/pdf.js
import { generateNumericId } from './firebase/firestoreOperations.js';
import { toggleButtonLoading } from './utils/helpers.js';
import { generatorPDF } from './GeneratorPDF.js'; // Assumindo que esse módulo existe no seu projeto

let uploadedLogo = null;

export async function generatePDFWithLogo() {
    toggleButtonLoading('generate-pdf-btn', true);
    try {
        const numericId = await generateNumericId();
        await generatorPDF(uploadedLogo, numericId);
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Erro ao gerar PDF. Veja o console para mais detalhes.");
    } finally {
        toggleButtonLoading('generate-pdf-btn', false);
    }
}

export function handleLogoUpload(event) {
    const file = event.target.files[0];
    const logoPreview = document.getElementById('logoPreview');
    const logoPreviewText = document.getElementById('logoPreviewText');

    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecione um arquivo de imagem válido.');
            event.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('A imagem não pode exceder 5MB.');
            event.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedLogo = e.target.result;
            logoPreview.src = uploadedLogo;
            logoPreview.style.display = 'block';
            logoPreviewText.textContent = 'Imagem selecionada: ' + file.name;
        };
        reader.onerror = function() {
            alert('Erro ao carregar a imagem.');
            event.target.value = '';
        };
        reader.readAsDataURL(file);
    } else {
        uploadedLogo = null;
        logoPreview.style.display = 'none';
        logoPreviewText.textContent = 'Nenhuma imagem selecionada.';
    }
}