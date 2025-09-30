// ==UserScript==
// @name         Relatório expedição
// @namespace    http://tampermonkey.net/
// @version      30-09-2025
// @description  Exporta para impressão um relatório padronizado para o departamento expedição
// @author       TIConsil
// @match        http://ticket.consilcontabilidade.com/front/ticket.form.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=glpi-project.org
// @downloadURL  https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/glpi/relatorioTicket.user.js
// @updateURL    https://raw.githubusercontent.com/ticonsil/tampermonkey-scripts/main/glpi/relatorioTicket.user.js
// @grant        none
// ==/UserScript==

// GLPI FormCreator - Gerador de Protocolo de Entrega
(function () {
  'use strict';

  // Configurações principais
  const CONFIG = {
    BUTTON_SELECTOR: '.filter-timeline.position-relative.ms-auto',
    TITLE_SELECTOR: '.navigationheader-title',
    RICH_TEXT_SELECTOR: '.rich_text_container',
    ACTOR_SELECTOR: '.actor_text',
    URGENCY_SELECTOR: 'select[name="urgency"] option[selected]',
    DATE_SELECTOR: 'input[name="date"]',
  };

  // Templates dos tipos de protocolo
  const PROTOCOL_TEMPLATES = {
    'Solicitação de documentos': {
      handler: processDocumentRequest,
      title: 'PROTOCOLO DE ENTREGA DE DOCUMENTOS',
    },
    'Protocolo de compra': {
      handler: processPurchaseRequest, // Novo handler para compras
      title: 'PROTOCOLO DE COMPRA',
    },
  };

  // Função principal para inicializar o script
  function init() {
    addProtocolButton();
  }

  // Adiciona o botão de protocolo na interface
  function addProtocolButton() {
    const targetContainer = document.querySelector(CONFIG.BUTTON_SELECTOR);
    if (!targetContainer) {
      console.warn('Container do botão não encontrado');
      return;
    }

    const buttonHtml = `
          <span data-bs-toggle="tooltip" data-bs-placement="top" title="Gerar Protocolo de Entrega">
              <button type="button" class="btn btn-icon btn-ghost-secondary generate-protocol-btn me-1" id="generateProtocolBtn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6,9 6,2 18,2 18,9"></polyline>
                      <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
                      <circle cx="17" cy="13" r="1"></circle>
                      <path d="M6,14h12v4H6Z"></path>
                  </svg>
              </button>
          </span>
      `;

    targetContainer.insertAdjacentHTML('beforeend', buttonHtml);

    const button = document.getElementById('generateProtocolBtn');
    button.addEventListener('click', handleProtocolGeneration);
  }

  // Manipula a geração do protocolo
  function handleProtocolGeneration() {
    try {
      const titleElement = document.querySelector(CONFIG.TITLE_SELECTOR);
      if (!titleElement) {
        alert('Título da página não encontrado');
        return;
      }

      const title = titleElement.innerText.trim();

      for (const [key, template] of Object.entries(PROTOCOL_TEMPLATES)) {
        if (title.startsWith(key)) {
          const commonData = extractCommonData(title);
          const protocolData = template.handler();

          if (protocolData) {
            generateProtocolDocument(commonData, protocolData, template.title);
          }
          return;
        }
      }

      alert('Tipo de protocolo não reconhecido: ' + title);
    } catch (error) {
      console.error('Erro ao gerar protocolo:', error);
      alert('Erro ao gerar protocolo. Verifique o console para mais detalhes.');
    }
  }

  // Extrai dados comuns do formulário
  function extractCommonData(title) {
    const actors = document.querySelectorAll(CONFIG.ACTOR_SELECTOR);
    const urgencyElement = document.querySelector(CONFIG.URGENCY_SELECTOR);
    const dateInputs = document.querySelectorAll(CONFIG.DATE_SELECTOR);

    let createdDate = dateInputs[1]?.value || '';
    if (createdDate) {
      createdDate = formatBrazilianDateTime(createdDate);
    }

    const protocolId = extractProtocolId(title);

    return {
      title: title,
      protocolId: protocolId,
      requester: actors[0]?.innerText?.trim() || 'Não informado',
      assignee: actors[1]?.innerText?.trim() || 'Não informado',
      urgency: urgencyElement?.innerText?.trim() || 'Não informado',
      createdDate: createdDate || 'Não informado',
    };
  }

  // Extrai ID do protocolo do título
  function extractProtocolId(title) {
    const match = title.match(/#(\d+)/) || title.match(/(\d{4,})/);
    return match ? match[1] : null;
  }

  // Processa solicitação de documentos
  function processDocumentRequest() {
    const richTextElement = document.querySelector(CONFIG.RICH_TEXT_SELECTOR);
    if (!richTextElement) {
      alert('Conteúdo do formulário não encontrado');
      return null;
    }

    const content = richTextElement.innerText;
    const demands = parseDemands(content);
    const deadline = parseDeadline(content);
    const instructions = parseInstructions(content);

    return {
      demands: demands,
      deadline: deadline,
      instructions: instructions,
    };
  }

  // NOVA FUNÇÃO: Processa protocolo de compra
  function processPurchaseRequest() {
    const richTextElement = document.querySelector(CONFIG.RICH_TEXT_SELECTOR);
    if (!richTextElement) {
      alert('Conteúdo do formulário não encontrado');
      return null;
    }

    const content = richTextElement.innerText;

    return {
      products: parsePurchaseItems(content),
      paymentMethod: parsePaymentMethod(content),
      instructions: parseInstructions(content),
      deadline: parseDeadline(content), // Reutiliza a função de prazo
    };
  }

  // Analisa as demandas (Documentos)
  function parseDemands(content) {
    const demands = [];
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);

    let currentDemand = null;
    let demandCounter = 1;

    for (const line of lines) {
      if (
        line.includes(
          `Dados da Demanda${demandCounter > 1 ? ' ' + demandCounter : ''}`
        )
      ) {
        if (currentDemand) demands.push(currentDemand);
        currentDemand = {
          number: demandCounter,
          type: '',
          company: '',
          address: '',
          district: '',
          cep: '',
          contact: '',
          description: '',
          hasMore: false,
        };
        demandCounter++;
        continue;
      }

      if (!currentDemand) continue;

      if (line.includes('Tipo de Demanda'))
        currentDemand.type = extractValue(line);
      else if (line.includes('Empresa/Local'))
        currentDemand.company = extractValue(line);
      else if (line.includes('Endereço completo'))
        currentDemand.address = extractValue(line);
      else if (line.includes('Bairro'))
        currentDemand.district = extractValue(line);
      else if (line.includes('CEP')) currentDemand.cep = extractValue(line);
      else if (line.includes('Contato'))
        currentDemand.contact = extractValue(line);
      else if (line.includes('Descrição da demanda'))
        currentDemand.description = extractValue(line);
      else if (line.includes('Possui mais demandas'))
        currentDemand.hasMore = extractValue(line).toLowerCase() === 'sim';
      else if (line.includes('Qual?'))
        currentDemand.specification = extractValue(line);
    }

    if (currentDemand) demands.push(currentDemand);
    return demands;
  }

  // NOVA FUNÇÃO: Analisa os itens de compra
  function parsePurchaseItems(content) {
    const products = [];
    const lines = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line);
    let currentItem = null;
    let itemCounter = 1;

    for (const line of lines) {
      if (line.includes('O que comprar?')) {
        if (currentItem) products.push(currentItem);
        currentItem = {
          number: itemCounter++,
          what: '',
          quantity: '',
          where: '',
        };
        currentItem.what = extractValue(line);
      } else if (currentItem) {
        if (line.includes('Quantas Unidades?')) {
          currentItem.quantity = extractValue(line);
        } else if (line.includes('Onde comprar?')) {
          currentItem.where = extractValue(line);
        }
      }
    }

    if (currentItem) products.push(currentItem);
    return products;
  }

  // NOVA FUNÇÃO: Analisa a forma de pagamento
  function parsePaymentMethod(content) {
    const lines = content.split('\n').map(line => line.trim());
    for (const line of lines) {
      if (line.includes('Forma de pagamento?')) {
        return extractValue(line);
      }
    }
    return '';
  }

  // Extrai valor após os dois pontos
  function extractValue(line) {
    line = line.replace(/\\/g, '');
    const colonIndex = line.indexOf(':');
    if (colonIndex !== -1) {
      return line.substring(colonIndex + 1).trim();
    }
    return '';
  }

  // Analisa informações de prazo
  function parseDeadline(content) {
    const lines = content.split('\n').map(line => line.trim());
    let priority = '',
      deadline = '',
      capturing = false;

    for (const line of lines) {
      if (line.includes('*Prazo*') || line === 'Prazo') {
        capturing = true;
        continue;
      }
      if (
        capturing &&
        (line.includes('*Informações Adicionais') ||
          line.includes('Informações de finais*'))
      ) {
        break;
      }
      if (capturing) {
        if (line.includes('Urgência') || line.includes('Prioridade'))
          priority = extractValue(line);
        else if (line.includes('Data limite') || line.includes('Data Limite')) {
          deadline = formatBrazilianDateTime(extractValue(line));
        }
      }
    }
    return { priority, deadline };
  }

  // Formata data e hora para padrão brasileiro
  function formatBrazilianDateTime(dateTimeString) {
    try {
      if (!dateTimeString) return '';
      dateTimeString = dateTimeString.trim();
      if (dateTimeString.match(/^\d{2}\/\d{2}\/\d{4}/)) return dateTimeString;
      if (dateTimeString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateTimeString.split('-');
        return `${day}/${month}/${year}`;
      }

      let date;
      if (dateTimeString.includes('T')) date = new Date(dateTimeString);
      else if (dateTimeString.includes(' ')) {
        const [datePart, timePart] = dateTimeString.split(' ');
        date = new Date(`${datePart}T${timePart}`);
      } else if (
        dateTimeString.includes('-') &&
        dateTimeString.split('-').length === 3
      ) {
        const parts = dateTimeString.split('-');
        date =
          parts[0].length === 4
            ? new Date(dateTimeString + 'T12:00:00')
            : new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`);
      } else {
        return dateTimeString;
      }

      if (isNaN(date.getTime())) return dateTimeString;

      date.setHours(date.getHours() - 3);
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');

      return hours === '09' && minutes === '00'
        ? `${day}/${month}/${year}`
        : `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch (error) {
      console.warn('Erro ao formatar data:', error);
      return dateTimeString;
    }
  }

  // Analisa instruções (ajustado para incluir "Observações adicionais")
  function parseInstructions(content) {
    const lines = content.split('\n').map(line => line.trim());
    let instructions = '';
    let capturing = false;

    for (const line of lines) {
      if (
        line.includes('Informações Adicionais') ||
        line.includes('Instruções') ||
        line.includes('Observações adicionais')
      ) {
        capturing = true;
        const value = extractValue(line);
        if (value) {
          instructions = value;
          // Se o valor já está na linha do título, podemos parar de procurar
          if (instructions) break;
        }
        continue;
      }
      if (capturing && line.trim() && !instructions) {
        instructions = line.trim();
        break; // Captura a primeira linha de instrução e para
      }
    }
    return instructions.trim();
  }

  // Gera o documento do protocolo (MODIFICADO)

  /* function generateProtocolDocument(commonData, protocolData, protocolTitle) {
    const printWindow = window.open('', '_blank');
    const currentDate = new Date().toLocaleDateString('pt-BR');

    const htmlContent = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${protocolTitle}</title>
                <style>
                    ${getProtocolStyles()}
                </style>
            </head>
            <body>
                <div class="protocol-container">
                    <div class="header">
                        <h1>${protocolTitle}</h1>
                        ${
                          commonData.protocolId
                            ? `<div class="protocol-number">Protocolo Nº ${commonData.protocolId}</div>`
                            : ''
                        }
                        
                        <div class="protocol-info">
                            <div class="info-group">
                                <div class="info-row">
                                    <span class="label">Solicitação:</span>
                                    <span class="value">${
                                      commonData.title
                                    }</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">Solicitante:</span>
                                    <span class="value">${
                                      commonData.requester
                                    }</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">Responsável:</span>
                                    <span class="value">${
                                      commonData.assignee
                                    }</span>
                                </div>
                                <div class="info-row">
                                    <span class="label">Criado em:</span>
                                    <span class="value">${
                                      commonData.createdDate
                                    }</span>
                                </div>
                            </div>
                            <div class="info-group priority-section">
                                ${
                                  protocolData.deadline.priority
                                    ? `
                                <div class="info-row priority-row">
                                    <span class="label">Prioridade:</span>
                                    <span class="value priority-${getPriorityClass(
                                      protocolData.deadline.priority
                                    )}">${protocolData.deadline.priority}</span>
                                </div>
                                `
                                    : `
                                <div class="info-row">
                                    <span class="label">Urgência:</span>
                                    <span class="value priority-${getPriorityClass(
                                      commonData.urgency
                                    )}">${commonData.urgency}</span>
                                </div>
                                `
                                }
                                ${
                                  protocolData.deadline.deadline
                                    ? `
                                <div class="info-row deadline-row">
                                    <span class="label">Prazo Limite:</span>
                                    <span class="value deadline">${protocolData.deadline.deadline}</span>
                                </div>
                                `
                                    : ''
                                }
                            </div>
                        </div>
                    </div>

                    <div class="content">
                        <div class="section">
                            <h2>DEMANDAS DO PROTOCOLO</h2>
                            ${generateDemandsHtml(protocolData.demands)}
                        </div>

                        ${
                          protocolData.instructions
                            ? `
                        <div class="section">
                            <h2>INSTRUÇÕES ESPECIAIS</h2>
                            <div class="instructions">
                                <p>${protocolData.instructions}</p>
                            </div>
                        </div>
                        `
                            : ''
                        }
                    </div>               
                </div>
            </body>
            </html>
        `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Aguarda o carregamento e abre a impressão
    printWindow.onload = function () {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  } */

  function generateProtocolDocument(commonData, protocolData, protocolTitle) {
    const printWindow = window.open('', '_blank');

    const htmlContent = `
          <!DOCTYPE html>
          <html lang="pt-BR">
          <head>
              <meta charset="UTF-8">
              <title>${protocolTitle}</title>
              <style>${getProtocolStyles()}</style>
          </head>
          <body>
              <div class="protocol-container">
                  <div class="header">
                      <h1>${protocolTitle}</h1>
                      ${
                        commonData.protocolId
                          ? `<div class="protocol-number">Protocolo Nº ${commonData.protocolId}</div>`
                          : ''
                      }
                      
                      <div class="protocol-info">
                          <div class="info-group">
                              <div class="info-row"><span class="label">Solicitante:</span><span class="value">${
                                commonData.requester
                              }</span></div>
                              <div class="info-row"><span class="label">Responsável:</span><span class="value">${
                                commonData.assignee
                              }</span></div>
                              <div class="info-row"><span class="label">Criado em:</span><span class="value">${
                                commonData.createdDate
                              }</span></div>
                          </div>
                          <div class="info-group priority-section">
                              ${
                                protocolData.deadline.priority
                                  ? `
                              <div class="info-row priority-row"><span class="label">Prioridade:</span><span class="value priority-${getPriorityClass(
                                protocolData.deadline.priority
                              )}">${protocolData.deadline.priority}</span></div>
                              `
                                  : `
                              <div class="info-row"><span class="label">Urgência:</span><span class="value priority-${getPriorityClass(
                                commonData.urgency
                              )}">${commonData.urgency}</span></div>
                              `
                              }
                              ${
                                protocolData.deadline.deadline
                                  ? `
                              <div class="info-row deadline-row"><span class="label">Prazo Limite:</span><span class="value deadline">${protocolData.deadline.deadline}</span></div>
                              `
                                  : ''
                              }
                          </div>
                      </div>
                  </div>

                  <div class="content">
                      <div class="section">
                          <h2>${
                            protocolTitle === 'PROTOCOLO DE COMPRA'
                              ? 'ITENS PARA COMPRA'
                              : 'DEMANDAS DO PROTOCOLO'
                          }</h2>
                          
                          ${
                            protocolTitle === 'PROTOCOLO DE COMPRA'
                              ? generatePurchaseItemsHtml(protocolData.products)
                              : generateDemandsHtml(protocolData.demands)
                          }
                      </div>

                      ${
                        protocolData.paymentMethod || protocolData.instructions
                          ? `
                      <div class="section">
                          <h2>INFORMAÇÕES ADICIONAIS</h2>
                          <div class="instructions">
                              ${
                                protocolData.paymentMethod
                                  ? `<p><strong>Forma de Pagamento:</strong> ${protocolData.paymentMethod}</p>`
                                  : ''
                              }
                              ${
                                protocolData.instructions
                                  ? `<p><strong>Observações:</strong> ${protocolData.instructions}</p>`
                                  : ''
                              }
                          </div>
                      </div>
                      `
                          : ''
                      }
                  </div>               
              </div>
          </body>
          </html>
      `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => setTimeout(() => printWindow.print(), 500);
  }

  // Determina a classe CSS baseada na prioridade
  function getPriorityClass(priority) {
    if (!priority) return 'normal';
    const p = priority.toLowerCase();
    if (p.includes('urgente') || p.includes('alta')) return 'urgent';
    if (p.includes('baixa')) return 'low';
    return 'normal';
  }

  // Gera HTML das demandas
  function generateDemandsHtml(demands) {
    return demands
      .map(
        (demand, index) => `
            <div class="demand-item">
                <h3>Demanda ${demand.number}</h3>
                <div class="demand-details">
                    <div class="detail-row">
                        <span class="detail-label">Tipo:</span>
                        <span class="detail-value">${demand.type}${
          demand.specification ? ` (${demand.specification})` : ''
        }</span>
                    </div>
                    ${
                      demand.company
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Empresa/Local:</span>
                        <span class="detail-value">${demand.company}</span>
                    </div>
                    `
                        : ''
                    }
                    ${
                      demand.address
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Endereço:</span>
                        <span class="detail-value">${demand.address}</span>
                    </div>
                    `
                        : ''
                    }
                    ${
                      demand.district
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Bairro:</span>
                        <span class="detail-value">${demand.district}</span>
                    </div>
                    `
                        : ''
                    }
                    ${
                      demand.cep
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">CEP:</span>
                        <span class="detail-value">${demand.cep}</span>
                    </div>
                    `
                        : ''
                    }
                    ${
                      demand.contact
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Contato:</span>
                        <span class="detail-value">${demand.contact}</span>
                    </div>
                    `
                        : ''
                    }
                    ${
                      demand.description
                        ? `
                    <div class="detail-row">
                        <span class="detail-label">Descrição:</span>
                        <span class="detail-value">${demand.description}</span>
                    </div>
                    `
                        : ''
                    }
                </div>
            </div>
        `
      )
      .join('');
  }

  // NOVA FUNÇÃO: Gera HTML dos itens de compra (reutilizando estilos existentes)
  function generatePurchaseItemsHtml(products) {
    if (!products || products.length === 0)
      return '<p>Nenhum item para compra encontrado.</p>';
    return products
      .map(
        item => `
              <div class="demand-item">
                  <h3>Item ${item.number}</h3>
                  <div class="demand-details single-column">
                      <div class="detail-row"><span class="detail-label">Produto:</span><span class="detail-value">${item.what}</span></div>
                      <div class="detail-row"><span class="detail-label">Quantidade:</span><span class="detail-value">${item.quantity}</span></div>
                      <div class="detail-row"><span class="detail-label">Onde Comprar:</span><span class="detail-value">${item.where}</span></div>
                  </div>
              </div>
          `
      )
      .join('');
  }

  // Estilos CSS para impressão
  function getProtocolStyles() {
    return `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: Arial, sans-serif;
                font-size: 11pt;
                line-height: 1.4;
                color: #333;
                background: white;
            }

            .protocol-container {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                padding: 15mm;
                background: white;
            }

            .header {
                margin: 20px;
                margin-bottom: 25px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
            }

            .header h1 {
                font-size: 16pt;
                font-weight: bold;
                margin-bottom: 10px;
                text-transform: uppercase;
                text-align: center;
            }

            .protocol-number {
                text-align: center;
                font-size: 14pt;
                font-weight: bold;
                color: #2c3e50;
                margin-bottom: 20px;
                padding: 8px;
                background-color: #f8f9fa;
                border: 2px solid #dee2e6;
                border-radius: 8px;
            }

            .protocol-info {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 30px;
                text-align: left;
            }

            .info-group {
                padding: 15px;
                border: 1px solid #ddd;
                border-radius: 6px;
                background-color: #f8f9fa;
            }

            .info-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 6px 0;
                border-bottom: 1px dotted #ccc;
                margin-bottom: 4px;
            }

            .info-row:last-child {
                border-bottom: none;
                margin-bottom: 0;
            }

            .label {
                font-weight: bold;
                width: 120px;
                flex-shrink: 0;
                color: #2c3e50;
            }

            .value {
                flex: 1;
                text-align: right;
                font-weight: 500;
            }

            .value.priority-urgent {
                color: #dc3545;
                font-weight: bold;
            }

            .value.priority-low {
                color: #28a745;
            }

            .value.priority-normal {
                color: #fd7e14;
            }

            .value.deadline {
                color: #dc3545;
                font-weight: bold;
                font-size: 11pt;
            }

            .value.status-pending {
                color: #fd7e14;
                font-weight: bold;
                text-transform: uppercase;
            }

            .priority-section {
                border-left: 4px solid #dc3545;
                background-color: #fff5f5;
            }

            .priority-row, .deadline-row {
                background-color: rgba(220, 53, 69, 0.1);
                padding: 8px 15px !important;
                border-radius: 4px;
                margin: 2px 0;
            }

            .content {
                margin: 20px;
            }

            .section {
                margin-bottom: 20px;
            }

            .section h2 {
                font-size: 12pt;
                font-weight: bold;
                text-transform: uppercase;
                border-bottom: 1px solid #666;
                padding-bottom: 5px;
                margin-bottom: 12px;
            }

            .demand-item {
                margin-bottom: 15px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 4px;
                background-color: #fafafa;
            }

            .demand-item h3 {
                font-size: 11pt;
                font-weight: bold;
                margin-bottom: 8px;
                color: #2c3e50;
            }

            .demand-details {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-left: 30px;
            }

            .detail-row {
                display: flex;
                align-items: flex-start;
                margin-bottom: 6px;
                padding: 3px 0;
                border-bottom: 1px dotted #eee;
            }

            .detail-label {
                font-weight: bold;
                width: 100px;
                flex-shrink: 0;
                color: #34495e;
            }

            .detail-value {
                flex: 1;
                margin-left: 8px;
                word-break: break-word;
            }

            .deadline-info p, .instructions p {
                margin-bottom: 8px;
                line-height: 1.5;
            }

            .instructions {
                padding: 10px;
                background-color: #f8f9fa;
                border-left: 4px solid #007bff;
                border-radius: 0 4px 4px 0;
            }

            .footer {
                margin-top: 30px;
                border-top: 1px solid #ddd;
                padding-top: 20px;
            }

            .signature-area {
                display: flex;
                justify-content: space-around;
                margin-top: 30px;
            }

            .signature-line {
                text-align: center;
                width: 200px;
            }

            .signature-line span {
                display: block;
                border-bottom: 1px solid #333;
                margin-bottom: 5px;
                height: 20px;
            }

            .signature-line p {
                font-size: 9pt;
                margin: 2px 0;
            }

            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }

                .protocol-container {
                    width: 100%;
                    margin: 0;
                    padding: 10mm;
                }

                .demand-item {
                    break-inside: avoid;
                }

                .section {
                    break-inside: avoid-column;
                }
            }

            @page {
                size: A4;
                margin: 10mm;
            }
        `;
  }

  // Inicializa o script quando o DOM estiver carregado
  const interval = setInterval(() => {
    const btn = document.querySelector('button.btn.btn-primary.dropdown-toggle');
    if (btn) {
      init();
      clearInterval(interval); // para de procurar depois de encontrar
    }
  }, 500); // verifica a cada meio segundo
})();
