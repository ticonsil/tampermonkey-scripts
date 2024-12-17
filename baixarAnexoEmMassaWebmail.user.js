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

(function () {
  'use strict';
  if (
    document.querySelector(
      `.script-item[data-name="Baixar anexo em massa no webmail - Geral"]`
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute('data-site', 'webmail.consilcontabilidade.com');
  scriptInfo.setAttribute(
    'data-name',
    'Baixar anexo em massa no webmail - Geral'
  );
  scriptInfo.setAttribute('data-department', 'Geral');
  scriptInfo.setAttribute(
    'data-function',
    `
    function downloadAttachments() {
   
    const messageContent = document.getElementById('message-content');
    
    
    if (!messageContent) {
        console.error('Div message-content não encontrada');
        return;
    }
    
   
    const attachmentLinks = Array.from(
        messageContent.querySelector('#attachment-list')?.querySelectorAll('li')
    ).map(li => li.querySelector('a'));
    
   
    if (attachmentLinks.length === 0) {
        console.error('Nenhum link de anexo encontrado');
        return;
    }
    
    // Modifica os links adicionando &_download=1
    const downloadLinks = Array.from(attachmentLinks)
        .map(link => {
            const originalHref = link.href;
            return originalHref + (originalHref.includes('?') ? '&' : '?') + '_download=1';
        });
    
    // Função para download sequencial
    function downloadSequentially(links, index = 0) {
	
        if (index >= links.length) return;
        
        const link = links[index];
        console.log(link);
       

        const tempLink = document.createElement('a');
        tempLink.href = link;
        tempLink.setAttribute('download', '');
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        setTimeout(() => {
            downloadSequentially(links, index + 1);
        }, 500); // Delay de 500ms entre os downloads
    }
    
    downloadSequentially(downloadLinks);
}


downloadAttachments();

    `
  );
  document.body.appendChild(scriptInfo);
})();
