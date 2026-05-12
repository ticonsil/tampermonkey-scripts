// ==UserScript==
// @name         Adicionar Tarefa Planejamento Tributário - Fiscal
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adiciona as tarefas: Reclamações; IRPJ e CSLL; Situação Fiscal - Planejamento; Conferência Caixa Postal ECAC
// @author       TIConsil
// @match        https://app.acessorias.com/sysmain.php?m=105*
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/acessorias/Empresas/adicionarTarefasPlanejamentoTributario.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/acessorias/Empresas/adicionarTarefasPlanejamentoTributario.user.js
// ==/UserScript==

(function () {
  'use strict';
  if (
    document.querySelector(
      `.script-item[data-name="Excluir obrigações df - Fiscal"]`,
    )
  )
    return;

  let scriptInfo = document.createElement('div');
  scriptInfo.className = 'script-item';
  scriptInfo.style.display = 'none';
  scriptInfo.setAttribute(
    'data-site',
    'https://app.acessorias.com/sysmain.php?m=105*',
  );
  scriptInfo.setAttribute('data-name', 'Excluir obrigações df - Fiscal');
  scriptInfo.setAttribute('data-department', 'Fiscal');
  scriptInfo.setAttribute(
    'data-function',
    `
// 536|78|Planejamento Tributário|0 // Reclamações [Planejamento Tributário]
// 537|78|Planejamento Tributário|0 // Situação Fiscal - Planejamento [Planejamento Tributário]
// 535|78|Planejamento Tributário|0 // Conferência Caixa Postal ECAC [Planejamento Tributário]
// 449|78|Planejamento Tributário|0 // IRPJ e CSLL [Planejamento Tributário]

const obrigacoes = [
  '536|78|Planejamento Tributário|0',
  '537|78|Planejamento Tributário|0',
  '535|78|Planejamento Tributário|0',
  '449|78|Planejamento Tributário|0',
];
const buscaObrigacao = document.querySelector('select#newObr');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function adicionarObrigacoes() {
  for (const obrigacao of obrigacoes) {
    try {
      buscaObrigacao.value = obrigacao;
      addObr('ObrNew');
    } catch (error) {
      const obrigacaoIdOriginal = obrigacao.split('|')[0];

      const divPlanejamento = document.querySelector('div#divObrDpt78'); // Planejamento tributário
      const divPlanejamentoObrigacoes = divPlanejamento.querySelectorAll(
        'a[title="Listar entregas"]',
      );

      divPlanejamentoObrigacoes.forEach(obrigacaoInativa => {
        const obrigacaoId = obrigacaoInativa.href.split('|').pop();

        if (obrigacaoId === obrigacaoIdOriginal) {
          const divObrigacao = obrigacaoInativa.parentElement.parentElement.parentElement;
          const select = divObrigacao.querySelector('select');
          if (select) {
            select.value = '0';
          }
        }
      });
    } finally {
      await sleep(200);
    }
  }
}

adicionarObrigacoes();

    `,
  );
  document.body.appendChild(scriptInfo);
})();
