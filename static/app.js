// Application State
let appData = {
    hypervisors: [],
    servers: [],
    flavors: [],
    mode: "Loading..."
};

let currentFilterQuery = "";
let currentStatusFilter = "";
let selectedAggregateFilters = null;
let currentNodesView = localStorage.getItem("os-op-nodes-view") || "cards";
let currentLang = localStorage.getItem("os-op-lang") || "en";
let currentTheme = localStorage.getItem("os-op-theme") || "dark";

// Translations
const translations = {
    es: {
        subTitle: "Monitoreo inteligente y visualización en tiempo real de VMs e Hypervisors en la Infraestructura espSRC",
        btnUpload: "Subir archivo OpenStack RC",
        btnLogout: "Cerrar sesión",
        toastLogout: "Sesión cerrada",
        hostAggregate: "Host aggregate",
        noHostAggregate: "Sin aggregate",
        filterAggregates: "Filtrar aggregates:",
        viewCards: "Tarjetas",
        viewRows: "Filas",
        noFilteredHypervisors: "No hay hypervisors para los aggregates seleccionados.",
        listNode: "Hypervisor",
        listAggregate: "Aggregate",
        listCpu: "CPU",
        listRam: "RAM",
        listVms: "VMs",
        lblStatVms: "Instancias Activas (VMs)",
        lblStatNodes: "Nodos Físicos",
        lblStatCores: "CPUs Totales Asignadas",
        lblStatRam: "Memoria RAM Asignada",
        lblStatStorage: "Shared Storage (TB)",
        statVmsSub: "activas de",
        statNodesSub: "nodos operativos",
        statCoresSub: "Uso medio del CPU",
        statRamSub: "Uso medio de RAM",
        statStorageSub: "Capacidad ocupada",
        tabNodes: "Vista por Nodos",
        tabSearch: "Búsqueda / Catálogo VMs",
        tabMetadata: "Proyectos y Metadatos",
        searchPlaceholder: "Buscar por Nombre, Flavor, IP, Nodo, Proyecto...",
        optAllStatus: "Todos los Estados",
        thName: "Nombre VM",
        thStatus: "Estado",
        thFlavor: "Flavor",
        thSpecs: "Specs",
        thIp: "Dirección IP",
        thNode: "Nodo Físico",
        thProject: "Proyecto / Tenant",
        lblChartProjects: "VMs por Proyecto",
        lblChartMetadata: "Metadatos Clave (Entornos)",
        footerLove: "Hecho con toneladas de amor 🇪🇸❤️",
        noHypervisors: "No hay hypervisors registrados.",
        noVmsAssigned: "No hay VMs asignadas",
        noVmsFound: "No se encontraron VMs que coincidan con la búsqueda.",
        loading: "Cargando datos...",
        cpuUsage: "Uso de CPU",
        ramUsage: "Uso de RAM",
        virtualMachines: "Máquinas Virtuales",
        vms: "VMs",
        unassigned: "Sin Etiqueta",
        none: "Ninguna",
        toastMockOn: "Simulador activado",
        toastMockOff: "Conectando al API de OpenStack...",
        toastErrorLoad: "Error al cargar la información: ",
        toastErrorUpload: "Error subiendo archivo RC",
        toastErrorMode: "No se pudo cambiar el modo de ejecución",
        toastErrorConn: "Error de comunicación: ",
        modalAuthSubtitle: "Selecciona una opción para conectar con la nube OpenStack",
        modalOptionRcTitle: "Opción A: Cargar Fichero RC",
        modalOptionRcDesc: "Sube tu archivo openrc.sh con tus credenciales completas.",
        modalBtnUploadText: "Seleccionar Fichero RC (.sh)",
        modalOrText: "O bien",
        modalOptionPassTitle: "Opción B: Introducir Credenciales",
        modalOptionPassDesc: "Conexión directa con la nube espSRC (Proyecto: spsrc).",
        modalLblUser: "Usuario de OpenStack:",
        modalLblPass: "Contraseña:",
        modalInputUsernamePlaceholder: "Usuario (ej. mparra)",
        modalInputPasswordPlaceholder: "Contraseña de OpenStack",
        modalBtnLogin: "Conectar a OpenStack",
        modalBtnLoginLoading: "Conectando y cargando datos..."
    },
    en: {
        subTitle: "Intelligent monitoring and real-time visualization of VMs and Hypervisors at the espSRC Infrastructure",
        btnUpload: "Upload OpenStack RC file",
        btnLogout: "Log out",
        toastLogout: "Logged out",
        hostAggregate: "Host aggregate",
        noHostAggregate: "No aggregate",
        filterAggregates: "Filter aggregates:",
        viewCards: "Cards",
        viewRows: "Rows",
        noFilteredHypervisors: "No hypervisors match the selected aggregates.",
        listNode: "Hypervisor",
        listAggregate: "Aggregate",
        listCpu: "CPU",
        listRam: "RAM",
        listVms: "VMs",
        lblStatVms: "Active Instances (VMs)",
        lblStatNodes: "Physical Nodes",
        lblStatCores: "Total Allocated CPUs",
        lblStatRam: "Allocated RAM Memory",
        lblStatStorage: "Shared Storage (TB)",
        statVmsSub: "active of",
        statNodesSub: "operational nodes",
        statCoresSub: "Average CPU usage",
        statRamSub: "Average RAM usage",
        statStorageSub: "Capacity in use",
        tabNodes: "View by Nodes",
        tabSearch: "Search / VM Catalog",
        tabMetadata: "Projects and Metadata",
        searchPlaceholder: "Search by Name, Flavor, IP, Node, Project...",
        optAllStatus: "All Statuses",
        thName: "VM Name",
        thStatus: "Status",
        thFlavor: "Flavor",
        thSpecs: "Specs",
        thIp: "IP Address",
        thNode: "Physical Node",
        thProject: "Project / Tenant",
        lblChartProjects: "VMs by Project",
        lblChartMetadata: "Key Metadata (Environments)",
        footerLove: "Made with tons of love 🇪🇸❤️",
        noHypervisors: "No hypervisors registered.",
        noVmsAssigned: "No VMs assigned",
        noVmsFound: "No VMs found matching search criteria.",
        loading: "Loading data...",
        cpuUsage: "CPU Usage",
        ramUsage: "RAM Usage",
        virtualMachines: "Virtual Machines",
        vms: "VMs",
        unassigned: "Unassigned",
        none: "None",
        toastMockOn: "Simulator enabled",
        toastMockOff: "Connecting to OpenStack API...",
        toastErrorLoad: "Error loading information: ",
        toastErrorUpload: "Error uploading RC file",
        toastErrorMode: "Could not switch execution mode",
        toastErrorConn: "Communication error: ",
        modalAuthSubtitle: "Choose an option to connect to the OpenStack cloud",
        modalOptionRcTitle: "Option A: Upload RC File",
        modalOptionRcDesc: "Upload your openrc.sh file with full credentials.",
        modalBtnUploadText: "Select RC File (.sh)",
        modalOrText: "Or else",
        modalOptionPassTitle: "Option B: Enter Credentials",
        modalOptionPassDesc: "Direct connection to the espSRC cloud (Project: spsrc).",
        modalLblUser: "OpenStack Username:",
        modalLblPass: "Password:",
        modalInputUsernamePlaceholder: "Username (e.g. mparra)",
        modalInputPasswordPlaceholder: "OpenStack Password",
        modalBtnLogin: "Connect to OpenStack",
        modalBtnLoginLoading: "Connecting and loading data..."
    }
};

