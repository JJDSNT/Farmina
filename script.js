
document.addEventListener("DOMContentLoaded", function () {
  const useMockCheckbox = document.getElementById("use-mock");
  const produtosContainer = document.getElementById("produtos");

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
