// ==UserScript==
// @name         Excluir obrigações dp - Pessoal
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Exclui todas as obrigações do dp na aba de empresas
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/deleteTaskDP.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/deleteTaskDP.user.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector(`.script-item[data-name="Excluir obrigações dp - Pessoal"]`)) return;


    let scriptInfo = document.createElement('div');
    scriptInfo.className = 'script-item';
    scriptInfo.style.display = 'none';
    scriptInfo.setAttribute('data-site', 'https://app.acessorias.com/sysmain.php?m=105*');
    scriptInfo.setAttribute('data-name', 'Excluir obrigações dp - Pessoal');
    scriptInfo.setAttribute('data-department', 'Pessoal');
    scriptInfo.setAttribute('data-function', `
            const divODP = document.querySelector('div#divObrDpt3 div#ODP_3');
            const divOBR = divODP.querySelectorAll('[id^="divObr_"]');
            const mudarOBRX = divODP.querySelectorAll('[id^="dMudaObrX_"]');
            const selects = divODP.querySelectorAll('select');

            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Suas funções originais (com uma pequena melhoria em clicarSalvar)
function preencherSelects() {
    selects.forEach(select => {
        select.value = 1;
        select.dispatchEvent(new Event('change'));
    });
}

// Se for necessário, ative; Como está puxando o D automatico, esse código dá conflito e não funfa nada
// function preencherSelectsNome() {
//     selects.forEach(select => {
//         select.value = 'D';
//     });
// }

function clicarSalvar() {
    const salvarButton = document.querySelector('button.btn.btn-sm.btn-success.col-xs-6.col-sm-6[onclick="check_form(this);"]');
    if (salvarButton) {
        salvarButton.click();
    } else {
        console.error('Botão "Salvar" não encontrado. Verifique o seletor.');
    }
}


async function executarSequencia() {
    console.log("Passo 1: Preenchendo selects (valor 1)...");
    preencherSelects();
    
    await delay(20000); // Espera 5 segundos

    console.log("Passo 3: Clicando em Salvar...");
    clicarSalvar();
}


executarSequencia();

    `);
    document.body.appendChild(scriptInfo);
})();
