import logging
import logging.handlers
import os
from datetime import datetime
import json
from pathlib import Path

# Create logs directory if it doesn't exist
LOGS_DIR = Path(__file__).parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)

# Define log file paths
QUOTE_ERRORS_LOG = LOGS_DIR / "quote_errors.log"
QUOTE_DEBUG_LOG = LOGS_DIR / "quote_debug.log"

class StructuredLogRecord(logging.LogRecord):
    """Custom LogRecord that supports structured logging"""
    def getMessage(self):
        msg = self.msg
        if self.args:
            if isinstance(self.args, dict):
                msg = msg.format(**self.args)
            else:
                msg = msg.format(*self.args)
        return msg

class JSONFormatter(logging.Formatter):
    """JSON formatter for structured logging"""
    def format(self, record):
        log_record = {
            "timestamp": datetime.now().isoformat(),
            "level": record.levelname.lower(),
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
            "service_type": getattr(record, "service_type", None),
            "fallback_used": getattr(record, "fallback_used", False),
            "error_type": getattr(record, "error_type", None),
            "error_message": getattr(record, "error_message", None),
            "meta": getattr(record, "meta", {})
        }
        return json.dumps(log_record)

def setup_logging():
    """Configure logging for the quote engine"""
    # Create formatters
    json_formatter = JSONFormatter()
    
    # Create handlers
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(json_formatter)
    
    error_file_handler = logging.handlers.RotatingFileHandler(
        QUOTE_ERRORS_LOG,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    error_file_handler.setLevel(logging.ERROR)
    error_file_handler.setFormatter(json_formatter)
    
    debug_file_handler = logging.handlers.RotatingFileHandler(
        QUOTE_DEBUG_LOG,
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    debug_file_handler.setLevel(logging.DEBUG)
    debug_file_handler.setFormatter(json_formatter)
    
    # Configure root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(logging.DEBUG)
    root_logger.addHandler(console_handler)
    root_logger.addHandler(error_file_handler)
    root_logger.addHandler(debug_file_handler)
    
    # Configure quote engine loggers
    quote_logger = logging.getLogger("quote_engine")
    quote_logger.setLevel(logging.DEBUG)
    
    registry_logger = logging.getLogger("quote_registry")
    registry_logger.setLevel(logging.DEBUG)
    
    return {
        "quote_logger": quote_logger,
        "registry_logger": registry_logger
    } 