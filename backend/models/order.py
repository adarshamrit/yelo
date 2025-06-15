from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    items = Column(JSON, nullable=False)  # List of item dicts
    total = Column(Float, nullable=False)
    status = Column(String, default="pending")  # pending, preparing, out_for_delivery, delivered, cancelled
    address = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    delivery_person = Column(String, nullable=True)
    tracking_info = Column(JSON, nullable=True)  # List of tracking events
