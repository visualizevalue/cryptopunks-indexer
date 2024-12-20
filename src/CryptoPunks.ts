import { ponder } from 'ponder:registry'
import assign from '../handlers/assign'
import { bought } from '../handlers/market'

ponder.on('CryptoPunks:Assign', assign)
ponder.on('CryptoPunks:PunkBought', bought)