// DOM Elements
const modeIndicator = document.getElementById("mode-indicator");
const btnLogout = document.getElementById("btn-logout");
const fileInput = document.getElementById("file-input");
const searchBar = document.getElementById("search-bar");
const filterStatus = document.getElementById("filter-status");
const langSelect = document.getElementById("lang-select");
const themeSelect = document.getElementById("theme-select");
const aggregateFilter = document.getElementById("aggregate-filter");
const nodesViewCards = document.getElementById("nodes-view-cards");
const nodesViewRows = document.getElementById("nodes-view-rows");
const nodesListHeader = document.getElementById("nodes-list-header");

// Stats elements
const statVms = document.getElementById("stat-vms");
const statVmsSub = document.getElementById("stat-vms-sub");
const statNodes = document.getElementById("stat-nodes");
const statNodesSub = document.getElementById("stat-nodes-sub");
const statCores = document.getElementById("stat-cores");
const statCoresSub = document.getElementById("stat-cores-sub");
const statRam = document.getElementById("stat-ram");
const statRamSub = document.getElementById("stat-ram-sub");

// Containers
const nodesContainer = document.getElementById("nodes-container");
const vmsTableBody = document.getElementById("vms-table-body");
const projectChartContainer = document.getElementById("project-chart-container");
const metadataChartContainer = document.getElementById("metadata-chart-container");
const toast = document.getElementById("toast");

