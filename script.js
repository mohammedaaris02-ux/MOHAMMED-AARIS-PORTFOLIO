const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const siteHeader = document.querySelector(".site-header");
const contactForm = document.querySelector("#contactForm");
const emailButton = document.querySelector("#emailButton");
const whatsappButton = document.querySelector("#whatsappButton");
const formStatus = document.querySelector("#formStatus");
const liveBackground = document.querySelector("#liveBackground");
const contactEmail = "mohammedaaris02@gmail.com";
const copyEmailButtons = document.querySelectorAll("[data-copy-email]");
const directMailLinks = document.querySelectorAll("[data-mail-link]");
const messageInput = document.querySelector('#contactForm textarea[name="message"]');
const messageCount = document.querySelector("#messageCount");
const serviceButtons = document.querySelectorAll(".service-more");
const serviceModal = document.querySelector("#serviceModal");
const serviceModalImage = document.querySelector("#serviceModalImage");
const serviceModalCategory = document.querySelector("#serviceModalCategory");
const serviceModalTitle = document.querySelector("#serviceModalTitle");
const serviceModalDescription = document.querySelector("#serviceModalDescription");
const serviceModalTech = document.querySelector("#serviceModalTech");
const serviceModalDetails = document.querySelector("#serviceModalDetails");
const projectModal = document.querySelector("#projectModal");
const projectModalImage = document.querySelector("#projectModalImage");
const projectModalCategory = document.querySelector("#projectModalCategory");
const projectModalTitle = document.querySelector("#projectModalTitle");
const projectModalDescription = document.querySelector("#projectModalDescription");
const projectModalTech = document.querySelector("#projectModalTech");
const projectModalOverview = document.querySelector("#projectModalOverview");
const projectModalPurpose = document.querySelector("#projectModalPurpose");
const projectModalUser = document.querySelector("#projectModalUser");
const projectModalAdmin = document.querySelector("#projectModalAdmin");
const projectModalSecurity = document.querySelector("#projectModalSecurity");
const projectModalOutcome = document.querySelector("#projectModalOutcome");
const projectModalScreens = document.querySelector("#projectModalScreens");

