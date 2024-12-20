import { onchainTable, onchainEnum, primaryKey, relations } from 'ponder'

export const account = onchainTable('accounts', (t) => ({
  address: t.hex().primaryKey(),
  ens: t.text(),
  ens_updated_at: t.bigint(),
}))

export const profile = onchainTable('profiles', (t) => ({
  ens: t.text().primaryKey(),
  avatar: t.text(),
  description: t.text(),
  links: t.jsonb().$type<{ [key: string]: string }>(),
  updated_at: t.bigint(),
}))

export const punk = onchainTable('punks', (t) => ({
  id: t.bigint().primaryKey(),
  owner: t.hex(),
  attributes: t.text().array(),
}))

export const eventType = onchainEnum('type', ['ASSIGN', 'TRANSFER', 'OFFER', 'BID', 'BUY'])
export const event = onchainTable('events', (t) => ({
    type: eventType('type'),
    hash: t.hex(),
    block_number: t.bigint(),
    log_index: t.integer(),
    timestamp: t.bigint(),
    from: t.hex(),
    to: t.hex(),
    value: t.bigint(),
  }),
  (table) => ({
    pk: primaryKey({
      columns: [table.hash, table.block_number, table.log_index],
    }),
  }),
)

// ===========================================================================
//                                 RELATIONS
// ===========================================================================

export const accountRelations = relations(account, ({ many, one }) => ({
  punks: many(punk, {
    fields: [punk.owner],
    references: [account.address],
  }),
  profile: one(profile, {
    fields: [account.ens],
    references: [profile.ens],
  }),
}))

export const punkRelations = relations(punk, ({ one }) => ({
  owner: one(account, {
    fields: [punk.owner],
    references: [account.address],
  }),
}))

