import { eq, and, desc } from 'ponder'
import { punk, event } from 'ponder:schema'
import { zeroAddress } from 'viem'
import { getAccount } from '../utils/database'

// event Transfer(address indexed from, address indexed to, uint256 value)
// event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex)
// event PunkOffered(uint256 indexed punkIndex, uint256 minValue, address indexed toAddress)
// event PunkBidWithdrawn(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
// event PunkNoLongerForSale(uint256 indexed punkIndex)

// event PunkBidEntered(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
export const bidEntered = async ({ event: e, context }) => {
  const blockNumber = e.block.number
  const bidder = e.args.fromAddress
  const id = e.args.punkIndex
  const value = e.args.value

  // Update the account
  await getAccount(bidder, { ...context, blockNumber })

  // Store the event
  await context.db
    .insert(event)
    .values({
      type: 'BID',
      from: bidder,
      value,
      punk: id,
      hash: e.transaction.hash,
      block_number: e.block.number,
      log_index: e.log.logIndex,
      timestamp: e.block.timestamp,
    })
    .onConflictDoNothing()
}

// event PunkBought(uint256 indexed punkIndex, uint256 value, address indexed fromAddress, address indexed toAddress)
export const bought = async ({ event: e, context }) => {
  const blockNumber = e.block.number
  const from = e.args.fromAddress
  const id = e.args.punkIndex

  let to = e.args.toAddress
  let value = e.args.value

  // Handle bought event via accepted bid edge case (CP bug line 227)
  // If the value is 0, it must be from an accepted bid, as punks
  // cannot be bought for 0 value otherwise.
  if (value === 0n) {
    try {
      const [previousBid] = await context.db.sql
        .select()
        .from(event)
        .where(and(eq(event.type, 'BID'), eq(event.punk, id)))
        .orderBy(desc(event.block_number, event.log_index))
        .limit(1)

      value = previousBid.value
      to = previousBid.from
    } catch (e) {
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
    .insert(event)
    .values({
      type: 'BUY',
      from,
      to,
      value,
      punk: id,
      hash: e.transaction.hash,
      block_number: e.block.number,
      log_index: e.log.logIndex,
      timestamp: e.block.timestamp,
    })
    .onConflictDoNothing()

  // Update punk owner
  await context.db.update(punk, { id }).set({ owner: to })
}