const serviceDetails = {
  web: {
    category: "Web Development",
    title: "Professional Web Development",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1100&q=80",
    alt: "Developer workspace with code editor for web development",
    description: "Responsive, fast, and polished websites with clean frontend, backend, database, and deployment setup.",
    tech: ["HTML", "CSS", "JavaScript", "ReactJS", "Node.js"],
    details: [
      ["Domain", "Business-ready domain setup with SSL and clean routing."],
      ["Hosting", "Netlify, Vercel, shared hosting, or VPS based on project size."],
      ["Frontend", "HTML, CSS, JavaScript, ReactJS, responsive UI and clean sections."],
      ["Backend", "Node.js, Express, APIs, form handling, and integrations."],
      ["Database", "MongoDB or MySQL for dynamic content, leads, and records."],
      ["Result", "A modern website that loads fast and works smoothly on mobile and desktop."],
    ],
  },
  wordpress: {
    category: "WordPress Development",
    title: "WordPress Business Website",
    image: "wordpress-service-inner.jpg",
    alt: "WordPress design and responsive website development",
    description: "CMS websites for business pages, service pages, blogs, company websites, and easy content updates.",
    tech: ["WordPress", "Elementor", "CSS", "Plugins", "MySQL"],
    details: [
      ["Domain", "Domain connection with SSL and professional URL setup."],
      ["Hosting", "WordPress hosting, cPanel hosting, or managed hosting."],
      ["Frontend", "Theme customization, Elementor sections, CSS, responsive design."],
      ["Backend", "WordPress dashboard, plugins, forms, SEO basics, and content management."],
      ["Database", "MySQL database stores pages, posts, media, and settings."],
      ["Result", "A client-editable website with clean pages and practical admin control."],
    ],
  },
  business: {
    category: "Business Site",
    title: "Company & Business Website",
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1100&q=80",
    alt: "Creative business website planning meeting",
    description: "Clean company websites with service sections, enquiry flow, trust content, and contact actions.",
    tech: ["HTML", "CSS", "JavaScript", "Forms", "WhatsApp"],
    details: [
      ["Domain", "Brand domain setup for a professional company identity."],
      ["Hosting", "Fast static hosting or CMS hosting depending on update needs."],
      ["Frontend", "Service sections, CTA areas, testimonials, contact blocks, and responsive UI."],
      ["Backend", "Contact forms, WhatsApp flow, email routing, and enquiry handling."],
      ["Database", "Optional database for leads, enquiries, and admin records."],
      ["Result", "A business-focused website built to explain services and generate enquiries."],
    ],
  },
  ecommerce: {
    category: "E-Commerce Site",
    title: "Online Shopping Website",
    image: "ecommerce-service.avif",
    alt: "E-commerce isometric shopping website and payment concept",
    description: "Product-selling websites with storefront, product pages, cart, checkout, and order-ready flow.",
    tech: ["Storefront", "Cart", "Checkout", "Payment UI", "Orders"],
    details: [
      ["Domain", "Store domain setup with secure checkout-ready structure."],
      ["Hosting", "WooCommerce hosting, cloud hosting, or modern full-stack hosting."],
      ["Frontend", "Product cards, product pages, cart UI, checkout UI, and responsive design."],
      ["Backend", "Product management, orders, payment gateway integration, and account flow."],
      ["Database", "MySQL or MongoDB for products, customers, orders, and payment records."],
      ["Result", "A clear online store experience designed for browsing, buying, and tracking orders."],
    ],
  },
  crm: {
    category: "CRM Site",
    title: "CRM Dashboard System",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1100&q=80",
    alt: "Creative CRM team dashboard and workflow planning",
    description: "Dashboard-style systems for leads, customers, reports, tasks, and business records.",
    tech: ["ReactJS", "Node.js", "MongoDB", "Admin UI", "Reports"],
    details: [
      ["Domain", "Private admin domain or business subdomain setup."],
      ["Hosting", "VPS, cloud hosting, or full-stack deployment."],
      ["Frontend", "ReactJS dashboards, tables, filters, charts, and admin layouts."],
      ["Backend", "Node.js APIs, authentication, roles, lead workflows, and reporting logic."],
      ["Database", "MongoDB or MySQL for customers, leads, tasks, and reports."],
      ["Result", "A practical business dashboard for managing workflow and customer records."],
    ],
  },
};