// Toast helper
function showToast(message, type = "success") {
    toast.className = `toast show ${type}`;
    toast.textContent = message;
    setTimeout(() => {
        toast.className = "toast";
    }, 4000);
}

// Internationalization applier
function applyTranslations() {
    const t = translations[currentLang];
    
    document.getElementById("sub-title").textContent = t.subTitle;
    document.getElementById("btn-upload-text").textContent = t.btnUpload;
    document.getElementById("btn-logout-text").textContent = t.btnLogout;
    
    document.getElementById("lbl-stat-vms").textContent = t.lblStatVms;
    document.getElementById("lbl-stat-nodes").textContent = t.lblStatNodes;
    document.getElementById("lbl-stat-cores").textContent = t.lblStatCores;
    document.getElementById("lbl-stat-ram").textContent = t.lblStatRam;
    document.getElementById("lbl-stat-storage").textContent = t.lblStatStorage;
    
    document.getElementById("btn-tab-nodes").textContent = t.tabNodes;
    document.getElementById("btn-tab-search").textContent = t.tabSearch;
    document.getElementById("btn-tab-metadata").textContent = t.tabMetadata;
    nodesViewCards.textContent = t.viewCards;
    nodesViewRows.textContent = t.viewRows;
    
    searchBar.placeholder = t.searchPlaceholder;
    document.getElementById("opt-all-status").textContent = t.optAllStatus;
    
    document.getElementById("th-name").textContent = t.thName;
    document.getElementById("th-status").textContent = t.thStatus;
    document.getElementById("th-flavor").textContent = t.thFlavor;
    document.getElementById("th-specs").textContent = t.thSpecs;
    document.getElementById("th-ip").textContent = t.thIp;
    document.getElementById("th-node").textContent = t.thNode;
    document.getElementById("th-project").textContent = t.thProject;
    
    document.getElementById("lbl-chart-projects").textContent = t.lblChartProjects;
    document.getElementById("lbl-chart-metadata").textContent = t.lblChartMetadata;
    document.getElementById("footer-love").textContent = t.footerLove;
    
    // Modal translations
    if (document.getElementById("modal-auth-subtitle")) {
        document.getElementById("modal-auth-subtitle").textContent = t.modalAuthSubtitle;
        document.getElementById("modal-option-rc-title").textContent = t.modalOptionRcTitle;
        document.getElementById("modal-option-rc-desc").textContent = t.modalOptionRcDesc;
        document.getElementById("modal-btn-upload-text").textContent = t.modalBtnUploadText;
        document.getElementById("modal-or-text").textContent = t.modalOrText;
        document.getElementById("modal-option-pass-title").textContent = t.modalOptionPassTitle;
        document.getElementById("modal-option-pass-desc").textContent = t.modalOptionPassDesc;
        document.getElementById("modal-lbl-user").textContent = t.modalLblUser;
        if (document.getElementById("modal-lbl-pass")) document.getElementById("modal-lbl-pass").textContent = t.modalLblPass;
        document.getElementById("modal-input-username").placeholder = t.modalInputUsernamePlaceholder;
        document.getElementById("modal-input-password").placeholder = t.modalInputPasswordPlaceholder;
        const loginButtonText = document.getElementById("modal-btn-login-text");
        if (loginButtonText && !document.getElementById("modal-btn-login").disabled) {
            loginButtonText.textContent = t.modalBtnLogin;
        }
    }

    updateHeaderAndMode();
}

// Check authentication status and toggle modal
async function checkAuthStatus() {
    try {
        const res = await fetch("/api/auth-status");
        if (res.ok) {
            const data = await res.json();
            if (data.username && document.getElementById("modal-input-username")) {
                document.getElementById("modal-input-username").value = data.username;
            }
            
            if (data.authenticated) {
                return true;
            } else {
                lockDashboard();
                return false;
            }
        }
    } catch (e) {
        console.error("Error checking auth status:", e);
    }
    lockDashboard();
    return false;
}

function lockDashboard() {
    document.body.classList.add("auth-locked");
    const overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.style.display = "flex";
}

function unlockDashboard() {
    document.body.classList.remove("auth-locked");
    const overlay = document.getElementById("auth-overlay");
    if (overlay) overlay.style.display = "none";
}

function setLoginLoading(isLoading) {
    const button = document.getElementById("modal-btn-login");
    const buttonText = document.getElementById("modal-btn-login-text");
    const usernameInput = document.getElementById("modal-input-username");
    const passwordInput = document.getElementById("modal-input-password");
    if (!button || !buttonText) return;

    button.disabled = isLoading;
    button.classList.toggle("is-loading", isLoading);
    button.setAttribute("aria-busy", String(isLoading));
    buttonText.textContent = isLoading
        ? translations[currentLang].modalBtnLoginLoading
        : translations[currentLang].modalBtnLogin;
    if (usernameInput) usernameInput.disabled = isLoading;
    if (passwordInput) passwordInput.disabled = isLoading;
}

