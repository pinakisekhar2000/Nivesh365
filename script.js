document.getElementById("year").textContent = new Date().getFullYear();

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const contactForm = document.querySelector(".contact-form");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const methodStepToggles = document.querySelectorAll(".method-step-toggle");
const methodDetailPanel = document.querySelector(".method-detail-panel");
const methodDetailTitle = document.querySelector(".method-detail-title");
const methodDetailContent = document.querySelector(".method-detail-content");

function closeMethodDetails() {
  methodStepToggles.forEach((toggle) => {
    toggle.setAttribute("aria-expanded", "false");
    toggle.closest(".method-step").classList.remove("is-expanded");
    toggle.querySelector(".method-step-hint").textContent = "Click to learn more";
  });
  methodDetailPanel.hidden = true;
  methodDetailTitle.textContent = "";
  methodDetailContent.replaceChildren();
  document.body.classList.remove("method-details-open");
}

methodStepToggles.forEach((toggle) => {
  toggle.addEventListener("click", () => {
    if (toggle.getAttribute("aria-expanded") === "true") {
      closeMethodDetails();
      return;
    }

    closeMethodDetails();
    const step = toggle.closest(".method-step");
    const title = toggle
      .querySelector(".method-step-title")
      .textContent.replace(/\s+/g, " ")
      .trim();
    const detail = step.querySelector(".method-step-detail");

    toggle.setAttribute("aria-expanded", "true");
    step.classList.add("is-expanded");
    toggle.querySelector(".method-step-hint").textContent = "Click to close";
    methodDetailTitle.textContent = title;
    methodDetailContent.replaceChildren(
      ...Array.from(detail.children, (child) => child.cloneNode(true))
    );
    methodDetailPanel.hidden = false;
    document.body.classList.add("method-details-open");
  });
});

document.querySelector(".method-detail-close").addEventListener("click", closeMethodDetails);

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) {
    return;
  }

  if (
    !event.target.closest(".method-step") &&
    !event.target.closest(".method-detail-panel")
  ) {
    closeMethodDetails();
  }
});

const featureItems = Array.from(document.querySelectorAll(".feature-item"));

function getFeatureRow(item) {
  return featureItems.filter(
    (candidate) => Math.abs(candidate.offsetTop - item.offsetTop) < 2
  );
}

function updateFeatureRowControls(item) {
  const row = getFeatureRow(item);
  const isExpanded = row.some((candidate) =>
    candidate.classList.contains("is-expanded")
  );

  row.forEach((candidate) => {
    const button = candidate.querySelector(".feature-row-toggle");
    button.textContent = isExpanded ? "Click to collapse" : "Click to expand";
    button.setAttribute("aria-expanded", String(isExpanded));
  });
}

function setFeatureItemExpanded(item, isExpanded) {
  item.classList.toggle("is-expanded", isExpanded);
  item.querySelector(".feature-card-toggle").setAttribute(
    "aria-expanded",
    String(isExpanded)
  );
  item.querySelector(".feature-item-extra").hidden = !isExpanded;
  updateFeatureRowControls(item);
}

featureItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest(".feature-row-toggle")
    ) {
      return;
    }

    setFeatureItemExpanded(item, !item.classList.contains("is-expanded"));
  });

  item.querySelector(".feature-row-toggle").addEventListener("click", (event) => {
    event.stopPropagation();
    const row = getFeatureRow(item);
    const shouldExpand = !row.some((candidate) =>
      candidate.classList.contains("is-expanded")
    );
    row.forEach((candidate) => setFeatureItemExpanded(candidate, shouldExpand));
  });
});

if (contactForm) {
  const emailField = contactForm.elements.namedItem("email");
  const phoneField = contactForm.elements.namedItem("phone");
  const contactFields = [emailField, phoneField];

  contactFields.forEach((field) => {
    field.addEventListener("input", () => {
      contactFields.forEach((contactField) =>
        contactField.setCustomValidity("")
      );
    });
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailField.value.trim();
    const phone = phoneField.value.trim();

    if (!email && !phone) {
      const message = "Enter an email address or phone number to continue.";
      contactFields.forEach((field) => field.setCustomValidity(message));
      emailField.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const body = [
      `Name: ${String(formData.get("name") || "").trim()}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Message: ${String(formData.get("message") || "").trim()}`,
    ].join("\n");

    window.location.href =
      `mailto:pinakimishra@nivesh365.in?subject=${encodeURIComponent("Nivesh365 enquiry")}` +
      `&body=${encodeURIComponent(body)}`;
  });
}

const calculatorCards = Array.from(
  document.querySelectorAll(".calculator-card")
);

calculatorCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (
      event.target instanceof Element &&
      event.target.closest(".calculator-form")
    ) {
      return;
    }

    const shouldOpen = !card.classList.contains("is-expanded");
    calculatorCards.forEach((candidate) => {
      const isExpanded = candidate === card && shouldOpen;
      candidate.classList.toggle("is-expanded", isExpanded);
      candidate.querySelector(".calculator-card-toggle").setAttribute(
        "aria-expanded",
        String(isExpanded)
      );
      candidate.querySelector(".calculator-form").hidden = !isExpanded;
    });
  });
});

const calculatorForms = document.querySelectorAll(".calculator-form");
const formatCurrency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getCalculatorNumber(form, name) {
  const field = form.elements.namedItem(name);
  const value = Number(field.value);

  if (!Number.isFinite(value)) {
    throw new Error(`Invalid calculator input: ${name}`);
  }

  return value;
}