const projectDetails = {
  ecommerce: {
    category: "E-Commerce Website",
    title: "Complete Online Shopping Platform",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    alt: "E-commerce website dashboard with products, cart, checkout, and order tracking",
    description: "A complete e-commerce platform designed for online product sales. It includes product management, shopping cart, secure checkout, customer accounts, payment integration, and order tracking.",
    tech: ["HTML", "CSS", "JavaScript", "Responsive UI", "Payment Flow"],
    overview: "A product-selling website built for smooth browsing, quick product discovery, secure checkout, and a clear order journey from cart to delivery updates.",
    purpose: "To help a business sell products online with a clean storefront, strong conversion flow, and easy customer account experience.",
    user: ["Browse products by category", "Search and filter items", "View product details", "Add products to cart", "Checkout with payment section", "Track orders from account dashboard"],
    admin: ["Manage products and categories", "Update prices and stock", "View orders", "Manage customer records", "Review payment and delivery status"],
    security: ["Responsive layouts for mobile, tablet, and desktop", "Form validation on checkout fields", "Secure payment-ready UI flow", "Account and order sections designed for protected access"],
    outcome: "The final result is a polished e-commerce experience that feels practical for a real online store and makes product browsing, buying, and order tracking simple.",
    screens: [
      { site: "ShopSphere E-Commerce", title: "Online Store Features", detail: "Product listing, cart, customer details, payment gateway, delivery summary, and live order history flow.", demoUrl: "ecommerce.html", image: "ecommerce-project.png", action: "Open Store Site" },
    ],
  },
  woocommerce: {
    category: "WordPress Website",
    title: "WordPress Website Development",
    image: "wordpress-inner.jpg",
    alt: "WordPress website layout illustration with responsive pages and content blocks",
    description: "A professional WordPress website created for business pages, service sections, contact flow, plugins, and easy content management from the admin dashboard.",
    tech: ["WordPress", "Elementor", "CSS", "Plugins", "CMS"],
    overview: "A WordPress-powered website designed for businesses that need clean pages, editable content, responsive sections, and an easy dashboard.",
    purpose: "To help business owners manage website content, service pages, contact enquiries, and updates without technical complexity.",
    user: ["Read business pages", "Explore services", "Submit contact form", "Open WhatsApp or email", "View responsive pages"],
    admin: ["WordPress admin panel", "Page and content updates", "Plugin setup", "Contact form management", "SEO and basic settings"],
    security: ["Mobile-friendly WordPress pages", "Validated contact form fields", "Admin-only dashboard access", "Plugin and SSL-ready setup"],
    outcome: "The final website is suitable for a professional business presence where the client can update content and manage pages easily.",
    screens: [
      { site: "WP Portfolio Studio", title: "Premium WordPress Portfolio", detail: "Creative profile, service blocks, project showcase, client reviews, blog preview, and contact enquiry flow.", demoUrl: "wordpress.html", image: "wordpress-project.jpg", action: "Open WordPress Site" },
    ],
  },
  crm: {
    category: "CRM & ERP System",
    title: "Management System With Admin Panel",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1200&q=80",
    alt: "CRM and ERP admin dashboard with customers, sales, inventory, invoices, and analytics",
    description: "A complete CRM and ERP management system with a secure admin panel. It helps businesses manage customers, employees, leads, sales, inventory, invoices, reports, and daily operations from one centralized dashboard.",
    tech: ["ReactJS", "Node.js", "MongoDB", "Admin Panel", "Dashboard"],
    overview: "A centralized management dashboard created for teams that need one place to track customers, leads, staff, stock, invoices, reports, and business activities.",
    purpose: "To reduce manual work and give owners, HR teams, sales teams, and admins a clear control panel for daily operations.",
    user: ["Role-based dashboard access", "Lead and customer tracking", "Invoice viewing", "Report checking", "Task and activity overview"],
    admin: ["Customer and employee management", "Lead pipeline control", "Sales tracking", "Inventory updates", "Invoice generation", "Reports and analytics", "User roles and permissions"],
    security: ["Role-based permissions", "Secure admin panel structure", "Validated management forms", "Responsive dashboard layout for office and tablet use"],
    outcome: "The final CRM and ERP concept looks like a real business management product with organized modules, clear reporting, and scalable admin workflows.",
    screens: [
      { site: "NexaFlow CRM", title: "Premium CRM Admin Panel", detail: "Leads, customers, invoices, tasks, sales pipeline, analytics, team roles, and admin workflow dashboard.", demoUrl: "crm.html", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1100&q=80", action: "Open CRM Site" },
    ],
  },
  business: {
    category: "Business Website",
    title: "Corporate Website For Client Enquiries",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=1200&q=80",
    alt: "Business website layout with hero section, services, case studies, testimonials, contact form, and map",
    description: "A modern and responsive business website created to showcase the company's services, brand information, case studies, testimonials, and contact details while generating more customer enquiries.",
    tech: ["HTML", "CSS", "JavaScript", "SEO Structure", "Contact Form"],
    overview: "A professional company website built to communicate trust, explain services, show proof of work, and guide visitors toward enquiry actions.",
    purpose: "To help a business build online presence and convert visitors into leads through clear sections, CTAs, contact forms, and location details.",
    user: ["Read company introduction", "Explore services", "View case studies", "Check testimonials", "Submit contact form", "Open Google Maps"],
    admin: ["Update service content", "Maintain case study items", "Review contact enquiries", "Refresh testimonials", "Manage CTA content"],
    security: ["Responsive design for all devices", "Validated enquiry form fields", "Safe external map/contact links", "Fast and lightweight static structure"],
    outcome: "The final site gives a client-ready business presence with clean branding, strong content flow, and enquiry-focused design.",
    screens: [
      { site: "ApexBridge Corporate", title: "Premium Business Website", detail: "Corporate hero, service pages, business metrics, case studies, testimonials, enquiry CTA, premium header and footer.", demoUrl: "business.html", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1100&q=80", action: "Open Business Site" },
    ],
  },
  payment: {
    category: "Personal Project",
    title: "Payment Gateway Integration",
    image: "https://images.unsplash.com/photo-1556741533-411cf82e4e2d?auto=format&fit=crop&w=1200&q=80",
    alt: "Secure online payment gateway checkout with card and transaction flow",
    description: "A personal payment integration project built around a Razorpay-style checkout flow. It includes customer verification, payment form UI, OTP step, Razorpay checkout trigger, transaction history, and payment confirmation experience.",
    tech: ["HTML", "CSS", "JavaScript", "Razorpay", "Payment UI"],
    overview: "A secure payment gateway integration project based on the Payclick source code. The flow covers user verification, checkout details, Razorpay payment popup, success handling, and local payment history.",
    purpose: "To demonstrate how a real website can collect online payments for products, services, bookings, fees, or client orders using a payment gateway flow.",
    user: ["Open payment page", "Enter customer details", "Verify phone number", "Add payment amount", "Open Razorpay checkout", "Receive payment success confirmation", "View payment history"],
    admin: ["Configure Razorpay test key", "Validate checkout fields", "Track payment records", "Review customer payment details", "Prepare gateway-ready checkout flow"],
    security: ["Phone verification step", "Required checkout fields", "Razorpay secure checkout popup", "Payment status feedback", "Responsive payment UI"],
    outcome: "The project gives a practical payment gateway workflow that can be connected to business websites, e-commerce stores, booking forms, and service payment pages.",
    screens: [
      { site: "Payclick Payment Project", title: "Razorpay Checkout Flow", detail: "Customer details, phone verification, payment amount, Razorpay checkout popup, success response, and payment history.", demoUrl: "payment.html", image: "https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&w=1100&q=80", action: "Open Payment Project" },
    ],
  },
};

const getContactData = () => {
  const formData = new FormData(contactForm);
  return {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || "",
    subject: formData.get("subject") || "Website Contact",
    message: formData.get("message"),
  };
};

const buildMessage = () => {
  const data = getContactData();
  return `Name: ${data.name}
Email: ${data.email}
Phone / WhatsApp: ${data.phone}
Project Title: ${data.subject}
Message: ${data.message}`;
};

const saveContactMessage = async (data) => {
  const isLocalServer = ["127.0.0.1", "localhost"].includes(window.location.hostname);

  if (isLocalServer) {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Local backend save failed");
    }

    return;
  }

  const formBody = new URLSearchParams({
    "form-name": "contact",
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  });

  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formBody.toString(),
  });

  if (!response.ok) {
    throw new Error("Netlify form save failed");
  }
};

