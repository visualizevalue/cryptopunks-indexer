import { onchainTable, onchainEnum, primaryKey, relations } from 'ponder'

export const accounts = onchainTable('accounts', (t) => ({
  address: t.hex().primaryKey(),
  ens: t.text(),
  ens_updated_at: t.bigint(),
}))

export const profiles = onchainTable('profiles', (t) => ({
  ens: t.text().primaryKey(),
  avatar: t.text(),
  description: t.text(),
  links: t.jsonb().$type<{ [key: string]: string }>(),
  updated_at: t.bigint(),
}))

export const punks = onchainTable('punks', (t) => ({
  id: t.bigint().primaryKey(),
  owner: t.hex(),
  attributes: t.text().array(),
}))

export const eventType = onchainEnum('type', ['ASSIGN', 'TRANSFER', 'OFFER', 'BID', 'BUY'])
export const events = onchainTable('events', (t) => ({
    type: eventType('type'),
    hash: t.hex(),
    block_number: t.bigint(),
    log_index: t.integer(),
    timestamp: t.bigint(),
    from: t.hex(),
    to: t.hex(),
    value: t.bigint(),
    punk: t.bigint(),
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

// export const accountRelations = relations(accounts, ({ many, one }) => ({
//   punks: many(punks, {
//     fields: [punks.owner],
//     references: [accounts.address],
//   }),
//   profile: one(profiles, {
//     fields: [accounts.ens],
//     references: [profiles.ens],
//   }),
// }))
//
// export const punkRelations = relations(punks, ({ many, one }) => ({
//   owner: one(accounts, {
//     fields: [punks.owner],
//     references: [accounts.address],
//   }),
// }))
//
