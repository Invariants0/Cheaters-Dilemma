from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class ActionType(str, Enum):
    WORK = "WORK"
    STEAL = "STEAL"
    ATTACK = "ATTACK"
    PROPOSE_RULE = "PROPOSE_RULE"
    VOTE_RULE = "VOTE_RULE"
    DO_NOTHING = "DO_NOTHING"
    # New actions
    FORM_ALLIANCE = "FORM_ALLIANCE"
    BREAK_ALLIANCE = "BREAK_ALLIANCE"
    TRADE = "TRADE"
    MOVE = "MOVE"
    REST = "REST"
    COALITION_ATTACK = "COALITION_ATTACK"


@dataclass(frozen=True)
class Action:
    actor: int
    kind: ActionType
    target: int | None = None
    payload: dict[str, Any] = field(default_factory=dict)
