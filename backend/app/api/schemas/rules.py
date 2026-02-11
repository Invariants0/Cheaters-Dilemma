from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class Ruleset(BaseModel):
    version: int
    rules: Dict[str, Any]


class RuleHistory(BaseModel):
    turn: int
    version: int
    change_type: str  # "initial", "proposal_passed", etc.
    changed_by: Optional[int]
    key: Optional[str]
    old_value: Optional[Any]
    new_value: Optional[Any]
    description: str