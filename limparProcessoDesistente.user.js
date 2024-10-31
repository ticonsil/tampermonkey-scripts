// ==UserScript==
// @name         Limpar Processos Desistentes
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Limpar Todos os Processos Desistentes em massa
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=125*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/limparProcessoDesistente.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/limparProcessoDesistente.user.js
// ==/UserScript==

(function() {
    'use strict';
      if (document.querySelector(`.script-item[data-name="Limpar Processos Desistentes"]`)) return;

    let scriptInfo = document.createElement('div');
    scriptInfo.className = 'script-item';
    scriptInfo.style.display = 'none';
    scriptInfo.setAttribute('data-site', 'https://app.acessorias.com/sysmain.php?m=125*');
    scriptInfo.setAttribute('data-name', 'Limpar Processos Desistentes');
    scriptInfo.setAttribute('data-department', 'TI');
    scriptInfo.setAttribute('data-function', `
        function() {
            document.addEventListener('submit', function(event) {
                event.preventDefault();  // Evita o refresh da página
            }, true);

            async function processarIds() {
                let divs = document.querySelectorAll('#divRelProcessos div[id^="divProcess_"]');

                for (let div of divs) {
                    let idNumber = div.id.match(/\d+/)[0];

                    excluiPus(idNumber);

                    await new Promise(resolve => setTimeout(resolve, 100));

                    document.querySelector('div.swal2-actions button.swal2-confirm.btn.btn-danger.marginZ').click();

                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            processarIds();

        }`);
    document.body.appendChild(scriptInfo);
})();