// Apply Theme
function applyTheme() {
    if (currentTheme === "light") {
        document.body.classList.add("light-theme");
    } else {
        document.body.classList.remove("light-theme");
    }
}

// Fetch dashboard data
async function fetchData() {
    try {
        const response = await fetch("/api/data");
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.detail || "Error fetching data from API");
        }
        appData = result;
        
        updateHeaderAndMode();
        calculateAndRenderStats();
        renderNodesView();
        renderSearchView();
        renderMetadataView();
        return true;
    } catch (error) {
        const t = translations[currentLang];
        showToast(t.toastErrorLoad + error.message, "error");
        return false;
    }
}

// Update application mode indicator in header
function updateHeaderAndMode() {
    const t = translations[currentLang];
    
    // Check if back-end has a specific mode string
    let displayMode = appData.mode;
    if (appData.mode === "Loading...") {
        displayMode = t.loading;
    }
    
    modeIndicator.textContent = displayMode;
    
    const currentIsMock = appData.mode.includes("Mock") || appData.mode.includes("Fallback");
    if (!currentIsMock) {
        modeIndicator.className = "status-badge live";
    } else {
        modeIndicator.className = "status-badge mock";
    }
}

// Stats Calculators and Renderer
function calculateAndRenderStats() {
    const t = translations[currentLang];
    const totalVMs = appData.servers.length;
    const activeVMs = appData.servers.filter(s => s.status === "ACTIVE").length;
    
    // Hypervisors summary
    const totalNodes = appData.hypervisors.length;
    const activeNodes = appData.hypervisors.filter(h => h.state === "up").length;
    
    // Cores usage
    let totalCores = 0;
    let usedCores = 0;
    let totalMemory = 0;
    let usedMemory = 0;
    
    appData.hypervisors.forEach(h => {
        totalCores += h.vcpus;
        usedCores += h.vcpus_used;
        totalMemory += h.memory_mb;
        usedMemory += h.memory_mb_used;
    });

    // Render Stats
    statVms.textContent = `${activeVMs} / ${totalVMs}`;
    statVmsSub.textContent = `${activeVMs} ${t.statVmsSub} ${totalVMs}`;
    
    statNodes.textContent = totalNodes;
    statNodesSub.textContent = `${activeNodes}/${totalNodes} ${t.statNodesSub}`;
    
    statCores.textContent = `${usedCores} / ${totalCores}`;
    const cpuPct = totalCores > 0 ? Math.round((usedCores / totalCores) * 100) : 0;
    statCoresSub.textContent = `${t.statCoresSub}: ${cpuPct}%`;
    
    const usedGb = Math.round(usedMemory / 1024);
    const totalGb = Math.round(totalMemory / 1024);
    statRam.textContent = `${usedGb} GB / ${totalGb} GB`;
    const ramPct = totalMemory > 0 ? Math.round((usedMemory / totalMemory) * 100) : 0;
    statRamSub.textContent = `${t.statRamSub}: ${ramPct}%`;

    // Shared Storage
    let totalStorageGb = 0;
    let usedStorageGb = 0;
    appData.hypervisors.forEach(h => {
        totalStorageGb += h.local_gb || 0;
        usedStorageGb += h.local_gb_used || 0;
    });
    const totalTb = (totalStorageGb / 1024).toFixed(1);
    const usedTb = (usedStorageGb / 1024).toFixed(1);
    const storagePct = totalStorageGb > 0 ? Math.round((usedStorageGb / totalStorageGb) * 100) : 0;
    document.getElementById("stat-storage").textContent = `${usedTb} TB / ${totalTb} TB`;
    document.getElementById("stat-storage-sub").textContent = `${t.statStorageSub}: ${storagePct}%`;
}

