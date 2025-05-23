document.addEventListener("DOMContentLoaded", function () {
  const useMockCheckbox = document.getElementById("use-mock");
  const produtosContainer = document.getElementById("produtos");
  const specialcaresFieldset = document.querySelector("fieldset");
  const petTypeSelect = document.querySelector('select[name="type"]');
  const productTypeSelect = document.querySelector('select[name="productType"]');

  // Função para carregar os specialcares do backend
  async function loadSpecialCares() {
    // Limpa opções antigas
    specialcaresFieldset.innerHTML = `<legend><strong>Cuidados Especiais:</strong></legend>`;
    // Busca species e tipo
    const species = petTypeSelect.value === "dog" ? "dog" : "cat";
    // API aceita type = "dietetic", que cobre produtos especiais; altere se necessário.
    const type = "dietetic";
    try {
      const res = await fetch("/api/specialcares", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({species, type}),
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

  // Carrega ao abrir a página e sempre que mudar o petType
  loadSpecialCares();
  petTypeSelect.addEventListener("change", loadSpecialCares);
  // (Opcional) Se a API exigir também productType, adicione:
  // productTypeSelect.addEventListener("change", loadSpecialCares);

  document.getElementById('form-simulador').addEventListener('submit', function(e) {
    e.preventDefault();

    const useMock = useMockCheckbox?.checked;
    produtosContainer.innerHTML = "";

    if (useMock) {
      renderProdutos(MOCK_PRODUCTS);
    } else {
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
    }
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
