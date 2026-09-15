import os
import re
import requests
import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any

import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

app = FastAPI(title="espsrc-os-op")

# Global session dictionary (in-memory for simple single-user container deployment)
session_config: Dict[str, Any] = {
    "auth_url": "https://spsrc-openstack.iaa.csic.es:5000",
    "username": None,
    "password": None,
    "project_name": "spsrc",
    "user_domain_name": "Default",
    "project_domain_name": "Default",
    "token": None,
    "nova_url": None,
    "authenticated": False,
    "use_mock": True # Default to mock until user authenticates or uploads RC
}

# Mock data generator for rich demonstration
def generate_mock_data():
    hypervisors = [
        {
            "hypervisor_hostname": "compute-node-01.infra.local",
            "vcpus": 64,
            "vcpus_used": 42,
            "memory_mb": 262144, # 256 GB
            "memory_mb_used": 180224, # 176 GB
            "local_gb": 4096, # 4 TB
            "local_gb_used": 1536, # 1.5 TB
            "running_vms": 14,
            "state": "up",
            "status": "enabled",
            "host_aggregates": [{"name": "compute", "availability_zone": "nova", "metadata": {"type": "compute"}}],
            "id": 1
        },
        {
            "hypervisor_hostname": "compute-node-02.infra.local",
            "vcpus": 64,
            "vcpus_used": 56,
            "memory_mb": 262144,
            "memory_mb_used": 229376, # 224 GB
            "local_gb": 4096,
            "local_gb_used": 2867,
            "running_vms": 18,
            "state": "up",
            "status": "enabled",
            "host_aggregates": [{"name": "compute", "availability_zone": "nova", "metadata": {"type": "compute"}}],
            "id": 2
        },
        {
            "hypervisor_hostname": "compute-node-03.infra.local",
            "vcpus": 96,
            "vcpus_used": 32,
            "memory_mb": 393216, # 384 GB
            "memory_mb_used": 131072, # 128 GB
            "local_gb": 8192, # 8 TB
            "local_gb_used": 4096, # 4 TB
            "running_vms": 8,
            "state": "up",
            "status": "enabled",
            "host_aggregates": [{"name": "high-memory", "availability_zone": "nova", "metadata": {"type": "high-memory"}}],
            "id": 3
        },
        {
            "hypervisor_hostname": "compute-node-04.infra.local",
            "vcpus": 32,
            "vcpus_used": 30,
            "memory_mb": 131072, # 128 GB
            "memory_mb_used": 122880, # 120 GB
            "local_gb": 2048, # 2 TB
            "local_gb_used": 1843,
            "running_vms": 11,
            "state": "down",
            "status": "disabled",
            "host_aggregates": [{"name": "maintenance", "availability_zone": "nova", "metadata": {"type": "maintenance"}}],
            "id": 4
        }
    ]

    flavors = [
        {"id": "m1.tiny", "name": "m1.tiny", "vcpus": 1, "ram": 512},
        {"id": "m1.small", "name": "m1.small", "vcpus": 1, "ram": 2048},
        {"id": "m1.medium", "name": "m1.medium", "vcpus": 2, "ram": 4096},
        {"id": "m1.large", "name": "m1.large", "vcpus": 4, "ram": 8192},
        {"id": "m1.xlarge", "name": "m1.xlarge", "vcpus": 8, "ram": 16384},
        {"id": "c1.medium", "name": "c1.medium", "vcpus": 4, "ram": 4096},
        {"id": "g1.large", "name": "g1.large", "vcpus": 8, "ram": 32768}
    ]

    # Generate servers distributed among hypervisors
    servers = []
    vm_names = [
        "web-server-prod-01", "web-server-prod-02", "db-primary-prod", "db-replica-01",
        "cache-redis-01", "api-gateway-01", "k8s-master-01", "k8s-worker-01",
        "k8s-worker-02", "jenkins-ci-master", "monitoring-prometheus", "elk-logstash-01",
        "test-runner-01", "dev-sandbox-user1", "auth-service-prod", "billing-worker-01"
    ]

    projects = [
        {"id": "proj-production", "name": "Production Tier"},
        {"id": "proj-kubernetes", "name": "Kubernetes Core"},
        {"id": "proj-shared-infra", "name": "Shared Infrastructure"},
        {"id": "proj-development", "name": "Development Sandbox"}
    ]

    metadata_options = [
        {"environment": "production", "owner": "operations", "backup": "daily"},
        {"environment": "production", "owner": "devops", "backup": "daily"},
        {"environment": "staging", "owner": "qa", "backup": "none"},
        {"environment": "development", "owner": "developers", "backup": "none"}
    ]

    for idx, name in enumerate(vm_names):
        hypervisor = hypervisors[idx % len(hypervisors)]
        flavor = flavors[idx % len(flavors)]
        project = projects[idx % len(projects)]
        meta = metadata_options[idx % len(metadata_options)]
        
        status_val = "ACTIVE"
        if idx == 5:
            status_val = "SHUTOFF"
        elif idx == 9:
            status_val = "ERROR"

        servers.append({
            "id": f"uuid-vm-000{idx}",
            "name": name,
            "status": status_val,
            "tenant_id": project["id"],
            "project_name": project["name"],
            "flavor": {"id": flavor["id"], "name": flavor["name"], "vcpus": flavor["vcpus"], "ram": flavor["ram"]},
            "OS-EXT-SRV-ATTR:hypervisor_hostname": hypervisor["hypervisor_hostname"],
            "metadata": meta,
            "addresses": {
                "public": [{"addr": f"10.200.1.{100 + idx}", "type": "fixed"}]
            }
        })

    return {
        "hypervisors": hypervisors,
        "servers": servers,
        "flavors": flavors,
        "mode": "Mock Data Mode (No RC Uploaded or Connection Failed)"
    }

