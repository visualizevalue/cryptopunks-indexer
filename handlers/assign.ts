import { type IndexingFunctionArgs } from 'ponder:registry'
import { punks } from 'ponder:schema'
import { getAccount, getPunkAttributes } from '../utils/database'

const assign = async ({ event, context }: IndexingFunctionArgs<'CryptoPunks:Assign'>) => {
  const owner = event.args.to
  const id = event.args.punkIndex
  const blockNumber = event.block.number

  await getAccount(owner, { ...context, blockNumber })

  await context.db
    .insert(punks)
    .values({ id, owner })
    .onConflictDoNothing()

  await getPunkAttributes(id, context)
}

export default assign

