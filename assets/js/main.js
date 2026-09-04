const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = navigation?.querySelectorAll("a") ?? [];
const year = document.querySelector("[data-current-year]");

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

const setMenuState = (isOpen) => {
  if (!menuButton || !navigation) return;

  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
  navigation.classList.toggle("is-open", isOpen);
  header?.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
};

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
  setMenuState(isOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenuState(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenuState(false);
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

if (year) year.textContent = String(new Date().getFullYear());

const filterButtons = document.querySelectorAll("[data-filter]");
const productCards = document.querySelectorAll("[data-product-card]");
const productDetails = document.querySelectorAll("[data-product-detail]");
const catalogEmpty = document.querySelector("[data-catalog-empty]");
const visibleCount = document.querySelector("[data-visible-count]");

const belongsToCategory = (item, filter) => {
  if (filter === "all") return true;
  return (item.dataset.categories ?? "").split(" ").includes(filter);
};

const filterCatalog = (filter) => {
  let count = 0;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  productCards.forEach((card) => {
    const isVisible = belongsToCategory(card, filter);
    card.hidden = !isVisible;
    if (isVisible) count += 1;
  });

  productDetails.forEach((detail) => {
    detail.hidden = !belongsToCategory(detail, filter);
  });

  if (catalogEmpty) catalogEmpty.hidden = count !== 0;
  if (visibleCount) visibleCount.textContent = `${count} ${count === 1 ? "modelo disponível" : "modelos disponíveis"}`;
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterCatalog(button.dataset.filter ?? "all"));
});

const sizeInputs = document.querySelectorAll('input[name="size"]');
const currentPrice = document.querySelector("[data-current-price]");
const currentSize = document.querySelector("[data-current-size]");
const orderLink = document.querySelector("[data-order-link]");
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const updateOrder = (input) => {
  if (!input || !currentPrice || !currentSize || !orderLink) return;

  const size = input.value;
  const price = Number(input.dataset.price);
  const formattedPrice = currency.format(price);
  const subject = `Encomenda Kratos - ${size} cm`;
  const body = `Olá, gostaria de encomendar o Kratos de ${size} cm por ${formattedPrice}.`;

  currentPrice.textContent = formattedPrice;
  currentSize.textContent = `Peça de ${size} cm`;
  orderLink.href = `mailto:contato@redlabs3d.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

sizeInputs.forEach((input) => {
  input.addEventListener("change", () => updateOrder(input));
});

updateOrder(document.querySelector('input[name="size"]:checked'));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".reveal");

if (reduceMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const observer = new IntersectionObserver(
    (entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8%", threshold: 0.08 },
  );

  revealItems.forEach((item) => observer.observe(item));
}


