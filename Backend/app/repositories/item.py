from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from app.models.item import Item
from typing import List, Optional

class ItemRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get(self, item_id: int) -> Optional[Item]:
        result = await self.session.exec(select(Item).where(Item.id == item_id))
        return result.first()

    async def get_all(self) -> List[Item]:
        result = await self.session.exec(select(Item))
        return result.all()

    async def create(self, item: Item) -> Item:
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def delete(self, item: Item):
        await self.session.delete(item)
        await self.session.commit()
