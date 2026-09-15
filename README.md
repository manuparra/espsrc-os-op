# espSRC OpenStack Operator Dashboard (`espsrc-os-op`)

Intelligent monitoring and real-time visualization dashboard for Virtual Machines (VMs) and Physical Hypervisors across the Spanish SKA Regional Centre (espSRC) OpenStack infrastructure.

---

## Features

1. **Physical Nodes View**: Real-time visualization of each physical hypervisor node, including CPU and RAM memory usage progress bars, running VM counts, states (`up`/`down`), and assigned instances list.
2. **VM Catalog & Real-time Search**: Instant multi-attribute filtering by VM name, status (`ACTIVE`, `SHUTOFF`, `ERROR`), flavor, IP address, physical host, or project/tenant.
3. **Projects & Metadata Analytics**: Graphical breakdown showing VM distribution per tenant/project and key environment metadata tags (e.g., `production`, `development`, `staging`).
4. **Flexible OpenStack Authentication**:
   - **Option A (RC File Upload)**: Drag-and-drop or upload standard OpenStack `openrc.sh` environment files.
   - **Option B (Direct Credentials Login)**: Enter your OpenStack username and password to connect directly to the pre-configured espSRC OpenStack endpoint (`https://spsrc-openstack.iaa.csic.es:5000`, project: `spsrc`).
5. **Expired SSL Certificate Support**: Built-in support for communicating with OpenStack Keystone/Nova API endpoints operating with self-signed or expired SSL certificates.
6. **Dual Mode Execution**: Interactive toggle to switch seamlessly between real-time OpenStack API data and rich simulation (Mock) mode.
7. **Internationalization & Modern Glassmorphic UI**: Includes full bilingual support (English 🇬🇧 & Spanish 🇪🇸), Dark/Light theme switching, and smooth background blur modal authentication.

---

## Configuration & Default Endpoints

The default system configuration connects to the espSRC OpenStack infrastructure:

- **Identity API URL (`OS_AUTH_URL`)**: `https://spsrc-openstack.iaa.csic.es:5000/v3`
- **Default Project (`OS_PROJECT_NAME`)**: `spsrc`
- **Domains (`OS_USER_DOMAIN_NAME`, `OS_PROJECT_DOMAIN_NAME`)**: `Default`

---

## How to Run the Application

### Method 1: Using Docker (Container) — Recommended

1. Build the Docker image:
   ```bash
   docker build -t espsrc-os-op .
   ```
2. Run the container exposing port `8000`:
   ```bash
   docker run -d -p 8000:8000 --name openstack-dashboard espsrc-os-op
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

### Method 2: Locally with Python

1. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Start the FastAPI application with Uvicorn:
   ```bash
   python main.py
   ```
3. Open your browser and navigate to `http://localhost:8000`.

---

## Security Note

All API calls to OpenStack are made server-side via FastAPI (`main.py`) using `verify=False` to allow connections to clusters with expired SSL certificates. No private credentials or passwords are stored permanently on disk.
