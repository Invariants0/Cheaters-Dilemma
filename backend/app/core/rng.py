"""
Deterministic Random Number Generator for The Cheater's Dilemma.
Ensures reproducible simulations.
"""

from __future__ import annotations
import random
from typing import Optional


class DeterministicRNG:
    """Deterministic random number generator using a seed."""

    def __init__(self, seed: Optional[int] = None):
        self.seed = seed or 42
        self.rng = random.Random(self.seed)

    def random(self) -> float:
        """Generate a random float between 0 and 1."""
        return self.rng.random()

    def randint(self, a: int, b: int) -> int:
        """Generate a random integer between a and b (inclusive)."""
        return self.rng.randint(a, b)

    def choice(self, seq):
        """Choose a random element from a sequence."""
        return self.rng.choice(seq)

    def shuffle(self, seq: list) -> None:
        """Shuffle a sequence in place."""
        self.rng.shuffle(seq)

    def gauss(self, mu: float = 0.0, sigma: float = 1.0) -> float:
        """Generate a random number from a Gaussian distribution."""
        return self.rng.gauss(mu, sigma)

    def expovariate(self, lambd: float) -> float:
        """Generate a random number from an exponential distribution."""
        return self.rng.expovariate(lambd)

    def reset(self) -> None:
        """Reset the RNG to its initial state."""
        self.rng = random.Random(self.seed)

    def set_seed(self, seed: int) -> None:
        """Set a new seed and reset the RNG."""
        self.seed = seed
        self.reset()


# Global RNG instance
_rng_instance: Optional[DeterministicRNG] = None


def get_rng(seed: Optional[int] = None) -> DeterministicRNG:
    """Get the global RNG instance."""
    global _rng_instance
    if _rng_instance is None or (seed is not None and seed != _rng_instance.seed):
        _rng_instance = DeterministicRNG(seed)
    return _rng_instance


def reset_rng() -> None:
    """Reset the global RNG instance."""
    global _rng_instance
    if _rng_instance:
        _rng_instance.reset()