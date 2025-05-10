from abc import ABC, abstractmethod

class QuoteSchemaBase(ABC):
    @abstractmethod
    def calculate_quote(self, fields: dict) -> float:
        pass 