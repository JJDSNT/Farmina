document.addEventListener("DOMContentLoaded", function () {
  const produtosContainer = document.getElementById("produtos");
  const specialcaresFieldset = document.getElementById("specialcares-fieldset");
  const petTypeSelect = document.querySelector('select[name="type"]');
  const languageSelect = document.getElementById("language-id");
  const careTypeSelect = document.getElementById("care-type");
  const legendTypeSpan = document.getElementById("legend-type");

  // Função para atualizar o texto do type na legenda
  function updateLegendType() {
    const selectedOption = careTypeSelect.options[careTypeSelect.selectedIndex];
    const value = careTypeSelect.value;
    legendTypeSpan.textContent = value ? `(${selectedOption.text})` : '';
  }

  // Função para decidir o languageId de acordo com o endpoint e select
  function getLanguageId(endpoint) {
    const selected = languageSelect.value;
    if (selected === 'briefing-default') {
      if (endpoint === 'products') return 20;
      if (endpoint === 'specialcares') return 1;
    }
    return selected;
  }

  // Função para carregar cuidados especiais
  async function loadSpecialCares() {
    // Atualiza legenda com type selecionado
    updateLegendType();

    // Remove tudo que não seja a legend, preservando ela
    specialcaresFieldset.innerHTML = `<legend><strong>Cuidados Especiais: <span id="legend-type">${legendTypeSpan.textContent}</span></strong></legend>`;

    const species = petTypeSelect.value;
    const type = careTypeSelect.value; // Agora vem do select!
    const languageId = getLanguageId('specialcares'); // Usando função nova

    try {
      console.log("Enviando para /api/specialcares:", { species, type, languageId });

      const res = await fetch("/api/specialcares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, type, languageId })
      });

      const data = await res.json();
      if (data.status === "200" &&
        data.result?.[0]?.specialcares?.[0]?.list?.length > 0) {

        const specialcaresList = data.result[0].specialcares[0].list;
        specialcaresList.forEach(item => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="checkbox" name="specialcares" value="${item.specialcare_id}"> ${item.specialcare_name}`;
          specialcaresFieldset.appendChild(label);
          specialcaresFieldset.appendChild(document.createElement("br"));
        });
      } else {
        specialcaresFieldset.innerHTML += "<span style='color:#888'>Nenhum cuidado especial disponível.</span>";
      }
    } catch (err) {
      specialcaresFieldset.innerHTML += "<span style='color:red'>Erro ao carregar cuidados especiais.</span>";
    }
  }

  // Inicializa
  loadSpecialCares();
  petTypeSelect.addEventListener("change", loadSpecialCares);
  languageSelect.addEventListener("change", loadSpecialCares);
  careTypeSelect.addEventListener("change", loadSpecialCares);

  document.getElementById('form-simulador').addEventListener('submit', function (e) {
    e.preventDefault();
    produtosContainer.innerHTML = "";

    const form = document.getElementById("form-simulador");
    const formData = new FormData(form);

    // Converte para objeto, garantindo specialcares como array
    const data = Object.fromEntries(formData.entries());
    data.specialcares = formData.getAll("specialcares");

    // Sobrescreve languageId conforme regra briefing-default
    data.languageId = getLanguageId('products');

    console.log("Enviando para /api/products:", data);

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro na resposta da API");
        return res.json();
      })
      .then(data => {
        const produtos = data?.result?.products
          ? Object.values(data.result.products)
          : [];
        if (produtos.length > 0) {
          renderProdutos(produtos);
        } else {
          produtosContainer.style.display = "none";
          alert("Nenhum produto encontrado.");
        }
      })
      .catch((err) => {
        produtosContainer.style.display = "none";
        alert("Erro ao buscar produtos na API: " + err.message);
      });
  });

  function renderProdutos(produtos) {
    if (!produtos || produtos.length === 0) {
      produtosContainer.style.display = "none";
      return;
    }

    produtosContainer.style.display = "block";
    produtosContainer.innerHTML = '<h3>Produtos Recomendados</h3>';

    produtos.forEach(p => {
      produtosContainer.innerHTML += `
        <div class="produto">
          <img src="${p.img_thumbnail}" width="100">
          <div class="produto-info">
            <strong>${p.name}</strong>
            <span>${p.description}</span>
            <a href="${p.url}" target="_blank">Ver Produto</a>
          </div>
        </div>`;
    });
  }
});
