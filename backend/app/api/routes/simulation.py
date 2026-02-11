from typing import Any, Dict
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel

from ...services.simulation_service import SimulationService
from ..schemas.simulation import (
    SimulationStartRequest,
    SimulationStepRequest,
    SimulationState,
    SimulationEvents,
    SimulationSummary
)

router = APIRouter()


class SimulationManager:
    """Simple in-memory simulation manager"""
    def __init__(self):
        self.simulations: Dict[str, Dict[str, Any]] = {}

    def create_simulation(self, config: Dict[str, Any]) -> str:
        import uuid
        sim_id = str(uuid.uuid4())
        service = SimulationService()
        result = service.start_simulation(
            agent_count=config["agent_count"],
            seed=config["seed"],
            turns=config.get("turns")
        )
        self.simulations[sim_id] = {
            "service": service,
            "result": result,
            "current_turn": 0,
            "is_running": False
        }
        return sim_id

    def get_simulation(self, sim_id: str) -> Dict[str, Any]:
        if sim_id not in self.simulations:
            raise HTTPException(status_code=404, detail="Simulation not found")
        return self.simulations[sim_id]

    def step_simulation(self, sim_id: str, steps: int = 1) -> Dict[str, Any]:
        sim = self.get_simulation(sim_id)
        if sim["is_running"]:
            raise HTTPException(status_code=400, detail="Simulation is already running")

        # For now, return the full result since we run all turns at once
        return sim["result"]


simulation_manager = SimulationManager()


@router.post("/start", response_model=Dict[str, str])
async def start_simulation(request: SimulationStartRequest) -> Dict[str, str]:
    """Start a new simulation"""
    try:
        sim_id = simulation_manager.create_simulation({
            "agent_count": request.agent_count,
            "seed": request.seed,
            "turns": request.turns
        })
        return {"simulation_id": sim_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to start simulation: {str(e)}")


@router.post("/{simulation_id}/step", response_model=SimulationState)
async def step_simulation(
    simulation_id: str,
    request: SimulationStepRequest
) -> SimulationState:
    """Advance simulation by specified steps"""
    try:
        result = simulation_manager.step_simulation(simulation_id, request.steps)
        return SimulationState(
            simulation_id=simulation_id,
            current_turn=result.get("turns_completed", 0),
            agents=result.get("leaderboard", []),
            rules=result.get("rules_version", 1),
            alive_count=len(result.get("alive", [])),
            event_count=result.get("event_count", 0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to step simulation: {str(e)}")


@router.get("/{simulation_id}/state", response_model=SimulationState)
async def get_simulation_state(simulation_id: str) -> SimulationState:
    """Get current simulation state"""
    try:
        sim = simulation_manager.get_simulation(simulation_id)
        result = sim["result"]
        return SimulationState(
            simulation_id=simulation_id,
            current_turn=result.get("turns_completed", 0),
            agents=result.get("leaderboard", []),
            rules=result.get("rules_version", 1),
            alive_count=len(result.get("alive", [])),
            event_count=result.get("event_count", 0)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get simulation state: {str(e)}")


@router.get("/{simulation_id}/events", response_model=SimulationEvents)
async def get_simulation_events(
    simulation_id: str,
    since_turn: int = 0
) -> SimulationEvents:
    """Get simulation events since specified turn"""
    try:
        sim = simulation_manager.get_simulation(simulation_id)
        result = sim["result"]
        events = result.get("events", [])

        # Filter events since the specified turn
        filtered_events = [e for e in events if e.get("turn", 0) >= since_turn]

        return SimulationEvents(
            simulation_id=simulation_id,
            events=filtered_events,
            total_events=len(filtered_events)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get simulation events: {str(e)}")


@router.get("/{simulation_id}/summary", response_model=SimulationSummary)
async def get_simulation_summary(simulation_id: str) -> SimulationSummary:
    """Get simulation summary and final results"""
    try:
        sim = simulation_manager.get_simulation(simulation_id)
        result = sim["result"]
        return SimulationSummary(
            simulation_id=simulation_id,
            seed=result.get("seed"),
            turns_completed=result.get("turns_completed", 0),
            leaderboard=result.get("leaderboard", []),
            action_counts=result.get("action_counts", {}),
            log_digest=result.get("log_digest", ""),
            rules_version=result.get("rules_version", 1)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get simulation summary: {str(e)}")