import { punk, event } from 'ponder:schema'
import { getAccount } from '../utils/database'

// event Transfer(address indexed from, address indexed to, uint256 value)
// event PunkTransfer(address indexed from, address indexed to, uint256 punkIndex)
// event PunkOffered(uint256 indexed punkIndex, uint256 minValue, address indexed toAddress)
// event PunkBidEntered(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
// event PunkBidWithdrawn(uint256 indexed punkIndex, uint256 value, address indexed fromAddress)
// event PunkNoLongerForSale(uint256 indexed punkIndex)

// event PunkBought(uint256 indexed punkIndex, uint256 value, address indexed fromAddress, address indexed toAddress)
export const bought = async ({ event: e, context }) => {
  const from = e.args.fromAddress
  const to = e.args.toAddress
  const id = e.args.punkIndex
  const value = e.args.value
  const blockNumber = e.block.number

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
      hash: e.transaction.hash,
      block_number: e.block.number,
      log_index: e.log.logIndex,
      timestamp: e.block.timestamp,
    })
    .onConflictDoNothing()

  // Update punk owner
  await context.db.update(punk, { id }).set({ owner: to })
}

