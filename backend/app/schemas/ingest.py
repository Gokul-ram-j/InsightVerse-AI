from pydantic import BaseModel
from typing import Optional, Dict, Any

class UploadDataRequest(BaseModel):
    # COMMON
    sourceType: str              # FILE | LINK
    services: Dict[str, Any]
    query: Optional[str] = None

    # FILE
    fileType: Optional[str] = None
    fileUrl: Optional[str] = None

    # LINK
    linkType: Optional[str] = None   # website | youtube
    url: Optional[str] = None