// Tab 1: Render View by Nodes
function renderNodesView() {
    const t = translations[currentLang];
    nodesContainer.innerHTML = "";
    nodesContainer.className = currentNodesView === "rows" ? "nodes-list nodes-list-scroll" : "nodes-grid";
    nodesViewCards.classList.toggle("active", currentNodesView === "cards");
    nodesViewRows.classList.toggle("active", currentNodesView === "rows");

    if (appData.hypervisors.length === 0) {
        aggregateFilter.innerHTML = "";
        nodesListHeader.hidden = true;
        nodesContainer.innerHTML = `<div class='glass-panel' style='grid-column: 1/-1; text-align: center; color: var(--text-secondary);'>${t.noHypervisors}</div>`;
        return;
    }

    const noAggregateKey = "__no_aggregate__";
    const availableAggregates = [...new Set(appData.hypervisors.flatMap(node =>
        (node.host_aggregates || []).map(aggregate => aggregate.name)
    ))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
    if (appData.hypervisors.some(node => !(node.host_aggregates || []).length)) availableAggregates.push(noAggregateKey);
    if (selectedAggregateFilters === null) selectedAggregateFilters = new Set(availableAggregates);
    selectedAggregateFilters = new Set([...selectedAggregateFilters].filter(name => availableAggregates.includes(name)));

    aggregateFilter.innerHTML = `<span class="host-aggregate-label">${t.filterAggregates}</span>` + availableAggregates.map(name => {
        const label = name === noAggregateKey ? t.noHostAggregate : name;
        const active = selectedAggregateFilters.has(name);
        return `<button type="button" class="filter-chip${active ? " active" : ""}" data-aggregate="${name}" aria-pressed="${active}">${label}</button>`;
    }).join("");

    const sortedHypervisors = appData.hypervisors.filter(node => {
        const nodeAggregates = (node.host_aggregates || []).map(aggregate => aggregate.name);
        return nodeAggregates.length
            ? nodeAggregates.some(name => selectedAggregateFilters.has(name))
            : selectedAggregateFilters.has(noAggregateKey);
    }).sort((a, b) =>
        (a.hypervisor_hostname || "").localeCompare(
            b.hypervisor_hostname || "",
            undefined,
            { numeric: true, sensitivity: "base" }
        )
    );

    nodesListHeader.hidden = currentNodesView !== "rows";
    nodesListHeader.innerHTML = currentNodesView === "rows" ? `<div class="nodes-list-header"><span>${t.listNode}</span><span>${t.listAggregate}</span><span>${t.listCpu}</span><span>${t.listRam}</span><span>${t.listVms}</span><span>${t.thStatus}</span></div>` : "";

    if (sortedHypervisors.length === 0) {
        nodesContainer.innerHTML = `<div class='glass-panel' style='text-align: center; color: var(--text-secondary);'>${t.noFilteredHypervisors}</div>`;
        return;
    }

    sortedHypervisors.forEach(node => {
        // Group VMs for this node
        const nodeVMs = appData.servers.filter(s => s["OS-EXT-SRV-ATTR:hypervisor_hostname"] === node.hypervisor_hostname);
        
        const cpuPct = node.vcpus > 0 ? Math.round((node.vcpus_used / node.vcpus) * 100) : 0;
        const ramPct = node.memory_mb > 0 ? Math.round((node.memory_mb_used / node.memory_mb) * 100) : 0;
        
        // Progress bar status colors
        const getProgressClass = (pct) => {
            if (pct >= 90) return 'critical';
            if (pct >= 75) return 'high';
            return '';
        };

        const card = document.createElement("div");
        
        let vmsListHtml = nodeVMs.map(vm => {
            const cores = vm.flavor?.vcpus || 0;
            const ram = vm.flavor?.ram || 0;
            const specs = `${cores}c/${ram}m`;
            return `
                <div class="vm-item">
                    <span style="font-weight: 500;">${vm.name} <span style="opacity: 0.55; font-size: 0.72rem; font-family: var(--font-mono); margin-left: 0.25rem;">(${specs})</span></span>
                    <span class="badge ${vm.status.toLowerCase()}">${vm.status}</span>
                </div>
            `;
        }).join("");

        if (nodeVMs.length === 0) {
            vmsListHtml = `<div style="text-align: center; color: var(--text-muted); font-size: 0.8rem; padding: 1rem 0;">${t.noVmsAssigned}</div>`;
        }

        const aggregateLabels = (node.host_aggregates || []).map(aggregate => {
            const type = aggregate.metadata?.type || aggregate.name;
            const zone = aggregate.availability_zone ? ` · ${aggregate.availability_zone}` : "";
            return `<span class="host-aggregate-badge">${type}${zone}</span>`;
        }).join("") || `<span class="host-aggregate-badge empty">${t.noHostAggregate}</span>`;

        const compactVmsHtml = nodeVMs.map(vm => {
            const cores = vm.flavor?.vcpus || 0;
            const ramMb = vm.flavor?.ram || 0;
            const ramLabel = ramMb >= 1024 ? `${(ramMb / 1024).toFixed(ramMb % 1024 === 0 ? 0 : 1)}GB` : `${ramMb}MB`;
            return `<span class="node-list-vm-badge">${vm.name}<span class="vm-specs">${cores}c/${ramLabel}</span></span>`;
        }).join("") || `<span class="host-aggregate-label">${t.noVmsAssigned}</span>`;

        if (currentNodesView === "rows") {
            card.className = "glass-panel node-list-row";
            card.innerHTML = `
                <div><div class="node-title">${node.hypervisor_hostname}</div><div class="host-aggregate-label">ID: ${node.id}</div></div>
                <div class="host-aggregate-row">${aggregateLabels}</div>
                <div class="node-list-metric"><span>${node.vcpus_used} / ${node.vcpus} (${cpuPct}%)</span><div class="progress-bg"><div class="progress-fill ${getProgressClass(cpuPct)}" style="width:${cpuPct}%"></div></div></div>
                <div class="node-list-metric"><span>${Math.round(node.memory_mb_used / 1024)} / ${Math.round(node.memory_mb / 1024)} GB (${ramPct}%)</span><div class="progress-bg"><div class="progress-fill ${getProgressClass(ramPct)}" style="width:${ramPct}%"></div></div></div>
                <div class="node-list-vms"><strong>${nodeVMs.length}</strong>${compactVmsHtml}</div>
                <span class="node-status ${node.state.toLowerCase()}">${node.state.toUpperCase()}</span>`;
        } else {
            card.className = "glass-panel node-card";
            card.innerHTML = `
            <div class="node-header">
                <div>
                    <div class="node-title">${node.hypervisor_hostname}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem;">ID: ${node.id}</div>
                    <div class="host-aggregate-row">
                        <span class="host-aggregate-label">${t.hostAggregate}:</span>
                        ${aggregateLabels}
                    </div>
                </div>
                <span class="node-status ${node.state.toLowerCase()}">${node.state.toUpperCase()}</span>
            </div>
            
            <div class="progress-container">
                <div class="progress-bar-label">
                    <span>${t.cpuUsage}</span>
                    <span>${node.vcpus_used} / ${node.vcpus} Cores (${cpuPct}%)</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill ${getProgressClass(cpuPct)}" style="width: ${cpuPct}%;"></div>
                </div>
            </div>

            <div class="progress-container">
                <div class="progress-bar-label">
                    <span>${t.ramUsage}</span>
                    <span>${Math.round(node.memory_mb_used / 1024)} / ${Math.round(node.memory_mb / 1024)} GB (${ramPct}%)</span>
                </div>
                <div class="progress-bg">
                    <div class="progress-fill ${getProgressClass(ramPct)}" style="width: ${ramPct}%;"></div>
                </div>
            </div>

            <div style="margin-top: 0.5rem;">
                <div style="font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>${t.virtualMachines}</span>
                    <span>${nodeVMs.length} ${t.vms}</span>
                </div>
                <div class="node-vms-list">
                    ${vmsListHtml}
                </div>
            </div>
        `;
        }
        nodesContainer.appendChild(card);
    });
}

aggregateFilter.addEventListener("click", event => {
    const button = event.target.closest("[data-aggregate]");
    if (!button) return;
    const aggregateName = button.dataset.aggregate;
    if (selectedAggregateFilters.has(aggregateName)) selectedAggregateFilters.delete(aggregateName);
    else selectedAggregateFilters.add(aggregateName);
    renderNodesView();
});

function setNodesView(view) {
    currentNodesView = view;
    localStorage.setItem("os-op-nodes-view", view);
    renderNodesView();
}

nodesViewCards.addEventListener("click", () => setNodesView("cards"));
nodesViewRows.addEventListener("click", () => setNodesView("rows"));

// Tab 2: Render Search View
function renderSearchView() {
    const t = translations[currentLang];
    vmsTableBody.innerHTML = "";
    
    // Filter VMs
    const filteredVMs = appData.servers.filter(vm => {
        const query = currentFilterQuery.toLowerCase();
        
        // Status filter
        if (currentStatusFilter && vm.status !== currentStatusFilter) return false;
        
        // Text Search (Name, flavor, IP, Node, Project, Metadata values)
        const nameMatch = vm.name.toLowerCase().includes(query);
        const flavorMatch = (vm.flavor?.name || "").toLowerCase().includes(query);
        const nodeMatch = (vm["OS-EXT-SRV-ATTR:hypervisor_hostname"] || "").toLowerCase().includes(query);
        const projectMatch = (vm.project_name || "").toLowerCase().includes(query) || (vm.tenant_id || "").toLowerCase().includes(query);
        
        // Match IPs
        let ipMatch = false;
        if (vm.addresses) {
            ipMatch = Object.values(vm.addresses).some(network => 
                network.some(addrInfo => addrInfo.addr.includes(query))
            );
        }
        
        // Match metadata
        let metadataMatch = false;
        if (vm.metadata) {
            metadataMatch = Object.entries(vm.metadata).some(([k, v]) => 
                k.toLowerCase().includes(query) || String(v).toLowerCase().includes(query)
            );
        }

        return nameMatch || flavorMatch || nodeMatch || projectMatch || ipMatch || metadataMatch;
    });

    if (filteredVMs.length === 0) {
        vmsTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">${t.noVmsFound}</td></tr>`;
        return;
    }

    filteredVMs.forEach(vm => {
        // Collect IP addresses into string list
        let ips = [];
        if (vm.addresses) {
            Object.entries(vm.addresses).forEach(([netName, addrs]) => {
                addrs.forEach(a => ips.push(a.addr));
            });
        }
        const ipStr = ips.length > 0 ? ips.join(", ") : t.none;
        const cores = vm.flavor?.vcpus || 0;
        const ram = vm.flavor?.ram || 0;
        const specs = `${cores}c/${ram}m`;
        
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td style="font-weight: 500; font-family: var(--font-mono); font-size: 0.85rem;">${vm.name}</td>
            <td><span class="badge ${vm.status.toLowerCase()}">${vm.status}</span></td>
            <td>${vm.flavor?.name || "unknown"}</td>
            <td style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-secondary);">${specs}</td>
            <td style="font-family: var(--font-mono); font-size: 0.85rem;">${ipStr}</td>
            <td style="color: var(--text-secondary); font-size: 0.85rem;">${vm["OS-EXT-SRV-ATTR:hypervisor_hostname"] || "No asignado"}</td>
            <td style="font-size: 0.85rem;">${vm.project_name || vm.tenant_id || "default"}</td>
        `;
        vmsTableBody.appendChild(tr);
    });
}

// Tab 3: Render Metadata / Projects statistics
function renderMetadataView() {
    const t = translations[currentLang];
    projectChartContainer.innerHTML = "";
    metadataChartContainer.innerHTML = "";
    
    if (appData.servers.length === 0) {
        projectChartContainer.innerHTML = `<div style='color: var(--text-muted); padding: 1rem;'>${t.loading}</div>`;
        metadataChartContainer.innerHTML = `<div style='color: var(--text-muted); padding: 1rem;'>${t.loading}</div>`;
        return;
    }

    // 1. Group VMs by Project
    const projectsMap = {};
    appData.servers.forEach(vm => {
        const proj = vm.project_name || vm.tenant_id || "default";
        projectsMap[proj] = (projectsMap[proj] || 0) + 1;
    });

    // Sort projects by count
    const sortedProjects = Object.entries(projectsMap).sort((a, b) => b[1] - a[1]);
    const maxProjectCount = Math.max(...Object.values(projectsMap));

    sortedProjects.forEach(([proj, count]) => {
        const pct = maxProjectCount > 0 ? Math.round((count / maxProjectCount) * 100) : 0;
        const row = document.createElement("div");
        row.className = "chart-row";
        row.innerHTML = `
            <div class="chart-label" title="${proj}">${proj}</div>
            <div class="chart-bar-outer">
                <div class="chart-bar-inner" style="width: ${pct}%;"></div>
            </div>
            <div class="chart-count">${count}</div>
        `;
        projectChartContainer.appendChild(row);
    });

    // 2. Group VMs by Metadata - "environment" (default fallback to 'owner' or other tag if not environment)
    const envMap = {};
    appData.servers.forEach(vm => {
        let envVal = t.unassigned;
        if (vm.metadata) {
            // Check for common metadata keys: environment, env, tier, owner
            envVal = vm.metadata.environment || vm.metadata.env || vm.metadata.owner || t.unassigned;
        }
        envMap[envVal] = (envMap[envVal] || 0) + 1;
    });

    const sortedEnvs = Object.entries(envMap).sort((a, b) => b[1] - a[1]);
    const maxEnvCount = Math.max(...Object.values(envMap));

    sortedEnvs.forEach(([env, count]) => {
        const pct = maxEnvCount > 0 ? Math.round((count / maxEnvCount) * 100) : 0;
        const row = document.createElement("div");
        row.className = "chart-row";
        row.innerHTML = `
            <div class="chart-label" style="text-transform: capitalize;" title="${env}">${env}</div>
            <div class="chart-bar-outer">
                <div class="chart-bar-inner" style="width: ${pct}%; background: linear-gradient(90deg, #10b981, #3b82f6);"></div>
            </div>
            <div class="chart-count">${count}</div>
        `;
        metadataChartContainer.appendChild(row);
    });
}

// Navigation Tabs switching controller
document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        
        btn.classList.add("active");
        const tabId = btn.getAttribute("data-tab");
        document.getElementById(tabId).classList.add("active");
    });
});

// Helper for RC Upload
async function handleRcUpload(file) {
    const t = translations[currentLang];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch("/api/upload-rc", {
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            if (result.status === "success") {
                selectedAggregateFilters = null;
                const dataLoaded = await fetchData();
                if (dataLoaded) {
                    showToast(result.message, "success");
                    unlockDashboard();
                }
            } else {
                showToast(result.message, "warning");
            }
        } else {
            showToast(result.detail || t.toastErrorUpload, "error");
        }
    } catch (err) {
        showToast("Error: " + err.message, "error");
    }
}

// Header File Upload Event
fileInput.addEventListener("change", async (e) => {
    await handleRcUpload(e.target.files[0]);
});

// Modal File Upload Event (Option A)
const modalFileInput = document.getElementById("modal-file-input");
if (modalFileInput) {
    modalFileInput.addEventListener("change", async (e) => {
        await handleRcUpload(e.target.files[0]);
    });
}

// Modal Password Form Submit (Option B)
const authPassForm = document.getElementById("auth-pass-form");
if (authPassForm) {
    authPassForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const t = translations[currentLang];
        const usernameInput = document.getElementById("modal-input-username");
        const passwordInput = document.getElementById("modal-input-password");
        const username = usernameInput ? usernameInput.value.trim() : "";
        const password = passwordInput.value;

        if (!username || !password) {
            showToast("Username and password are required", "warning");
            return;
        }

        setLoginLoading(true);
        try {
            const response = await fetch("/api/login-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: username, password: password })
            });

            const result = await response.json();
            if (response.ok) {
                selectedAggregateFilters = null;
                const dataLoaded = await fetchData();
                if (dataLoaded) {
                    showToast(result.message, "success");
                    passwordInput.value = "";
                    unlockDashboard();
                }
            } else {
                showToast(result.detail || "Error al autenticar", "error");
            }
        } catch (err) {
            showToast("Error: " + err.message, "error");
        } finally {
            setLoginLoading(false);
        }
    });
}

// End the server-side session and return to the authentication screen.
btnLogout.addEventListener("click", async () => {
    btnLogout.disabled = true;
    try {
        const response = await fetch("/api/logout", { method: "POST" });
        if (!response.ok) throw new Error("Logout failed");
        lockDashboard();
        selectedAggregateFilters = null;
        await fetchData();
        document.getElementById("modal-input-username").value = "";
        document.getElementById("modal-input-password").value = "";
        showToast(translations[currentLang].toastLogout, "success");
    } catch (err) {
        showToast(translations[currentLang].toastErrorConn + err.message, "error");
    } finally {
        btnLogout.disabled = false;
    }
});

// Selectors Event Listeners
langSelect.value = currentLang;
langSelect.addEventListener("change", (e) => {
    currentLang = e.target.value;
    localStorage.setItem("os-op-lang", currentLang);
    applyTranslations();
    calculateAndRenderStats();
    renderNodesView();
    renderSearchView();
    renderMetadataView();
});

themeSelect.value = currentTheme;
themeSelect.addEventListener("change", (e) => {
    currentTheme = e.target.value;
    localStorage.setItem("os-op-theme", currentTheme);
    applyTheme();
});

// Real-time Search event listeners
searchBar.addEventListener("input", (e) => {
    currentFilterQuery = e.target.value;
    renderSearchView();
});

filterStatus.addEventListener("change", (e) => {
    currentStatusFilter = e.target.value;
    renderSearchView();
});

// Initial load. Authentication and data loading are deliberately sequential to
// prevent a stale auth-status response from locking the dashboard after login.
async function initializeApp() {
    applyTheme();
    applyTranslations();
    const isAuthenticated = await checkAuthStatus();
    const dataLoaded = await fetchData();
    if (isAuthenticated && dataLoaded) unlockDashboard();
}

initializeApp();
// Auto refresh every 30 seconds
setInterval(fetchData, 30000);
