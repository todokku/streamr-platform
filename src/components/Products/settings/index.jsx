// @flow

import React, { type Node } from 'react'
import { get } from 'lodash'

import NoProductsView from '../NoProductsView'
import NoMyPurchasesView from '../NoMyPurchasesView'
import NoMyProductsView from '../NoMyProductsView'

import type { ProductTileProps, ProductTilePropType } from '../index'

const setup = {
    myProducts: {
        tileProps: {
            showOwner: false,
            showPrice: false,
            showSubscriptionStatus: false,
        },
        errorView: <NoMyProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        },
    },
    myPurchases: {
        tileProps: {
            showOwner: true,
            showPrice: false,
            showPublishStatus: false,
        },
        errorView: <NoMyPurchasesView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        },
    },
    products: {
        tileProps: {
            showPublishStatus: false,
            showSubscriptionStatus: false,
            showPrice: true,
        },
        errorView: <NoProductsView />,
        cols: {
            xs: 12,
            sm: 6,
            md: 6,
            lg: 3,
        },
    },
}

export const getTileProps = (type: ProductTilePropType): ProductTileProps => get(setup, [type, 'tileProps'])
export const getErrorView = (type: string): Node => get(setup, [type, 'errorView'])
export const getCols = (type: string) => get(setup, [type, 'cols'])
