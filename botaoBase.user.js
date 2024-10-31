// ==UserScript==
// @name         Botão Base Scripts
// @namespace    http://tampermonkey.net/
// @version      2.45
// @description  Botão base para gerenciar scripts no Tampermonkey
// @author       TIConsil
// @match        *://*/*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/botaoBase.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/botaoBase.user.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.top !== window.self) return;
    if (document.getElementById('script-btn')) return;

    let button = document.createElement('div');
    button.innerHTML = '˅';
    button.id = 'script-btn';
    button.style.position = 'fixed';
    button.style.top = '0';
    button.style.left = '0';
    button.style.zIndex = '9999';
    button.style.cursor = 'pointer';
    button.style.fontSize = '24px';
    button.style.padding = '0px 20px';
    button.style.backgroundColor = '#333';
    button.style.color = '#fff';
    button.style.borderRadius = '5px';
    button.style.userSelect = 'none';

    document.body.appendChild(button);

    let isDragging = false, startX, startY, startLeft, startTop;

    button.onmousedown = function(event) {
        startX = event.clientX;
        startY = event.clientY;
        isDragging = true;
        startLeft = parseInt(button.style.left) || 0;
        startTop = parseInt(button.style.top) || 0;

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    button.onclick = function(event) {
        if (startX === event.clientX && startY === event.clientY) {
            openModal();
        }
    };

    function onMouseMove(event) {
        if (!isDragging) return;
        let newX = startLeft + event.clientX - startX;
        let newY = startTop + event.clientY - startY;
        button.style.left = Math.max(0, Math.min(newX, window.innerWidth - button.offsetWidth)) + 'px';
        button.style.top = Math.max(0, Math.min(newY, window.innerHeight - button.offsetHeight)) + 'px';
    }

    function onMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    }

    button.ondragstart = function() { return false; };

    function openModal() {
        if (document.getElementById('script-modal')) return;

        let modal = document.createElement('div');
        modal.id = 'script-modal';
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.width = '50%';
        modal.style.height = '50%';
        modal.style.backgroundColor = '#fff';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.5)';
        modal.style.padding = '20px';
        modal.style.zIndex = '10000';
        modal.style.color = 'black';
        modal.style.overflow = 'auto';
        document.body.appendChild(modal);

        let closeButton = document.createElement('span');
        closeButton.innerHTML = 'X';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '0';
        closeButton.style.right = '0';
        closeButton.style.padding = '0px 10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.fontSize = '18px';
        closeButton.style.backgroundColor = 'red';
        closeButton.style.color = 'white';
        closeButton.style.borderRadius = '0px 5px 0px 0px';
        closeButton.style.userSelect = 'none';
        closeButton.onclick = function() { modal.remove(); };
        modal.appendChild(closeButton);

        let scripts = document.querySelectorAll('.script-item');
        if (scripts.length === 0) {
            modal.innerHTML += '<h2 style="text-align: center;">Não há nenhum script para este site =(</h2>';
        } else {
            let table = document.createElement('div');
            table.style.display = 'grid';
            table.style.gridTemplateColumns = '1fr 2fr 1fr';
            table.style.gap = '10px';
            table.style.width = '100%';
            table.style.textAlign = 'center';
            modal.appendChild(table);

            // Cabeçalhos
            let headers = ['Site', 'Script', 'Ação'];
            headers.forEach(headerText => {
                let header = document.createElement('div');
                header.innerHTML = headerText;
                header.style.backgroundColor = '#f0f0f0';
                header.style.fontWeight = 'bold';
                header.style.padding = '10px';
                header.style.borderBottom = '1px solid #ccc';
                table.appendChild(header);
            });

            // Conteúdo da tabela
            scripts.forEach(script => {
                // Coluna do site
                let siteCell = document.createElement('div');
                siteCell.innerHTML = script.getAttribute('data-site') || '-';
                siteCell.style.padding = '10px';
                siteCell.style.borderBottom = '1px solid #ccc';
                table.appendChild(siteCell);

                // Coluna do nome do script e departamento
                let scriptCell = document.createElement('div');
                scriptCell.style.padding = '10px';
                scriptCell.style.borderBottom = '1px solid #ccc';
                scriptCell.style.display = 'flex';
                scriptCell.style.flexDirection = 'column';
                scriptCell.style.alignItems = 'center';

                let scriptName = document.createElement('div');
                scriptName.innerHTML = script.getAttribute('data-name') || '-';
                scriptName.style.fontWeight = 'bold';

                let deptName = document.createElement('div');
                deptName.innerHTML = script.getAttribute('data-department') || '-';
                deptName.style.fontSize = '12px';
                deptName.style.color = '#666';

                scriptCell.appendChild(scriptName);
                scriptCell.appendChild(deptName);
                table.appendChild(scriptCell);

                // Coluna do botão executar
                let actionCell = document.createElement('div');
                actionCell.style.padding = '10px';
                actionCell.style.borderBottom = '1px solid #ccc';

                let executeButton = document.createElement('button');
                executeButton.innerHTML = 'Executar';
                executeButton.style.padding = '5px 10px';
                executeButton.style.backgroundColor = '#4CAF50';
                executeButton.style.color = 'white';
                executeButton.style.border = 'none';
                executeButton.style.borderRadius = '3px';
                executeButton.style.cursor = 'pointer';
                executeButton.onclick = function() {
                    modal.remove();
                    const scriptFunction = new Function(script.getAttribute('data-function') || '');
                    scriptFunction().catch(error => console.error('Erro na execução:', error));
                };

                actionCell.appendChild(executeButton);
                table.appendChild(actionCell);
            });
        }
    }
})();