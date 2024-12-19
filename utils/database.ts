import { zeroAddress } from 'viem'
import { normalize } from 'viem/ens'
import { account, profile, punk } from 'ponder:schema'
import { ONE_DAY, nowInSeconds } from './time'
import { CryptoPunksDataAbi, CryptoPunksDataAddress } from '../abis/CryptoPunksDataAbi'

export async function getAccount (address, { blockNumber, client, db }) {
  let data = await db.find(account, { address })

  if (! data) {
    data = await db.insert(account)
      .values({ address, ens: '', ens_updated_at: 0n })
      .onConflictDoNothing()
  }

  // Check if ENS already existed
  if (blockNumber < 19258213n) {
    console.info(`Skip fetching ENS as it didn't exist yet.`)
    return
  }

  const now = nowInSeconds()
  if ((data.ens_updated_at || 0n) + ONE_DAY < now) {
    try {
      const ens = (await client.getEnsName({ address, blockTag: 'latest' })) || ''

      data = await db.update(account, { address }).set({ ens, ens_updated_at: now })
    } catch (e) {
      console.warn(`Ran into an issue fetching/saving the ENS record for ${address}: "${e.message}"`)
    }
  } else {
    console.info(`Skip ens update: ${address}, ${data.ens}`)
  }

  return data
}

export async function getPunkAttributes (id, { client, db }) {
  const attributeString = await client.readContract({
    abi: CryptoPunksDataAbi,
    address: CryptoPunksDataAddress,
    functionName: 'punkAttributes',
    args: [id],
    blockNumber: 13047090,
  })

  const attributes = attributeString.split(', ').map(s => s.trim())

  await db.update(punk, { id }).set({ attributes })
}

export async function saveProfile (ens, { client, db }) {
  if (! ens) return

  try {
    const [
      avatar,
      twitter,
    ] = await Promise.all([
      client.getEnsAvatar({ name: normalize(ens) }),
      client.getEnsText({ name: ens, key: 'com.twitter' }),
    ])

    const data = {
      avatar: avatar || '',
      links: {
        twitter,
      },
      updated_at: BigInt(Date.now()),
    }

    await db.insert(profile).values({ ens, ...data }).onConflictDoUpdate(data)
  } catch (e) {
    console.warn(`Error fetching profile:`, e)
  }
}

