// @flow

import type { ErrorFromApi, NumberString, PayloadAction, ErrorInUi } from '$shared/flowtype/common-types'
import type { ProductId } from '$mp/flowtype/product-types'
import type { Hash } from '$shared/flowtype/web3-types'

export type ProductIdAction = PayloadAction<{
    id: ProductId,
}>
export type ProductIdActionCreator = (ProductId) => ProductIdAction

export type PurchaseAction = PayloadAction<{
    productId: ProductId,
    subscriptionInSeconds: NumberString,
}>
export type PurchaseActionCreator = (ProductId, NumberString) => PurchaseAction

export type HashAction = PayloadAction<{
    hash: Hash,
}>
export type HashActionCreator = (Hash) => HashAction

export type PurchaseErrorAction = PayloadAction<{
    error: ErrorInUi,
}>
export type PurchaseErrorActionCreator = (ErrorInUi) => PurchaseErrorAction

export type ProductErrorAction = PayloadAction<{
    id: ProductId,
    error: ErrorFromApi,
}>
export type ProductErrorActionCreator = (ProductId, ErrorFromApi) => ProductErrorAction
