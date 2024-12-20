import { zeroAddress } from 'viem'
import { normalize } from 'viem/ens'
import { type Context } from 'ponder:registry'
import { accounts, profiles, punks } from 'ponder:schema'
import { ONE_DAY, nowInSeconds } from './time'
import { CryptoPunksDataAbi, CryptoPunksDataAddress } from '../abis/CryptoPunksDataAbi'

type TimedContext = Context & { blockNumber: bigint }

export async function getAccount (address: `0x${string}`, { blockNumber, client, db }: TimedContext) {
  let data = await db.find(accounts, { address })

  if (! data) {
    data = await db.insert(accounts)
      .values({ address, ens: '', ens_updated_at: 0n })
      .onConflictDoNothing()
  }

  // Check if ENS already existed
  if (blockNumber < 19258213n) return

  const now = nowInSeconds()
  if ((data?.ens_updated_at || 0n) + ONE_DAY < now) {
    try {
      const ens = (await client.getEnsName({ address, blockTag: 'latest' } as any)) || ''

      data = await db.update(accounts, { address }).set({ ens, ens_updated_at: now })
    } catch (e: any) {
      console.warn(`Ran into an issue fetching/saving the ENS record for ${address}: "${e.message}"`)
    }
  } else {
    console.info(`Skip ens update: ${address}, ${data?.ens}`)
  }

  return data
}

export async function getPunkAttributes (id: bigint, { client, db }: Context) {
  const attributeString: string = await client.readContract({
    abi: CryptoPunksDataAbi,
    address: CryptoPunksDataAddress,
    functionName: 'punkAttributes',
    args: [Number(id)],
    blockNumber: 13047090n,
  })

  const attributes = attributeString.split(', ').map(s => s.trim())

  await db.update(punks, { id }).set({ attributes })
}

export async function saveProfile (ens: string, { client, db }: Context) {
  if (! ens) return

  try {
    const [
      avatar,
      twitter,
    ] = await Promise.all([
      client.getEnsAvatar({ name: normalize(ens) }),
      client.getEnsText({ name: ens, key: 'com.twitter' }) as unknown as string,
    ])

    const data = {
      avatar: avatar || '',
      links: {
        twitter,
      },
      updated_at: BigInt(Date.now()),
    }

    await db.insert(profiles).values({ ens, ...data }).onConflictDoUpdate(data)
  } catch (e) {
    console.warn(`Error fetching profile:`, e)
  }
}

