import asyncio
import json

import aiohttp


async def main():
    params = {
        "module": "contract",
        "action": "getabi",
        "address": "0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019",
    }
    async with (
        aiohttp.ClientSession() as session,
        session.get(
            "https://coston2-explorer.flare.network/api", params=params
        ) as response,
    ):
        res = await response.json()
        abi = json.loads(res["result"])
        print(abi[4]["name"])  # getContractAddressByName


if __name__ == "__main__":
    asyncio.run(main())
