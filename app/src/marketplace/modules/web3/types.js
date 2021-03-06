// @flow

import type { NumberString, PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { Address } from '$shared/flowtype/web3-types'

export type AccountAction = PayloadAction<{
    id: Address,
}>
export type AccountActionCreator = (id: Address) => AccountAction

export type AccountErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type AccountErrorActionCreator = (error: ErrorInUi) => AccountErrorAction

export type EthereumNetworkIdAction = PayloadAction<{
    id: NumberString,
}>
export type EthereumNetworkIdActionCreator = (id: NumberString) => AccountAction