function showCalculatorResult(form, label, value, detail) {
  const output = form.querySelector(".calculator-result");
  const resultLabel = document.createElement("span");
  const resultValue = document.createElement("strong");

  resultLabel.textContent = label;
  resultValue.textContent = value;
  output.replaceChildren(resultLabel, resultValue);

  if (detail) {
    const resultDetail = document.createElement("span");
    resultDetail.className = "result-detail";
    resultDetail.textContent = detail;
    output.append(resultDetail);
  }

  output.classList.add("is-visible");
}

calculatorForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    switch (form.dataset.calculator) {
      case "retirement": {
        const monthlyExpenses = getCalculatorNumber(form, "monthly-expenses");
        const yearsToRetirement = getCalculatorNumber(form, "years-to-retirement");
        const retirementYears = getCalculatorNumber(form, "retirement-years");
        const inflation = getCalculatorNumber(form, "inflation-rate") / 100;
        const returnRate = getCalculatorNumber(form, "retirement-return") / 100;
        const annualExpensesAtRetirement =
          monthlyExpenses * 12 * Math.pow(1 + inflation, yearsToRetirement);
        const corpus =
          Math.abs(returnRate - inflation) < 1e-10
            ? annualExpensesAtRetirement * retirementYears
            : annualExpensesAtRetirement *
              (1 - Math.pow((1 + inflation) / (1 + returnRate), retirementYears)) /
              (returnRate - inflation);

        showCalculatorResult(
          form,
          "Estimated retirement corpus",
          formatCurrency.format(corpus),
          `Estimated monthly expenses at retirement: ${formatCurrency.format(annualExpensesAtRetirement / 12)}`
        );
        break;
      }

      case "growth": {
        const initialInvestment = getCalculatorNumber(form, "initial-investment");
        const monthlyInvestment = getCalculatorNumber(form, "monthly-investment");
        const annualAdditionalInvestment = getCalculatorNumber(
          form,
          "annual-additional-investment"
        );
        const annualReturn = getCalculatorNumber(form, "annual-return") / 100;
        const years = getCalculatorNumber(form, "investment-years");
        const months = years * 12;
        const monthlyRate = annualReturn / 12;
        const growthFactor = Math.pow(1 + monthlyRate, months);
        const contributionFactor =
          monthlyRate === 0 ? months : (growthFactor - 1) / monthlyRate;
        const annualGrowthFactor = Math.pow(1 + monthlyRate, 12);
        const annualContributionFactor =
          monthlyRate === 0
            ? years
            : (Math.pow(annualGrowthFactor, years) - 1) / (annualGrowthFactor - 1);
        const projectedValue =
          initialInvestment * growthFactor +
          monthlyInvestment * contributionFactor +
          annualAdditionalInvestment * annualContributionFactor;
        const totalInvested =
          initialInvestment +
          monthlyInvestment * months +
          annualAdditionalInvestment * years;

        showCalculatorResult(
          form,
          "Projected value",
          formatCurrency.format(projectedValue),
          `Total invested: ${formatCurrency.format(totalInvested)} · Projected growth: ${formatCurrency.format(projectedValue - totalInvested)}`
        );
        break;
      }

      case "risk": {
        const score = [
          "risk-horizon",
          "risk-reaction",
          "risk-comfort",
          "risk-priority",
          "risk-experience",
        ].reduce((total, name) => total + getCalculatorNumber(form, name), 0);
        const profile =
          score <= 11
            ? "Cautious"
            : score <= 18
              ? "Balanced"
              : "Growth-oriented";
        const guidance = {
          Cautious: "You may prefer stability and lower investment fluctuations.",
          Balanced: "You may be comfortable balancing growth potential with fluctuations.",
          "Growth-oriented": "You may be comfortable with greater fluctuations for long-term growth potential.",
        };

        showCalculatorResult(
          form,
          "Indicative risk profile",
          profile,
          `${guidance[profile]} Score: ${score} of 25.`
        );
        break;
      }

      case "sip": {
        const goalAmount = getCalculatorNumber(form, "goal-amount");
        const existingInvestment = getCalculatorNumber(form, "existing-investment");
        const months = getCalculatorNumber(form, "goal-years") * 12;
        const annualReturn = getCalculatorNumber(form, "sip-return") / 100;
        const monthlyRate = annualReturn / 12;
        const existingInvestmentFutureValue =
          existingInvestment * Math.pow(1 + monthlyRate, months);
        const contributionFactor =
          monthlyRate === 0
            ? months
            : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
        const remainingGoal = Math.max(0, goalAmount - existingInvestmentFutureValue);
        const monthlySip = remainingGoal / contributionFactor;
        const existingInvestmentDetail =
          existingInvestmentFutureValue >= goalAmount
            ? `Your existing investment may grow to ${formatCurrency.format(existingInvestmentFutureValue)} and meet the goal.`
            : existingInvestment > 0
              ? `Existing investment may grow to ${formatCurrency.format(existingInvestmentFutureValue)}.`
              : "No existing investment included.";

        showCalculatorResult(
          form,
          "Estimated monthly SIP",
          formatCurrency.format(monthlySip),
          `${existingInvestmentDetail} Assumes end-of-month SIPs and a constant return.`
        );
        break;
      }

      default:
        throw new Error(`Unsupported calculator type: ${form.dataset.calculator}`);
    }
  });
});