def parse_rc_file(content: str) -> Dict[str, str]:
    config = {}
    lines = content.splitlines()
    for line in lines:
        line = line.strip()
        # Skip comments or empty lines
        if not line or line.startswith("#"):
            continue
        # Support export OS_VAR="val" or OS_VAR=val or export OS_VAR='val'
        match = re.match(r'^(?:export\s+)?(OS_[A-Z0-9_]+)\s*=\s*["\'\s]?(.*?)["\'\s]?$', line)
        if match:
            key, val = match.groups()
            # Clean up trailing/leading quotes or whitespace
            val = val.strip().strip("'").strip('"')
            config[key] = val
    return config

def get_openstack_token(config: Dict[str, Any]):
    auth_url = config.get("auth_url")
    if not auth_url:
        raise ValueError("Missing OS_AUTH_URL")
    
    # Ensure auth_url points to v3
    if not auth_url.endswith("/v3") and not auth_url.endswith("/v3/"):
        auth_url = auth_url.rstrip("/") + "/v3"
        
    auth_data = {
        "auth": {
            "identity": {
                "methods": ["password"],
                "password": {
                    "user": {
                        "name": config.get("username"),
                        "domain": {"name": config.get("user_domain_name", "Default")},
                        "password": config.get("password")
                    }
                }
            },
            "scope": {
                "project": {
                    "name": config.get("project_name"),
                    "domain": {"name": config.get("project_domain_name", "Default")}
                }
            }
        }
    }
    
    headers = {"Content-Type": "application/json"}
    response = requests.post(f"{auth_url}/auth/tokens", json=auth_data, headers=headers, timeout=10, verify=False)
    response.raise_for_status()
    
    token = response.headers.get("X-Subject-Token")
    
    # Find Nova public URL in catalog
    catalog = response.json().get("token", {}).get("catalog", [])
    nova_url = None
    for service in catalog:
        if service.get("type") == "compute":
            for endpoint in service.get("endpoints", []):
                if endpoint.get("interface") == "public":
                    nova_url = endpoint.get("url")
                    break
            if nova_url:
                break
                
    if not nova_url:
        raise ValueError("Nova service not found in OpenStack catalog")
        
    return token, nova_url

class PasswordLoginRequest(BaseModel):
    username: str
    password: str
    auth_url: Optional[str] = None
    project_name: Optional[str] = None