const buildGmailUrl = () => {
  const data = getContactData();
  const subject = encodeURIComponent(data.subject || "Website Contact");
  const body = encodeURIComponent(buildMessage());
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=${subject}&body=${body}`;
};

const staticMailSubject = "Website Project Enquiry";
const staticMailBody = "Hi Mohammed Aaris,\n\nI want to discuss a website project.";
const staticGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${contactEmail}&su=${encodeURIComponent(staticMailSubject)}&body=${encodeURIComponent(staticMailBody)}`;

const shouldUseDeviceMailApp = () => {
  const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  return isSmallScreen || isTouchDevice;
};

const openEmail = () => {
  const data = getContactData();
  const subject = encodeURIComponent(data.subject || "Website Contact");
  const body = encodeURIComponent(buildMessage());
  const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

  formStatus.textContent = "Opening default mail app. Please press Send in your mail app.";
  window.location.href = mailtoUrl;
};

const copyEmail = async (button) => {
  const email = button.dataset.copyEmail || contactEmail;

  try {
    await navigator.clipboard.writeText(email);
  } catch (error) {
    const tempInput = document.createElement("input");
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    tempInput.remove();
  }

  button.classList.add("copied");
  const smallText = button.querySelector("small");
  const labelText = button.querySelector(".footer-copy span");
  const originalText = smallText?.textContent;
  const originalLabel = labelText?.textContent;

  if (smallText) {
    smallText.textContent = "copied";
  } else if (labelText) {
    labelText.textContent = "Copied";
  } else {
    button.textContent = "Copied: mohammedaaris02@gmail.com";
  }

  window.setTimeout(() => {
    button.classList.remove("copied");
    if (smallText) {
      smallText.textContent = originalText || "click to copy";
    } else if (labelText) {
      labelText.textContent = originalLabel || email;
    } else {
      button.textContent = email;
    }
  }, 1800);
};

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const updateHeaderShape = () => {
  siteHeader.classList.toggle("scrolled", window.scrollY > 32);
};

const updateActiveMenu = () => {
  const sections = ["about", "skills", "certifications", "services", "projects", "contact"];
  const scrollPosition = window.scrollY + window.innerHeight * 0.35;
  let activeSection = "about";

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section && section.offsetTop <= scrollPosition) {
      activeSection = sectionId;
    }
  });

  navItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("href") === `#${activeSection}`);
  });
};

