// ==UserScript==
// @name         Baixar anexo em massa no webmail - Geral
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Baixa todos os anexos do e-mail, mas é necessário clicar com o botão direito em um dos anexos e ir em inspecionar para abrir o console
// @author       TIConsil
// @match        https://webmail.consilcontabilidade.com/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/baixarAnexoEmMassaWebmail.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/baixarAnexoEmMassaWebmail.user.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.querySelector(`.script-item[data-name="Baixar anexo em massa no webmail - Geral"]`)) return;


    let scriptInfo = document.createElement('div');
    scriptInfo.className = 'script-item';
    scriptInfo.style.display = 'none';
    scriptInfo.setAttribute('data-site', 'webmail.consilcontabilidade.com');
    scriptInfo.setAttribute('data-name', 'Baixar anexo em massa no webmail - Geral');
    scriptInfo.setAttribute('data-department', 'Geral');
    scriptInfo.setAttribute('data-function', `
            const attachmentList = document.querySelector('#attachment-list');

if (attachmentList) {
    // Obtém todos os elementos li dentro da ul
    const listItems = attachmentList.querySelectorAll('li');

    // Itera sobre cada li
    listItems.forEach((listItem, index) => {
        // Encontra o link 'a' com href='#'
        const anchor = listItem.querySelector('a[href="#"]');

        if (anchor) {
            // Cria um timeout para espaçar as ações
            setTimeout(() => {
                // Simula um clique no link
                anchor.click();

                // Espera 700ms antes de procurar o link de download global
                setTimeout(() => {
                    const downloadLink = document.querySelector('a#attachmenudownload');

                    if (downloadLink) {
                        downloadLink.click();
                    } else {
                        console.warn('Link de download não encontrado após clicar no item ' + (index + 1));
                    }
                }, 700); // Aguarda 700ms para garantir que o submenu carregue
            }, index * 1400); // 1400ms entre cada iteração para evitar sobreposição
        } else {
            console.warn('Anchor com href="#" não encontrado no item ' + (index + 1));
        }
    });
} else {
    console.error('A lista de anexos (#attachment-list) não foi encontrada.');
}

    `);
    document.body.appendChild(scriptInfo);
})();