@app.get("/api/auth-status")
def get_auth_status():
    return {
        "authenticated": session_config.get("authenticated", False),
        "username": session_config.get("username"),
        "project_name": session_config.get("project_name", "spsrc"),
        "auth_url": session_config.get("auth_url", "https://spsrc-openstack.iaa.csic.es:5000"),
        "use_mock": session_config.get("use_mock", True)
    }

@app.post("/api/login-password")
def login_password(req: PasswordLoginRequest):
    if not req.username or not req.username.strip():
        raise HTTPException(status_code=400, detail="Username is required")
    if not req.password:
        raise HTTPException(status_code=400, detail="Password is required")

    session_config["username"] = req.username.strip()
    if req.auth_url:
        session_config["auth_url"] = req.auth_url
    if req.project_name:
        session_config["project_name"] = req.project_name
    session_config["password"] = req.password
    
    try:
        token, nova_url = get_openstack_token(session_config)
        session_config["token"] = token
        session_config["nova_url"] = nova_url
        session_config["authenticated"] = True
        session_config["use_mock"] = False
        return {
            "status": "success",
            "message": f"Autenticado correctamente en {session_config['project_name']} como {session_config['username']}."
        }
    except Exception as e:
        session_config["authenticated"] = False
        session_config["use_mock"] = True
        raise HTTPException(
            status_code=400,
            detail=f"Error al autenticar en OpenStack: {str(e)}"
        )

@app.post("/api/logout")
def logout():
    session_config.update({
        "auth_url": "https://spsrc-openstack.iaa.csic.es:5000",
        "username": None,
        "password": None,
        "project_name": "spsrc",
        "user_domain_name": "Default",
        "project_domain_name": "Default",
        "token": None,
        "nova_url": None,
        "authenticated": False,
        "use_mock": True
    })
    return {"status": "success"}