const updateNavState = () => {
  updateHeaderShape();
  updateActiveMenu();
};

window.addEventListener("scroll", updateNavState, { passive: true });
window.addEventListener("resize", updateActiveMenu);
updateNavState();

whatsappButton.addEventListener("click", async () => {
  if (!contactForm.reportValidity()) {
    return;
  }

  formStatus.textContent = "Opening WhatsApp with your message...";
  const data = getContactData();

  const encodedMessage = encodeURIComponent(buildMessage());
  window.open(`https://wa.me/917200291544?text=${encodedMessage}`, "_blank", "noopener");
  formStatus.textContent = "WhatsApp opened. Please press Send there.";
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    return;
  }

  whatsappButton.click();
});

copyEmailButtons.forEach((button) => {
  button.addEventListener("click", () => copyEmail(button));
});

directMailLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (shouldUseDeviceMailApp()) {
      return;
    }

    event.preventDefault();
    window.open(staticGmailUrl, "_blank", "noopener");
  });
});

if (messageInput && messageCount) {
  const updateMessageCount = () => {
    messageCount.textContent = String(messageInput.value.length);
  };

  messageInput.addEventListener("input", updateMessageCount);
  updateMessageCount();
}

serviceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openServiceModal(button.dataset.service);
  });
});

const renderList = (target, items) => {
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
};

