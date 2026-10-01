from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from py3dbp import Packer, Bin, Item
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(title="Dispacch Multi-Fleet & Shared Pool Optimizer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ItemDims(BaseModel):
    id: Optional[str] = None
    name: str
    width: float
    height: float
    depth: float
    weight: float

class AutoRecommendRequest(BaseModel):
    items: List[ItemDims]
    distance_km: Optional[float] = 25.0

class SharedPoolRequest(BaseModel):
    items: List[ItemDims]
    pickup_city: Optional[str] = "Central Warehouse"
    drop_city: Optional[str] = "Regional Hub"
    distance_km: Optional[float] = 35.0

FLEET_CATALOG = [
    {
        "id": "tata-ace",
        "type": "Mini Truck (Tata Ace)",
        "width": 150.0, "height": 140.0, "depth": 210.0, "max_weight": 750.0,
        "base_fare": 450.0, "per_km_rate": 22.0,
        "specs": {"body": "Open Bed / Tarpaulin", "axles": "Single Axle (4 Wheeler)", "fuel": "Diesel / CNG"}
    },
    {
        "id": "bolero-pickup",
        "type": "Pickup Truck (Bolero Maxi)",
        "width": 170.0, "height": 160.0, "depth": 250.0, "max_weight": 1250.0,
        "base_fare": 700.0, "per_km_rate": 28.0,
        "specs": {"body": "High-Deck Utility", "axles": "Single Axle (4 Wheeler)", "fuel": "Diesel"}
    },
    {
        "id": "canter-14ft",
        "type": "14ft Commercial Canter",
        "width": 200.0, "height": 210.0, "depth": 420.0, "max_weight": 4000.0,
        "base_fare": 1400.0, "per_km_rate": 42.0,
        "specs": {"body": "Closed Container", "axles": "Twin Axle (6 Wheeler)", "fuel": "Diesel BS6"}
    },
    {
        "id": "truck-20ft",
        "type": "20ft Medium Heavy Truck",
        "width": 240.0, "height": 240.0, "depth": 600.0, "max_weight": 9000.0,
        "base_fare": 2500.0, "per_km_rate": 60.0,
        "specs": {"body": "Hardtop Container", "axles": "Multi-Axle (6 Wheeler)", "fuel": "Diesel Turbo"}
    },
    {
        "id": "container-32ft",
        "type": "32ft Heavy Multi-Axle",
        "width": 245.0, "height": 270.0, "depth": 975.0, "max_weight": 18000.0,
        "base_fare": 4800.0, "per_km_rate": 85.0,
        "specs": {"body": "High-Cube Container", "axles": "Multi-Axle Semi-Trailer (10W)", "fuel": "Commercial Diesel"}
    }
]

ACTIVE_SHARED_ROUTES = [
    {
        "pool_id": "POOL-DL-JPR-104",
        "route": "Delhi NCR → Jaipur Highway (NH48)",
        "truck_type": "14ft Commercial Canter",
        "container_dims": {"width": 200.0, "height": 210.0, "depth": 420.0, "max_weight": 4000.0},
        "carrier": "ExpressLink Co-Loaders",
        "departure_time": "Today, 08:30 PM",
        "available_volume_pct": 52.0,
        "available_weight_kg": 2100.0,
        "base_sharing_rate_per_kg": 4.5,
        "base_volume_rate_per_m3": 850.0,
        "existing_items": [
            {"name": "Co-Shipper: Garment Bales", "position": [0, 0, 0], "dimension": [180, 100, 180]},
            {"name": "Co-Shipper: Auto Parts", "position": [0, 0, 180], "dimension": [90, 80, 120]}
        ]
    },
    {
        "pool_id": "POOL-MUM-PUN-209",
        "route": "Mumbai → Pune Expressway Corridor",
        "truck_type": "20ft Medium Heavy Truck",
        "container_dims": {"width": 240.0, "height": 240.0, "depth": 600.0, "max_weight": 9000.0},
        "carrier": "InterState Relay Logistics",
        "departure_time": "Tomorrow, 06:00 AM",
        "available_volume_pct": 68.0,
        "available_weight_kg": 4800.0,
        "base_sharing_rate_per_kg": 5.2,
        "base_volume_rate_per_m3": 950.0,
        "existing_items": [
            {"name": "Co-Shipper: Hardware Crates", "position": [0, 0, 0], "dimension": [220, 110, 200]}
        ]
    }
]

def item_fits_truck(it: ItemDims, v: dict) -> bool:
    v_dims = sorted([v["width"], v["height"], v["depth"]])
    i_dims = sorted([it.width, it.height, it.depth])
    return all(i_dims[k] <= v_dims[k] for k in range(3)) and (it.weight <= v["max_weight"])

@app.get("/")
def root():
    return {"status": "ok", "service": "Dispacch Multi-Fleet Engine"}

@app.post("/optimize/recommend-vehicle")
def recommend_vehicle(payload: AutoRecommendRequest):
    try:
        if not payload.items:
            return {"success": False, "message": "No cargo items provided."}

        dist = float(payload.distance_km if payload.distance_km is not None else 25.0)
        largest_vehicle = FLEET_CATALOG[-1]

        oversized = [
            f"{it.name} ({int(it.width)}×{int(it.height)}×{int(it.depth)}cm)"
            for it in payload.items
            if not item_fits_truck(it, largest_vehicle)
        ]
        if oversized:
            return {
                "success": False,
                "message": f"These items exceed physical dimensions of all fleet trucks: {', '.join(oversized)}."
            }

        remaining_pool = []
        for idx, it in enumerate(payload.items):
            remaining_pool.append({
                "uid": f"{idx}_{it.name}",
                "name": it.name,
                "width": float(it.width),
                "height": float(it.height),
                "depth": float(it.depth),
                "weight": float(it.weight)
            })

        dispatched_fleet = []
        max_loops = 20

        while remaining_pool and max_loops > 0:
            max_loops -= 1
            best_tier = None

            for v in FLEET_CATALOG:
                packer = Packer()
                b = Bin(v["type"], v["width"], v["height"], v["depth"], v["max_weight"])
                packer.add_bin(b)

                for item_dict in remaining_pool:
                    packer.add_item(Item(
                        item_dict["uid"],
                        item_dict["width"],
                        item_dict["height"],
                        item_dict["depth"],
                        item_dict["weight"]
                    ))

                packer.pack()
                packed_bin = packer.bins[0]

                if len(packed_bin.items) > 0:
                    current_candidate = {
                        "vehicle": v,
                        "packed": packed_bin.items,
                        "unfitted": packed_bin.unfitted_items,
                        "count": len(packed_bin.items)
                    }

                    if len(packed_bin.unfitted_items) == 0:
                        best_tier = current_candidate
                        break

                    if best_tier is None or current_candidate["count"] > best_tier["count"]:
                        best_tier = current_candidate

            if not best_tier or best_tier["count"] == 0:
                break

            chosen_v = best_tier["vehicle"]
            packed_boxes_3d = []
            packed_uids = set()

            for item in best_tier["packed"]:
                packed_uids.add(item.name)
                orig_label = item.name.split("_", 1)[-1] if "_" in item.name else item.name

                dim = [float(item.width), float(item.height), float(item.depth)]
                if hasattr(item, "get_dimension"):
                    d = item.get_dimension()
                    dim = [float(d[0]), float(d[1]), float(d[2])]
                elif hasattr(item, "getDimension"):
                    d = item.getDimension()
                    dim = [float(d[0]), float(d[1]), float(d[2])]

                packed_boxes_3d.append({
                    "name": orig_label,
                    "position": [float(item.position[0]), float(item.position[1]), float(item.position[2])],
                    "dimension": dim
                })

            used_vol = sum(d["dimension"][0] * d["dimension"][1] * d["dimension"][2] for d in packed_boxes_3d)
            tot_vol = chosen_v["width"] * chosen_v["height"] * chosen_v["depth"]
            util_pct = round((used_vol / tot_vol) * 100, 1)

            total_wt = float(sum(it.weight for it in best_tier["packed"]))
            trip_cost = round(chosen_v["base_fare"] + (dist * chosen_v["per_km_rate"]))

            dispatched_fleet.append({
                "truck_index": len(dispatched_fleet) + 1,
                "vehicle": chosen_v,
                "packed_items": packed_boxes_3d,
                "item_count": len(packed_boxes_3d),
                "utilization_pct": util_pct,
                "total_weight": total_wt,
                "est_cost": trip_cost
            })

            remaining_pool = [it for it in remaining_pool if it["uid"] not in packed_uids]

        total_cost = sum(t["est_cost"] for t in dispatched_fleet)

        carrier_quotes = [
            {"provider": "FastLogix Express Fleet", "rating": 4.8, "eta_mins": 18, "price": round(total_cost * 0.95)},
            {"provider": "Urban Haul Dedicated", "rating": 4.6, "eta_mins": 25, "price": round(total_cost)},
            {"provider": "DirectMove Cargo Enterprise", "rating": 4.9, "eta_mins": 35, "price": round(total_cost * 1.08)},
        ]

        return {
            "success": True,
            "total_vehicles_needed": len(dispatched_fleet),
            "fleet": dispatched_fleet,
            "total_fleet_cost": total_cost,
            "total_items_packed": sum(t["item_count"] for t in dispatched_fleet),
            "carrier_quotes": carrier_quotes
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize/find-shared-pools")
def find_shared_pools(payload: SharedPoolRequest):
    if not payload.items:
        return {"success": False, "message": "No cargo items provided."}

    user_total_wt = sum(it.weight for it in payload.items)
    user_vol_m3 = sum((it.width * it.height * it.depth) / 1e6 for it in payload.items)

    matched_pools = []
    for route in ACTIVE_SHARED_ROUTES:
        c_dims = route["container_dims"]
        tot_vol_m3 = (c_dims["width"] * c_dims["height"] * c_dims["depth"]) / 1e6
        needed_vol_pct = round((user_vol_m3 / tot_vol_m3) * 100, 1)

        if user_total_wt > route["available_weight_kg"] or needed_vol_pct > route["available_volume_pct"]:
            continue

        packer = Packer()
        truck_bin = Bin(
            route["truck_type"],
            float(c_dims["width"]),
            float(c_dims["height"]),
            float(c_dims["depth"]),
            float(c_dims["max_weight"])
        )
        packer.add_bin(truck_bin)

        for ex in route["existing_items"]:
            packer.add_item(Item(
                f"COMMUNITY_{ex['name']}",
                float(ex["dimension"][0]),
                float(ex["dimension"][1]),
                float(ex["dimension"][2]),
                100.0
            ))

        for u_it in payload.items:
            packer.add_item(Item(
                f"USER_{u_it.name}",
                float(u_it.width),
                float(u_it.height),
                float(u_it.depth),
                float(u_it.weight)
            ))

        packer.pack()
        packed_bin = packer.bins[0]

        unfitted_user_items = [it.name for it in packed_bin.unfitted_items if it.name.startswith("USER_")]
        if len(unfitted_user_items) > 0:
            continue

        weight_cost = user_total_wt * route["base_sharing_rate_per_kg"]
        volume_cost = user_vol_m3 * route["base_volume_rate_per_m3"]
        distance_cost = (payload.distance_km or 35.0) * 12.0
        shared_price = round(max(weight_cost, volume_cost) + distance_cost)

        simulated_packed = []
        for it in packed_bin.items:
            is_user = it.name.startswith("USER_")
            clean_name = it.name.replace("USER_", "Your Cargo: ").replace("COMMUNITY_", "")

            dim = [float(it.width), float(it.height), float(it.depth)]
            if hasattr(it, "get_dimension"):
                d = it.get_dimension()
                dim = [float(d[0]), float(d[1]), float(d[2])]

            simulated_packed.append({
                "name": clean_name,
                "position": [float(it.position[0]), float(it.position[1]), float(it.position[2])],
                "dimension": dim,
                "is_user": is_user
            })

        matched_pools.append({
            "pool_id": route["pool_id"],
            "carrier": route["carrier"],
            "route": route["route"],
            "truck_type": route["truck_type"],
            "departure_time": route["departure_time"],
            "container_dims": c_dims,
            "spare_capacity_remaining": round(route["available_volume_pct"] - needed_vol_pct, 1),
            "your_share_pct": needed_vol_pct,
            "total_shared_price": shared_price,
            "savings_vs_charter": "Up to 68%",
            "packed_3d": simulated_packed
        })

    if not matched_pools:
        return {
            "success": False,
            "message": "These items could not physically fit into current community routes along this corridor without exceeding clearance. Consider switching to Dedicated Fleet."
        }

    return {
        "success": True,
        "user_weight": user_total_wt,
        "user_volume_m3": round(user_vol_m3, 3),
        "matches_count": len(matched_pools),
        "pools": matched_pools
    }