# Teste Zendesk — Simulador de Produtos Farmina

## Objetivo

Página para agentes simularem as características de um pet (filtros) e consultar produtos Farmina para o cliente, conforme requisitos:

- Tipo de alimento – seco ou molhado
- Tipo de pet – cão ou gato
- Gestação – sim ou não
- Lactação – sim ou não
- Fases da vida – filhote, adulto, sênior
- Lista dos cuidados especiais (dinâmicos)
- Publicar a página para testes

> **Observação:**  
> Esta solução foi criada sem acesso a ferramentas modernas de desenvolvimento (Git, Node.js ou frameworks front-end). Todo o código foi escrito em HTML, CSS e JavaScript puro, por restrições do ambiente.

---

## Funcionalidades

- Filtros dinâmicos para busca de produtos
- Exibição responsiva dos resultados
- Consumo de APIs autenticadas via backend proxy (sem expor credenciais)
- País padrão exibido: `"MA"` (Farmina Brand)

---

## Exemplos de Payloads

> *As chamadas são feitas via backend proxy. Os exemplos abaixo mostram apenas o formato dos dados enviados.*

### Busca de produtos

~~~
{
  "country": "MA",
  "languageId": "20",
  "productId": "388",
  "productType": "dry",
  "type": "",
  "appsAndEshop": true
}
~~~

### Listagem de Cuidados Especiais

~~~
{
  "species": "dog",
  "country": "MA",
  "languageId": "1",
  "type": "dietetic"
}
~~~

---

## Implementação

- **Web estático** (HTML/CSS/JS puros, responsivo)
- **Proxy backend** para requisições autenticadas (configuração mínima)
- **Sem frameworks, sem build, sem Git** (restrições do ambiente)

---

## Limitações conhecidas

- As APIs utilizadas **não oferecem paginação** de resultados.
- **Não há cache** local ou de rede; cada busca resulta em uma chamada à API.
- Apenas um país (“MA”) está disponível como padrão (Farmina Brand).
- A solução é para demonstração técnica, não devendo ser usada em produção sem autorização.

---

> **Aviso:**  
> Este projeto é apenas para demonstração técnica, em ambiente controlado. **Nunca utilize os endpoints, credenciais ou payloads desta solução em produção sem autorização da Farmina.**
