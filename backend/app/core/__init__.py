"""
Core layer for The Cheater's Dilemma.
Contains cross-cutting concerns and application infrastructure.
"""

# Import main core components (avoiding config to prevent pydantic dependency)
from .events import DomainEvent, ActionExecutedEvent, AgentDiedEvent
from .governance import GovernanceSystem
from .logger import EventLogger
from .reputation import ReputationBook
from .rules import RuleSet

__all__ = [
    "DomainEvent",
    "ActionExecutedEvent",
    "AgentDiedEvent",
    "GovernanceSystem",
    "EventLogger",
    "ReputationBook",
    "RuleSet",
]