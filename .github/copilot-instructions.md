<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This project is a FastAPI application using SQLModel, async database connection, repository pattern, service layer, pydantic schemas, async endpoints, and modular structure with PostgreSQL as the database.
(base) namanchawla@Namans-MacBook-Air New % uvicorn app.main:app --reload  
INFO:     Will watch for changes in these directories: ['/Users/namanchawla/Desktop/Github/Temp/New']
ERROR:    [Errno 48] Address already in use
(base) namanchawla@Namans-MacBook-Air New % uvicorn app.main:app --reload 
INFO:     Will watch for changes in these directories: ['/Users/namanchawla/Desktop/Github/Temp/New']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [32359] using WatchFiles
INFO:     Started server process [32361]
INFO:     Waiting for application startup.
ERROR:    Traceback (most recent call last):
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 694, in lifespan
    async with self.lifespan_context(app) as maybe_state:
  File "/Users/namanchawla/miniforge3/lib/python3.10/contextlib.py", line 199, in __aenter__
    return await anext(self.gen)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/fastapi/routing.py", line 211, in merged_lifespan
    async with original_context(app) as maybe_original_state:
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 571, in __aenter__
    await self._router.startup()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 671, in startup
    await handler()
  File "/Users/namanchawla/Desktop/Github/Temp/New/app/main.py", line 12, in on_startup
    await init_db()
  File "/Users/namanchawla/Desktop/Github/Temp/New/app/core/db.py", line 25, in init_db
    async with engine.begin() as conn:
  File "/Users/namanchawla/miniforge3/lib/python3.10/contextlib.py", line 199, in __aenter__
    return await anext(self.gen)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/engine.py", line 1068, in begin
    async with conn:
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/base.py", line 121, in __aenter__
    return await self.start(is_ctxmanager=True)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/engine.py", line 275, in start
    await greenlet_spawn(self.sync_engine.connect)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 201, in greenlet_spawn
    result = context.throw(*sys.exc_info())
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 3277, in connect
    return self._connection_cls(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 143, in __init__
    self._dbapi_connection = engine.raw_connection()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 3301, in raw_connection
    return self.pool.connect()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 447, in connect
    return _ConnectionFairy._checkout(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 1264, in _checkout
    fairy = _ConnectionRecord.checkout(pool)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 711, in checkout
    rec = pool._do_get()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/impl.py", line 177, in _do_get
    with util.safe_reraise():
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/langhelpers.py", line 224, in __exit__
    raise exc_value.with_traceback(exc_tb)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/impl.py", line 175, in _do_get
    return self._create_connection()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 388, in _create_connection
    return _ConnectionRecord(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 673, in __init__
    self.__connect()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 899, in __connect
    with util.safe_reraise():
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/langhelpers.py", line 224, in __exit__
    raise exc_value.with_traceback(exc_tb)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 895, in __connect
    self.dbapi_connection = connection = pool._invoke_creator(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/create.py", line 661, in connect
    return dialect.connect(*cargs, **cparams)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/default.py", line 629, in connect
    return self.loaded_dbapi.connect(*cargs, **cparams)  # type: ignore[no-any-return]  # NOQA: E501
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 955, in connect
    await_only(creator_fn(*arg, **kw)),
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
    return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
    value = await result
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connection.py", line 2421, in connect
    return await connect_utils._connect(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 1075, in _connect
    raise last_error or exceptions.TargetServerAttributeNotMatched(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 1049, in _connect
    conn = await _connect_addr(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 886, in _connect_addr
    return await __connect_addr(params, True, *args)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 931, in __connect_addr
    tr, pr = await connector
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 802, in _create_ssl_connection
    tr, pr = await loop.create_connection(
  File "uvloop/loop.pyx", line 2043, in create_connection
  File "uvloop/loop.pyx", line 2020, in uvloop.loop.Loop.create_connection
ConnectionRefusedError: [Errno 61] Connection refused

ERROR:    Application startup failed. Exiting.(base) namanchawla@Namans-MacBook-Air New % uvicorn app.main:app --reload  
INFO:     Will watch for changes in these directories: ['/Users/namanchawla/Desktop/Github/Temp/New']
ERROR:    [Errno 48] Address already in use
(base) namanchawla@Namans-MacBook-Air New % uvicorn app.main:app --reload 
INFO:     Will watch for changes in these directories: ['/Users/namanchawla/Desktop/Github/Temp/New']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [32359] using WatchFiles
INFO:     Started server process [32361]
INFO:     Waiting for application startup.
ERROR:    Traceback (most recent call last):
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 694, in lifespan
    async with self.lifespan_context(app) as maybe_state:
  File "/Users/namanchawla/miniforge3/lib/python3.10/contextlib.py", line 199, in __aenter__
    return await anext(self.gen)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/fastapi/routing.py", line 211, in merged_lifespan
    async with original_context(app) as maybe_original_state:
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 571, in __aenter__
    await self._router.startup()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/starlette/routing.py", line 671, in startup
    await handler()
  File "/Users/namanchawla/Desktop/Github/Temp/New/app/main.py", line 12, in on_startup
    await init_db()
  File "/Users/namanchawla/Desktop/Github/Temp/New/app/core/db.py", line 25, in init_db
    async with engine.begin() as conn:
  File "/Users/namanchawla/miniforge3/lib/python3.10/contextlib.py", line 199, in __aenter__
    return await anext(self.gen)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/engine.py", line 1068, in begin
    async with conn:
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/base.py", line 121, in __aenter__
    return await self.start(is_ctxmanager=True)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/ext/asyncio/engine.py", line 275, in start
    await greenlet_spawn(self.sync_engine.connect)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 201, in greenlet_spawn
    result = context.throw(*sys.exc_info())
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 3277, in connect
    return self._connection_cls(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 143, in __init__
    self._dbapi_connection = engine.raw_connection()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/base.py", line 3301, in raw_connection
    return self.pool.connect()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 447, in connect
    return _ConnectionFairy._checkout(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 1264, in _checkout
    fairy = _ConnectionRecord.checkout(pool)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 711, in checkout
    rec = pool._do_get()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/impl.py", line 177, in _do_get
    with util.safe_reraise():
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/langhelpers.py", line 224, in __exit__
    raise exc_value.with_traceback(exc_tb)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/impl.py", line 175, in _do_get
    return self._create_connection()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 388, in _create_connection
    return _ConnectionRecord(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 673, in __init__
    self.__connect()
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 899, in __connect
    with util.safe_reraise():
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/langhelpers.py", line 224, in __exit__
    raise exc_value.with_traceback(exc_tb)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/pool/base.py", line 895, in __connect
    self.dbapi_connection = connection = pool._invoke_creator(self)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/create.py", line 661, in connect
    return dialect.connect(*cargs, **cparams)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/engine/default.py", line 629, in connect
    return self.loaded_dbapi.connect(*cargs, **cparams)  # type: ignore[no-any-return]  # NOQA: E501
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/dialects/postgresql/asyncpg.py", line 955, in connect
    await_only(creator_fn(*arg, **kw)),
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 132, in await_only
    return current.parent.switch(awaitable)  # type: ignore[no-any-return,attr-defined] # noqa: E501
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/sqlalchemy/util/_concurrency_py3k.py", line 196, in greenlet_spawn
    value = await result
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connection.py", line 2421, in connect
    return await connect_utils._connect(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 1075, in _connect
    raise last_error or exceptions.TargetServerAttributeNotMatched(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 1049, in _connect
    conn = await _connect_addr(
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 886, in _connect_addr
    return await __connect_addr(params, True, *args)
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 931, in __connect_addr
    tr, pr = await connector
  File "/Users/namanchawla/miniforge3/lib/python3.10/site-packages/asyncpg/connect_utils.py", line 802, in _create_ssl_connection
    tr, pr = await loop.create_connection(
  File "uvloop/loop.pyx", line 2043, in create_connection
  File "uvloop/loop.pyx", line 2020, in uvloop.loop.Loop.create_connection
ConnectionRefusedError: [Errno 61] Connection refused

ERROR:    Application startup failed. Exiting.