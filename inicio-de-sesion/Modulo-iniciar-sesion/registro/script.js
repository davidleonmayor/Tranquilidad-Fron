document.addEventListener('DOMContentLoaded', () => {
    const daySelect = document.querySelector('select:nth-child(1)');
    const monthSelect = document.querySelector('select:nth-child(2)');
    const yearSelect = document.querySelector('select:nth-child(3)');
  
    // Llenar los días (1-31)
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      daySelect.appendChild(option);
    }
  
    // Llenar los meses (Enero-Diciembre)
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",

      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    months.forEach((month, index) => {
      const option = document.createElement('option');
      option.value = index + 1; // Los meses van del 1 al 12
      option.textContent = month;
      monthSelect.appendChild(option);
    });
  
    // Llenar los años (1900 - año actual)
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 1900; i--) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      yearSelect.appendChild(option);
    }
  });