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

  // Função que retorna o par {country, languageId} corretamente para cada endpoint
  function getCountryAndLanguageId(endpoint) {
    const langValue = languageSelect.value;
    // Briefing-default: regra especial
    if (langValue === 'briefing-default') {
      return endpoint === 'products'
        ? { country: "MA", languageId: 20 }
        : { country: "MA", languageId: 1 };
    }
    // Mapeamento explícito
    if (langValue === "3") return { country: "BR", languageId: 3 };
    if (langValue === "0") return { country: "US", languageId: 0 };
    if (langValue === "1") return { country: "IT", languageId: 1 };
    // fallback (não deve ocorrer)
    return { country: "MA", languageId: 1 };
  }

  // Função para carregar cuidados especiais
  async function loadSpecialCares() {
    updateLegendType();
    specialcaresFieldset.innerHTML =
      `<legend><strong>Cuidados Especiais: <span id="legend-type">${legendTypeSpan.textContent}</span></strong></legend>`;

    const species = petTypeSelect.value;
    const type = careTypeSelect.value;
    const { country, languageId } = getCountryAndLanguageId('specialcares');

    try {
      const payload = { species, type, languageId, country };
      console.log("Enviando para /api/specialcares:", payload);

      const res = await fetch("/api/specialcares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
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

    // Usa country/languageId corretos para produtos
    const { country, languageId } = getCountryAndLanguageId('products');
    data.country = country;
    data.languageId = languageId;

    console.log("Dados enviados para /api/products:", data);

    fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro na resposta da API");
        return res.json();
      })
      .then(responseData => {
        console.log("Resposta da API products:", responseData);

        const produtos = responseData?.result?.products
          ? Object.values(responseData.result.products)
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
