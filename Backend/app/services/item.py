from app.repositories.item import ItemRepository
from app.models.item import Item
from app.schemas.item import ItemCreate
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List, Optional

class ItemService:
    def __init__(self, repo: ItemRepository):
        self.repo = repo

    async def get_item(self, item_id: int) -> Optional[Item]:
        return await self.repo.get(item_id)

    async def get_items(self) -> List[Item]:
        return await self.repo.get_all()

    async def create_item(self, item_create: ItemCreate) -> Item:
        item = Item.from_orm(item_create)
        return await self.repo.create(item)

    async def delete_item(self, item_id: int) -> bool:
        item = await self.repo.get(item_id)
        if item:
            await self.repo.delete(item)
            return True
        return False
