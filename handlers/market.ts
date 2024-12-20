import { eq, and, desc } from 'ponder'
import { type IndexingFunctionArgs } from 'ponder:registry'
import { punks, events } from 'ponder:schema'
import { zeroAddress } from 'viem'
import { getAccount } from '../utils/database'

// event Transfer(address indexed from, address indexed to, uint256 value)
// event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex)
// event PunkOffered(uint256 indexed punkIndex, uint256 minValue, address indexed toAddress)
// event PunkBidWithdrawn(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
// event PunkNoLongerForSale(uint256 indexed punkIndex)

// event PunkBidEntered(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
export const bidEntered = async ({ event, context }: IndexingFunctionArgs<'CryptoPunks:PunkBidEntered'>) => {
  const blockNumber = event.block.number
  const bidder = event.args.fromAddress
  const id = event.args.punkIndex
  const value = event.args.value

  // Update the account
  await getAccount(bidder, { ...context, blockNumber })

  // Store the event
  await context.db
    .insert(events)
    .values({
      type: 'BID',
      from: bidder,
      value,
      punk: id,
      hash: event.transaction.hash,
      block_number: blockNumber,
      log_index: event.log.logIndex,
      timestamp: event.block.timestamp,
    })
    .onConflictDoNothing()
}

// event PunkBought(uint256 indexed punkIndex, uint256 value, address indexed fromAddress, address indexed toAddress)
export const bought = async ({ event, context }: IndexingFunctionArgs<'CryptoPunks:PunkBought'>) => {
  const blockNumber = event.block.number
  const from = event.args.fromAddress
  const id = event.args.punkIndex

  let to: `0x${string}` = event.args.toAddress
  let value: bigint = event.args.value

  // Handle bought event via accepted bid edge case (CP bug line 227)
  // If the value is 0, it must be from an accepted bid, as punks
  // cannot be bought for 0 value otherwise.
  if (value === 0n) {
    try {
      const [previousBid] = await context.db.sql
        .select()
        .from(events)
        .where(and(eq(events.type, 'BID'), eq(events.punk, id)))
        .orderBy(desc(events.block_number), desc(events.log_index))
        .limit(1)

      value = previousBid?.value || 0n
      to = previousBid?.from || zeroAddress
    } catch (e: any) {
      console.warn(`Error fetching previous bid in bought event:`, e.message)
    }
  }

  // Fetch / update accounts
  await Promise.all([
    getAccount(from, { ...context, blockNumber }),
    getAccount(to, { ...context, blockNumber }),
  ])

  // Store the event
  await context.db
    .insert(events)
    .values({
      type: 'BUY',
      from,
      to,
      value,
      punk: id,
      hash: event.transaction.hash,
      block_number: event.block.number,
      log_index: event.log.logIndex,
      timestamp: event.block.timestamp,
    })
    .onConflictDoNothing()

  // Update punk owner
  await context.db.update(punks, { id }).set({ owner: to })
}

