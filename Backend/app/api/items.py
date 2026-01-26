from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from app.schemas.item import ItemCreate, ItemRead
from app.services.item import ItemService
from app.repositories.item import ItemRepository
from app.core.db import get_session
from typing import List

router = APIRouter()

@router.post("/items/", response_model=ItemRead, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate, session: AsyncSession = Depends(get_session)):
    service = ItemService(ItemRepository(session))
    return await service.create_item(item)

@router.get("/items/", response_model=List[ItemRead])
async def read_items(session: AsyncSession = Depends(get_session)):
    service = ItemService(ItemRepository(session))
    return await service.get_items()

@router.get("/items/{item_id}", response_model=ItemRead)
async def read_item(item_id: int, session: AsyncSession = Depends(get_session)):
    service = ItemService(ItemRepository(session))
    item = await service.get_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, session: AsyncSession = Depends(get_session)):
    service = ItemService(ItemRepository(session))
    deleted = await service.delete_item(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
