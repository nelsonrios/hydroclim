from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Basin_info(Base):
    __tablename__ = 'basin'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    description = Column(String(255))

if __name__ == "__main__":
    from sqlalchemy import create_engine
    from dbsetting import DB_URI
    engine = create_engine(DB_URI)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