const openServiceModal = (serviceKey) => {
  const service = serviceDetails[serviceKey];

  if (!service || !serviceModal) {
    return;
  }

  serviceModalCategory.textContent = service.category;
  serviceModalTitle.textContent = service.title;
  serviceModalDescription.textContent = service.description;
  serviceModalImage.src = service.image;
  serviceModalImage.alt = service.alt;
  serviceModalTech.innerHTML = service.tech.map((item) => `<span>${item}</span>`).join("");
  serviceModalDetails.innerHTML = service.details.map(([title, detail]) => `
    <section>
      <h3>${title}</h3>
      <p>${detail}</p>
    </section>
  `).join("");

  serviceModal.classList.add("open");
  serviceModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeServiceModal = () => {
  if (!serviceModal) {
    return;
  }

  serviceModal.classList.remove("open");
  serviceModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

const openProjectModal = (projectKey) => {
  const project = projectDetails[projectKey];
  if (!project || !projectModal) {
    return;
  }

  if (projectModalImage) {
    projectModalImage.src = project.image || "";
    projectModalImage.alt = project.alt || "";
  }
  projectModalCategory.textContent = project.category;
  projectModalTitle.textContent = project.title;
  projectModalDescription.textContent = project.description;
  projectModalTech.innerHTML = project.tech.map((item) => `<span>${item}</span>`).join("");
  projectModalOverview.textContent = project.overview;
  projectModalPurpose.textContent = project.purpose;
  renderList(projectModalUser, project.user);
  renderList(projectModalAdmin, project.admin);
  renderList(projectModalSecurity, project.security);
  projectModalOutcome.textContent = project.outcome;
  projectModalScreens.innerHTML = project.screens
    .map((screen, index) => `
      <${screen.demoUrl ? `a href="${screen.demoUrl}" target="_blank" rel="noopener" data-action="${screen.action || "Open Site"}"` : "article"} class="screen-card demo-site-card">
        <div class="demo-preview demo-preview-${index + 1}" aria-hidden="true">
          ${screen.image ? `<img src="${screen.image}" alt="">` : ""}
          <div class="demo-browser-bar"><span></span><span></span><span></span></div>
          <div class="demo-hero-line"></div>
          <div class="demo-layout">
            <span></span><span></span><span></span>
          </div>
        </div>
        <span class="demo-site-name">${screen.site}</span>
        <strong>${screen.title}</strong>
        <p>${screen.detail}</p>
      </${screen.demoUrl ? "a" : "article"}>
    `)
    .join("");

  projectModal.classList.add("open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
};

const closeProjectModal = () => {
  if (!projectModal) {
    return;
  }

  projectModal.classList.remove("open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
};

document.querySelectorAll(".project-card").forEach((card) => {
  const projectKey = card.dataset.project;

  card.addEventListener("click", () => openProjectModal(projectKey));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectModal(projectKey);
    }
  });
});

document.querySelectorAll("[data-close-project]").forEach((element) => {
  element.addEventListener("click", closeProjectModal);
});

document.querySelectorAll("[data-close-service]").forEach((element) => {
  element.addEventListener("click", closeServiceModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && projectModal?.classList.contains("open")) {
    closeProjectModal();
  }

  if (event.key === "Escape" && serviceModal?.classList.contains("open")) {
    closeServiceModal();
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

const startLiveBackground = () => {
  if (!liveBackground || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const context = liveBackground.getContext("2d");
  const particles = [];
  const colors = ["rgba(34, 230, 168, 0.9)", "rgba(77, 163, 255, 0.85)", "rgba(247, 201, 72, 0.58)"];
  let width = 0;
  let height = 0;
  let animationFrame = 0;

  const resize = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    liveBackground.width = Math.floor(width * ratio);
    liveBackground.height = Math.floor(height * ratio);
    liveBackground.style.width = `${width}px`;
    liveBackground.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const targetCount = Math.min(90, Math.max(42, Math.floor((width * height) / 18000)));
    particles.length = 0;

    for (let index = 0; index < targetCount; index += 1) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.42,
        vy: (Math.random() - 0.5) * 0.42,
        size: Math.random() * 1.9 + 0.8,
        color: colors[index % colors.length],
      });
    }
  };

  const draw = () => {
    context.clearRect(0, 0, width, height);

    for (const particle of particles) {
      particle.x += particle.vx;
      particle.y += particle.vy;

      if (particle.x < 0 || particle.x > width) {
        particle.vx *= -1;
      }

      if (particle.y < 0 || particle.y > height) {
        particle.vy *= -1;
      }

      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fillStyle = particle.color;
      context.fill();
    }

    for (let a = 0; a < particles.length; a += 1) {
      for (let b = a + 1; b < particles.length; b += 1) {
        const first = particles[a];
        const second = particles[b];
        const distance = Math.hypot(first.x - second.x, first.y - second.y);

        if (distance < 128) {
          context.beginPath();
          context.moveTo(first.x, first.y);
          context.lineTo(second.x, second.y);
          context.strokeStyle = `rgba(77, 163, 255, ${0.17 * (1 - distance / 128)})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    }

    animationFrame = requestAnimationFrame(draw);
  };

  window.addEventListener("resize", resize);
  resize();
  draw();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      draw();
    }
  });
};

startLiveBackground();
