// ==UserScript==
// @name         Botão Base Scripts
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Gerenciador de scripts do Tampermonkey
// @author       TIConsil
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/botaoBase.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/botaoBase.user.js
// ==/UserScript==

(function() {
  'use strict';

  if (window.top !== window.self) return;
  if (document.getElementById('script-btn')) return;

  // --- 1. Estilos CSS (Visual Moderno) ---
  // Injetamos CSS para facilitar a manutenção e deixar o visual "Clean"
  const style = document.createElement('style');
  style.innerHTML = `
      #script-btn {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 9999;
          width: 50px;
          height: 50px;
          background-color: #333;
          color: #fff;
          border-radius: 50%;
          cursor: grab;
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          user-select: none;
          transition: opacity 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
          opacity: 0.2; /* Opacidade inicial baixa */
      }
      #script-btn:active {
          cursor: grabbing;
          transform: scale(0.95);
      }
      /* Modal Overlay (Fundo Escuro) */
      #script-modal-overlay {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.5);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(3px);
      }
      /* Modal Container */
      #script-modal {
          background: #fff;
          width: 60%;
          max-width: 800px;
          height: auto;
          max-height: 80%;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          animation: fadeIn 0.2s ease-out;
      }
      /* Cabeçalho do Modal */
      .modal-header {
          padding: 15px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
      }
      .modal-title { font-size: 18px; font-weight: bold; color: #333; }
      .close-btn {
          background: #ff4d4d;
          color: white;
          border: none;
          border-radius: 5px;
          width: 30px;
          height: 30px;
          cursor: pointer;
          font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.2s;
      }
      .close-btn:hover { background: #cc0000; }

      /* Conteúdo (Tabela) */
      .modal-body {
          padding: 20px;
          overflow-y: auto;
      }
      .script-grid {
          display: grid;
          grid-template-columns: 1fr 2fr 100px; /* Site | Nome/Depto | Ação */
          gap: 10px;
          align-items: center;
      }
      .grid-header {
          font-weight: bold;
          background: #eee;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
      }
      .grid-row {
          display: contents; /* Permite que os filhos façam parte do grid pai */
      }
      .grid-cell {
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          text-align: center;
      }
      .exec-btn {
          background-color: #28a745;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          transition: background 0.2s;
      }
      .exec-btn:hover { background-color: #218838; }

      @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `;
  document.head.appendChild(style);

  // --- 2. Criação do Botão ---
  let button = document.createElement('div');
  // Ícone de "Ferramentas" SVG em vez de texto simples
  button.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>`;
  button.id = 'script-btn';
  document.body.appendChild(button);

  // --- 3. Lógica de Proximidade (Opacidade) ---
  // O botão fica com opacidade 0.2 (definido no CSS).
  // Calculamos a distância do mouse. Se < 150px, ele acende.
  document.addEventListener('mousemove', function(e) {
      // Se estiver arrastando, mantém aceso
      if (isDragging) {
          button.style.opacity = '1';
          return;
      }

      const btnRect = button.getBoundingClientRect();
      // Centro do botão
      const btnX = btnRect.left + btnRect.width / 2;
      const btnY = btnRect.top + btnRect.height / 2;

      // Distância euclidiana (hipotenusa)
      const dist = Math.hypot(e.clientX - btnX, e.clientY - btnY);

      // Se estiver a menos de 150px, opacidade 1, senão 0.2
      if (dist < 150) {
          button.style.opacity = '1';
      } else {
          button.style.opacity = '0.2';
      }
  });

  // --- 4. Lógica de Arrastar (Drag) Robusta ---
  let isDragging = false;
  let startX, startY, initialLeft, initialTop;

  button.onmousedown = function(event) {
      // Previne arrastar se clicar com botão direito
      if (event.button !== 0) return;

      isDragging = true;
      startX = event.clientX;
      startY = event.clientY;

      const rect = button.getBoundingClientRect();
      initialLeft = rect.left;
      initialTop = rect.top;

      button.style.cursor = 'grabbing';

      // Adiciona listeners ao document para garantir que o arraste continue
      // mesmo se o mouse sair de cima do botão rapidamente
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      event.preventDefault(); // Evita selecionar texto
  };

  function onMouseMove(event) {
      if (!isDragging) return;

      // CORREÇÃO CRÍTICA: Se nenhum botão do mouse estiver pressionado, para o arraste.
      // Isso corrige o bug de "ficar seguindo o mouse" se o soltar fora da janela.
      if (event.buttons === 0) {
          onMouseUp();
          return;
      }

      let deltaX = event.clientX - startX;
      let deltaY = event.clientY - startY;

      let newLeft = initialLeft + deltaX;
      let newTop = initialTop + deltaY;

      // Limites da tela
      newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - button.offsetWidth));
      newTop = Math.max(0, Math.min(newTop, window.innerHeight - button.offsetHeight));

      button.style.left = newLeft + 'px';
      button.style.top = newTop + 'px';
  }

  function onMouseUp() {
      isDragging = false;
      button.style.cursor = 'grab';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
  }

  // --- 5. Lógica de Clique e Modal ---
  button.onclick = function(event) {
      // Só abre se foi um clique rápido (não foi um arraste)
      // Usamos uma pequena margem de erro (3px) para diferenciar clique de tremida
      const moved = Math.hypot(event.clientX - startX, event.clientY - startY);
      if (moved < 3) {
          openModal();
      }
  };

  function openModal() {
      if (document.getElementById('script-modal-overlay')) return;

      // Cria o Overlay (Fundo escuro)
      let overlay = document.createElement('div');
      overlay.id = 'script-modal-overlay';

      // Cria o Modal
      let modal = document.createElement('div');
      modal.id = 'script-modal';

      // Cabeçalho
      let header = document.createElement('div');
      header.className = 'modal-header';
      header.innerHTML = '<div class="modal-title">Scripts Disponíveis</div>';

      let closeBtn = document.createElement('button');
      closeBtn.className = 'close-btn';
      closeBtn.innerHTML = 'X';
      // O clique no fechar remove o overlay inteiro
      closeBtn.onclick = function() { overlay.remove(); };

      header.appendChild(closeBtn);
      modal.appendChild(header);

      // Corpo
      let body = document.createElement('div');
      body.className = 'modal-body';

      let scripts = document.querySelectorAll('.script-item');

      if (scripts.length === 0) {
          body.innerHTML = '<div style="text-align:center; color:#666; padding: 20px;">Não há nenhum script configurado para esta página =(</div>';
      } else {
          let grid = document.createElement('div');
          grid.className = 'script-grid';

          // Cabeçalhos da Tabela
          ['Site', 'Detalhes', 'Ação'].forEach(text => {
              let h = document.createElement('div');
              h.className = 'grid-header';
              h.innerText = text;
              grid.appendChild(h);
          });

          // Linhas
          scripts.forEach(script => {
              // Célula Site
              let cellSite = document.createElement('div');
              cellSite.className = 'grid-cell';
              cellSite.innerText = script.getAttribute('data-site') || '-';
              grid.appendChild(cellSite);

              // Célula Detalhes (Nome + Depto)
              let cellDetails = document.createElement('div');
              cellDetails.className = 'grid-cell';
              cellDetails.innerHTML = `
                  <div style="font-weight:bold;">${script.getAttribute('data-name') || '-'}</div>
                  <div style="font-size:12px; color:#666;">${script.getAttribute('data-department') || '-'}</div>
              `;
              grid.appendChild(cellDetails);

              // Célula Botão
              let cellAction = document.createElement('div');
              cellAction.className = 'grid-cell';
              let btnExec = document.createElement('button');
              btnExec.className = 'exec-btn';
              btnExec.innerText = 'Executar';
              btnExec.onclick = function() {
                  overlay.remove();
                  const funcBody = script.getAttribute('data-function') || '';
                  try {
                      const scriptFunction = new Function(funcBody);
                      scriptFunction();
                  } catch (err) {
                      console.error('Erro ao executar script:', err);
                      alert('Erro ao executar: ' + err.message);
                  }
              };
              cellAction.appendChild(btnExec);
              grid.appendChild(cellAction);
          });

          body.appendChild(grid);
      }

      modal.appendChild(body);
      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Fecha ao clicar fora do modal (no fundo escuro)
      overlay.onclick = function(e) {
          if (e.target === overlay) overlay.remove();
      };
  }

})();