MARKDOWN# Dispacch

Dispacch is an intelligent logistics and freight-pooling monorepo designed to optimize freight capacity, cargo route consolidation, and container utilization. It matches shipments into community-shared corridors with 3D bin packing simulations and dynamic cost sharing.

---

## Architecture Overview

The repository is structured as a monorepo containing three core applications:

```text
dispacch/
├── apps/
│   ├── engine-py/          # Python spatial optimization & route pooling engine (FastAPI)
│   ├── api/                # Backend API gateway & business logic (Node.js / Express)
│   └── web/                # User dashboard & load visualization UI (Next.js / TypeScript)
├── package.json            # Monorepo root scripts & workspace config
└── requirements.txt        # Shared Python dependencies

```

### Components

* **`apps/engine-py`**: Core mathematical optimization engine. Computes volumetric cargo fits, 3D simulation packed metrics, and route compatibility based on truck types, departure windows, and container dimensions.
* **`apps/api`**: REST API orchestration layer managing bookings, pool state coordination, authentication, and communication with the Python solver.
* **`apps/web`**: Responsive frontend web application built with Next.js, featuring an interactive optimizer dashboard, container visualization, and pool matching interface.

---

## Core Engine Capabilities

* **Shared Pool Discovery (`find_shared_pools`)**: Matches freight payloads against scheduled routes along transit corridors.
* **Spare Capacity Calculation**: Dynamically computes volume and weight utilization to minimize deadhead space.
* **Cost Sharing Logic**: Calculates per-user pricing based on consumed load percentage (`your_share_pct`) with discounts up to 68% compared to single-charter options.
* **3D Bin-Packing Simulation**: Simulates container packing configurations across common freight truck dimensions.

---

## Local Development Setup

### Prerequisites

* **Node.js** (v18+) and **pnpm** / **npm**
* **Python** 3.11+
* **Git**

### Installation

1. **Clone the repository:**
```bash
git clone git@github.com:vanshikasraw511/dispacch.git
cd dispacch

```


2. **Set up the Python Optimization Engine:**
```bash
cd apps/engine-py
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

```


3. **Install JavaScript dependencies:**
```bash
cd ../..
pnpm install
# or: npm install

```



### Running Locally

* **Run Optimization Engine:**
```bash
cd apps/engine-py
source venv/bin/activate
uvicorn main:app --reload --port 8000

```


* **Run Node API Gateway:**
```bash
cd apps/api
pnpm dev

```


* **Run Next.js Web Client:**
```bash
cd apps/web
pnpm dev

```



---

## Deployment (Render)

### Engine Service (`dispacch-engine`)

* **Environment**: Python
* **Root Directory**: `apps/engine-py`
* **Build Command**: `pip install -r requirements.txt`
* **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### API Service (`dispacch-api`)

* **Environment**: Node
* **Root Directory**: `apps/api`
* **Build Command**: `pnpm install && pnpm build`
* **Start Command**: `pnpm start`

### Web Service (`dispacch-web`)

* **Environment**: Static Site / Web Service (Next.js)
* **Root Directory**: `apps/web`
* **Build Command**: `pnpm install && pnpm build`
* **Start Command**: `pnpm start`

---

## License

ISC
