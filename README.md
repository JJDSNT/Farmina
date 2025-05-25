# Teste Zendesk — Simulador de Produtos Farmina

## Contexto
Este projeto foi desenvolvido para um teste técnico, onde o objetivo é construir uma página para agentes simularem as características de um pet e consultar produtos Farmina para o cliente.

Um agente está realizando o atendimento de um cliente e precisa realizar a consulta e a escolha de um produto para o pet do cliente.
Sendo assim, construa uma página onde o agente possa simular as características de um pet (filtros), buscar produtos e listá-los
    1. Tipo de alimento – seco ou molhado
    2. Tipo de pet – cão ou gato
    3. Gestação – sim ou não
    4. Lactação – sim ou não
    5. Fases da vida – filhote, adulto, sênior
    6. Lista dos cuidados especiais
    7. Publicar a página para realizarmos testes

> **Observação:**  
> Esta solução foi criada em um ambiente sem acesso a ferramentas modernas de desenvolvimento como Git, Node.js ou frameworks front-end. Todo o código foi escrito em HTML, CSS e JavaScript puro, visando máxima portabilidade e simplicidade de deploy.

---

## Funcionalidades

- Filtros para:
  - Tipo de alimento (seco ou molhado)
  - Tipo de pet (cão ou gato)
  - Gestação / Lactação
  - Fase da vida (filhote, adulto, sênior)
  - Cuidados especiais (carregados dinamicamente)
- Busca de produtos pela API Farmina (requisições autenticadas)
- Exibição amigável dos resultados

---

## Implementação

- **Interface web** responsiva e simples, 100% estática.
- **APIs**: Consumo de endpoints autenticados via backend proxy, sem expor informações sensíveis.
- **País padrão**: `"MA"` (Farmina Brand), exibido na tela.

> **Nota:**  
> Os endpoints e credenciais de autenticação da Farmina **não** estão incluídos ou expostos neste repositório, conforme boas práticas de segurança.

---

## Restrições Técnicas

- Não utilizei frameworks (React, Vue, Angular, etc).
- Não utilizei Node.js, npm/yarn, ou qualquer ferramenta de build.
- Não utilizei controle de versão (Git) por limitações de ambiente.
- O deploy e execução foram realizados diretamente via arquivos estáticos e configuração mínima de backend para proxy das requisições autenticadas.

---

**Aviso:**  
Este projeto é apenas para demonstração técnica, em ambiente controlado. Não utilize os endpoints, credenciais ou payloads desta solução em produção sem autorização da Farmina.

---
