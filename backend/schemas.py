from pydantic import BaseModel
from typing import Optional, List

class IMUData(BaseModel):
    roll: float
    pitch: float
    yaw: float
    angular_velocity: List[float]
    linear_acceleration: List[float]

class EncoderData(BaseModel):
    wheel_ticks: int
    velocity: float
    distance_traveled: float

class VelocityCommand(BaseModel):
    linear_x: float
    angular_z: float

class RobotStatus(BaseModel):
    battery_voltage: float
    is_connected: bool
    last_update: str
