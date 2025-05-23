document.addEventListener("DOMContentLoaded", function () {
  const produtosContainer = document.getElementById("produtos");
  const specialcaresFieldset = document.getElementById("specialcares-fieldset");
  const petTypeSelect = document.querySelector('select[name="type"]');
  const languageSelect = document.getElementById("language-id");
  
  // Função para carregar cuidados especiais de acordo com idioma e espécie
  async function loadSpecialCares() {
    specialcaresFieldset.innerHTML = `<legend><strong>Cuidados Especiais:</strong></legend>`;
    
    const species = petTypeSelect.value;
    const type = "dietetic"; // ✅ Corrigido: deve ser "dietetic"
    const languageId = languageSelect.value;
    
    console.log("Enviando para API:", { species, type, languageId }); // Debug
    
    try {
      const res = await fetch("/api/specialcares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ species, type, languageId })
      });
      
      const data = await res.json();
      console.log("Resposta da API:", data); // Debug
      
      // ✅ Estrutura correta baseada na sua resposta
      if (data.status === "200" && data.result?.[0]?.specialcares?.length > 0) {
        const specialcares = data.result[0].specialcares;
        console.log("Specialcares encontrados:", specialcares); // Debug
        
        // Verificar estrutura do primeiro item
        if (specialcares.length > 0) {
          console.log("Primeiro item:", specialcares[0]);
          console.log("Propriedades disponíveis:", Object.keys(specialcares[0]));
        }
        
        specialcares.forEach(item => {
          const label = document.createElement("label");
          // Usando diferentes possibilidades de nome da propriedade
          const id = item.specialcare_id || item.id || item.code || '';
          const name = item.specialcare_name || item.name || item.description || item.title || 'Sem nome';
          
          label.innerHTML = `<input type="checkbox" name="specialcares" value="${id}"> ${name}`;
          specialcaresFieldset.appendChild(label);
          specialcaresFieldset.appendChild(document.createElement("br"));
        });
      } else {
        console.log("Nenhum specialcare encontrado ou estrutura inesperada");
        specialcaresFieldset.innerHTML += "<span style='color:#888'>Nenhum cuidado especial disponível.</span>";
      }
    } catch (err) {
      console.error("Erro ao carregar special cares:", err);
      specialcaresFieldset.innerHTML += "<span style='color:red'>Erro ao carregar cuidados especiais.</span>";
    }
  }
  
  // Carrega os cuidados ao abrir e quando mudar tipo de pet ou idioma
  loadSpecialCares();
  petTypeSelect.addEventListener("change", loadSpecialCares);
  languageSelect.addEventListener("change", loadSpecialCares);
  
  document.getElementById('form-simulador').addEventListener('submit', function(e) {
    e.preventDefault();
    produtosContainer.innerHTML = "";
    
    const form = document.getElementById("form-simulador");
    const formData = new FormData(form);
    const params = new URLSearchParams();
    
    for (const [key, value] of formData.entries()) {
      if (key === "specialcares") {
        params.append(key, value); // múltiplos valores permitidos
      } else {
        params.set(key, value);
      }
    }
    
    fetch("/api/proxy?" + params.toString())
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
