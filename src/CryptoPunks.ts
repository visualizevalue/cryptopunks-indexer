import { ponder } from 'ponder:registry'
import assign from '../handlers/assign'
import { bidEntered, bought } from '../handlers/market'

ponder.on('CryptoPunks:Assign', assign)
ponder.on('CryptoPunks:PunkBidEntered', bidEntered)
ponder.on('CryptoPunks:PunkBought', bought)

