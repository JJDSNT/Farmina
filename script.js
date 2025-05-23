document.addEventListener("DOMContentLoaded", function () {
  const produtosContainer = document.getElementById("produtos");
  const specialcaresFieldset = document.getElementById("specialcares-fieldset");
  const petTypeSelect = document.querySelector('select[name="type"]');
  const languageSelect = document.getElementById("language-id");

  // Função para carregar cuidados especiais de acordo com idioma e espécie
  async function loadSpecialCares() {
    specialcaresFieldset.innerHTML = `<legend><strong>Cuidados Especiais:</strong></legend>`;
    const species = petTypeSelect.value;
    const type = "specialcare";
    const languageId = languageSelect.value;

    try {
      const res = await fetch("/api/specialcares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, type, languageId })
      });
      const data = await res.json();
      if (data.status === "200" && data.result?.[0]?.list?.length > 0) {
        data.result[0].list.forEach(item => {
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

  // Carrega os cuidados ao abrir e quando mudar tipo de pet ou idioma
async function loadSpecialCares() {
  specialcaresFieldset.innerHTML = `<legend><strong>Cuidados Especiais:</strong></legend>`;
  
  const species = petTypeSelect.value;
  const type = "dietetic";
  const languageId = languageSelect.value;
  
  try {
    const res = await fetch("/api/specialcares", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ species, type, languageId })
    });
    
    const data = await res.json();
    console.log("Resposta completa da API:", data);
    
    // ✅ Estrutura correta: data.result[0].specialcares
    if (data.status === "200" && data.result?.[0]?.specialcares?.length > 0) {
        const specialcares = data.result[0].specialcares;
  console.log("Primeiro item dos specialcares:", specialcares[0]);
  console.log("Todas as propriedades:", Object.keys(specialcares[0]));
      const specialcares = data.result[0].specialcares;
      console.log("Special cares encontrados:", specialcares);
      
      // Assumindo que specialcares é um array de objetos com as propriedades corretas
      specialcares.forEach(item => {
        const label = document.createElement("label");
        // Ajustar conforme a estrutura real dos dados
        label.innerHTML = `<input type="checkbox" name="specialcares" value="${item.id || item.specialcare_id}"> ${item.name || item.specialcare_name || item.description}`;
        specialcaresFieldset.appendChild(label);
        specialcaresFieldset.appendChild(document.createElement("br"));
      });
    } else {
      specialcaresFieldset.innerHTML += "<span style='color:#888'>Nenhum cuidado especial disponível.</span>";
    }
  } catch (err) {
    console.error("Erro ao carregar special cares:", err);
    specialcaresFieldset.innerHTML += "<span style='color:red'>Erro ao carregar cuidados especiais.</span>";
  }
}

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