@app.post("/api/upload-rc")
async def upload_rc(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        decoded = contents.decode("utf-8")
        parsed = parse_rc_file(decoded)
        
        # Check mandatory variables
        required = ["OS_AUTH_URL", "OS_USERNAME", "OS_PASSWORD", "OS_PROJECT_NAME"]
        missing = [r for r in required if r not in parsed]
        if missing:
            raise HTTPException(
                status_code=400,
                detail=f"Faltan variables obligatorias en el archivo RC: {', '.join(missing)}"
            )
            
        session_config["auth_url"] = parsed["OS_AUTH_URL"]
        session_config["username"] = parsed["OS_USERNAME"]
        session_config["password"] = parsed["OS_PASSWORD"]
        session_config["project_name"] = parsed["OS_PROJECT_NAME"]
        session_config["user_domain_name"] = parsed.get("OS_USER_DOMAIN_NAME", "Default")
        session_config["project_domain_name"] = parsed.get("OS_PROJECT_DOMAIN_NAME", "Default")
        
        # Try to authenticate immediately to validate credentials
        try:
            token, nova_url = get_openstack_token(session_config)
            session_config["token"] = token
            session_config["nova_url"] = nova_url
            session_config["authenticated"] = True
            session_config["use_mock"] = False
        except Exception as e:
            # Revert to mock but inform user
            session_config["authenticated"] = False
            session_config["use_mock"] = True
            return JSONResponse(
                status_code=400,
                content={
                    "status": "error",
                    "detail": f"Archivo RC cargado, pero la conexión falló. Error: {str(e)}"
                }
            )
            
        return {
            "status": "success",
            "message": f"Autenticado correctamente en {session_config['project_name']} como {session_config['username']}."
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error leyendo el archivo: {str(e)}")

@app.get("/api/data")
def get_data():
    if session_config["use_mock"]:
        return generate_mock_data()
        
    try:
        # Re-authenticate if we don't have token or url
        if not session_config.get("token") or not session_config.get("nova_url"):
            token, nova_url = get_openstack_token(session_config)
            session_config["token"] = token
            session_config["nova_url"] = nova_url
            
        headers = {
            "X-Auth-Token": session_config["token"],
            "Content-Type": "application/json"
        }
        
        # Fetch hypervisors
        hv_res = requests.get(f"{session_config['nova_url']}/os-hypervisors/detail", headers=headers, timeout=10, verify=False)
        hv_res.raise_for_status()
        hypervisors_raw = hv_res.json().get("hypervisors", [])

        # Fetch host aggregates and associate them with their hypervisors.
        aggregates_res = requests.get(f"{session_config['nova_url']}/os-aggregates", headers=headers, timeout=10, verify=False)
        aggregates_res.raise_for_status()
        aggregates_raw = aggregates_res.json().get("aggregates", [])

        def aggregates_for_host(hostname):
            short_hostname = (hostname or "").split(".")[0]
            matches = []
            for aggregate in aggregates_raw:
                aggregate_hosts = aggregate.get("hosts", [])
                if any(host == hostname or host.split(".")[0] == short_hostname for host in aggregate_hosts):
                    matches.append({
                        "name": aggregate.get("name", "unknown"),
                        "availability_zone": aggregate.get("availability_zone"),
                        "metadata": aggregate.get("metadata", {})
                    })
            return matches
        
        # Map hypervisor fields to standard format
        hypervisors = []
        for h in hypervisors_raw:
            hypervisors.append({
                "hypervisor_hostname": h.get("hypervisor_hostname"),
                "vcpus": h.get("vcpus", 0),
                "vcpus_used": h.get("vcpus_used", 0),
                "memory_mb": h.get("memory_mb", 0),
                "memory_mb_used": h.get("memory_mb_used", 0),
                "local_gb": h.get("local_gb", 0),
                "local_gb_used": h.get("local_gb_used", 0),
                "running_vms": h.get("running_vms", 0),
                "state": h.get("state", "up"),
                "status": h.get("status", "enabled"),
                "host_aggregates": aggregates_for_host(h.get("hypervisor_hostname")),
                "id": h.get("id")
            })
            
        # Fetch servers
        srv_res = requests.get(f"{session_config['nova_url']}/servers/detail?all_tenants=1", headers=headers, timeout=10, verify=False)
        srv_res.raise_for_status()
        servers_raw = srv_res.json().get("servers", [])
        
        # Fetch flavors to map names and configurations
        fl_res = requests.get(f"{session_config['nova_url']}/flavors/detail", headers=headers, timeout=10, verify=False)
        fl_res.raise_for_status()
        flavors = fl_res.json().get("flavors", [])
        
        # Build lookup table for flavors
        flavor_lookup = {f["id"]: f for f in flavors}
        
        # Clean servers data
        servers = []
        for s in servers_raw:
            f_info = s.get("flavor", {})
            f_id = f_info.get("id")
            fl_name = "unknown"
            vcpus = 0
            ram = 0
            if f_id in flavor_lookup:
                fl_name = flavor_lookup[f_id].get("name", "unknown")
                vcpus = flavor_lookup[f_id].get("vcpus", 0)
                ram = flavor_lookup[f_id].get("ram", 0)
            elif "original_name" in f_info:
                fl_name = f_info.get("original_name")
                
            servers.append({
                "id": s.get("id"),
                "name": s.get("name"),
                "status": s.get("status"),
                "tenant_id": s.get("tenant_id"),
                "project_name": s.get("tenant_id"), # Will show tenant_id since mapping projects requires Keystone API list
                "flavor": {"id": f_id, "name": fl_name, "vcpus": vcpus, "ram": ram},
                "OS-EXT-SRV-ATTR:hypervisor_hostname": s.get("OS-EXT-SRV-ATTR:hypervisor_hostname"),
                "metadata": s.get("metadata", {}),
                "addresses": s.get("addresses", {})
            })
            
        return {
            "hypervisors": hypervisors,
            "servers": servers,
            "flavors": flavors,
            "mode": f"Live OpenStack API Mode ({session_config['project_name']})"
        }
        
    except Exception as e:
        # A token alone is not enough to consider the dashboard connected: the
        # Nova resources must also be readable. Reset the live session and make
        # the failure explicit instead of silently presenting mock information.
        session_config["token"] = None
        session_config["nova_url"] = None
        session_config["authenticated"] = False
        session_config["use_mock"] = True
        raise HTTPException(
            status_code=502,
            detail=f"No se pudieron cargar datos reales de OpenStack: {str(e)}"
        )

# Mount static files
app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
