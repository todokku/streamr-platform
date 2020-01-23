// @flow

import BN from 'bignumber.js'
import Web3 from 'web3'
import { I18n } from 'react-redux-i18n'

import NoBalanceError from '$mp/errors/NoBalanceError'
import { getPublicWeb3, getWeb3 } from '$shared/web3/web3Provider'
import getConfig from '$shared/web3/config'
import type { SmartContractCall, Address } from '$shared/flowtype/web3-types'
import { getContract, call } from '../utils/smartContract'
import { gasLimits, paymentCurrencies } from '$shared/utils/constants'
import { fromAtto } from './math'
import type { PaymentCurrency } from '$shared/flowtype/common-types'

declare var ethereum: Web3

const dataTokenContractMethods = (usePublicNode: boolean = false) => getContract(getConfig().dataToken, usePublicNode).methods
const daiTokenContractMethods = (usePublicNode: boolean = false) => getContract(getConfig().daiToken, usePublicNode).methods
const uniswapAdaptorMethods = (usePublicNode: boolean = false) => getContract(getConfig().uniswapAdaptor, usePublicNode).methods

export const getEthBalance = (address: Address, usePublicNode: boolean = false): Promise<BN> => {
    const web3 = usePublicNode ? getPublicWeb3() : getWeb3()

    return web3.eth.getBalance(address)
        .then((balance) => BN(balance))
        .then(fromAtto)
}

export const getDataTokenBalance = (address: Address, usePublicNode: boolean = false): SmartContractCall<BN> => (
    call(dataTokenContractMethods(usePublicNode).balanceOf(address))
        .then(fromAtto)
)

export const getDaiTokenBalance = (address: Address, usePublicNode: boolean = false): SmartContractCall<BN> => (
    call(daiTokenContractMethods(usePublicNode).balanceOf(address))
        .then(fromAtto)
)

export const getMyEthBalance = (): Promise<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getEthBalance(myAccount))
)

export const getMyDataTokenBalance = (): SmartContractCall<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getDataTokenBalance(myAccount))
)

export const getMyDaiTokenBalance = (): SmartContractCall<BN> => (getWeb3().getDefaultAccount()
    .then((myAccount) => getDaiTokenBalance(myAccount))
)

export const getBalances = (): Promise<[BN, BN, BN]> => {
    const ethPromise = getMyEthBalance()
    const dataPromise = getMyDataTokenBalance()
    const daiPromise = getMyDaiTokenBalance()

    return Promise.all([ethPromise, dataPromise, daiPromise])
}

/**
 * getUniswapEquivalents() returns the DAI and ETH value equivalents for a given quanity of DATA through a 'Uniswap'.
 * Firstly, an approximate equivalent of DATA -> SECONDARY is requested from the contract using getConversionRate.
 * Then, we verify through getConversionRate, in reverse: SECONDARY -> DATA that the returned DATA value
 * is greater than or equal to the price of the product in DATA. If it is not, then increase SECONDARY by 2%
 * and try again. After 20 attempts, abandon the uniswap. This equates to a price slippage of approx 40%
 * compared with the actual price if the user was to pay in native DATA.
 *
 * !!!Note some versions of web3 will return a BigNumber from the Ethers library. This has a
 * different prototype compared with BigNumber (BN). This is why extra BNs are used in this function.
 *
 * @param dataQuantity Number of DATA coins.
 */
export const getUniswapEquivalents = async (dataQuantity: string): Promise<[BN, BN]> => {
    const web3 = getWeb3()
    const productPriceDATA = web3.utils.toWei(dataQuantity)
    const DATA = process.env.DATA_TOKEN_CONTRACT_ADDRESS
    const ETH = '0x0000000000000000000000000000000000000000'
    const DAI = process.env.DAI_TOKEN_CONTRACT_ADDRESS

    // ETH
    let uniswapETH = await call(uniswapAdaptorMethods().getConversionRate(DATA, ETH, productPriceDATA))
    uniswapETH = BN(uniswapETH.toString())
    let uniswapDATAfromETH = BN(0)
    let liquidityIssueETH = false

    for (let i = 1; BN(productPriceDATA).isGreaterThan(uniswapDATAfromETH) && i < 21; i += 1) {
        uniswapETH = uniswapETH.toFixed(0, 2)
        // eslint-disable-next-line no-await-in-loop
        uniswapDATAfromETH = await call(uniswapAdaptorMethods().getConversionRate(ETH, DATA, uniswapETH))
        uniswapETH = BN(BN(uniswapETH).multipliedBy(((i * 0.02) + 1)))

        if (i === 20) {
            liquidityIssueETH = true
        }
    }

    // DAI
    let uniswapDAI = await call(uniswapAdaptorMethods().getConversionRate(DATA, DAI, productPriceDATA))
    uniswapDAI = BN(uniswapDAI.toString())
    let uniswapDATAfromDAI = BN(0)
    let liquidityIssueDAI = false

    for (let i = 1; BN(productPriceDATA).isGreaterThan(uniswapDATAfromDAI) && i < 21; i += 1) {
        uniswapDAI = uniswapDAI.toFixed(0, 2)
        // eslint-disable-next-line no-await-in-loop
        uniswapDATAfromDAI = await call(uniswapAdaptorMethods().getConversionRate(DAI, DATA, uniswapDAI))
        uniswapDAI = BN(BN(uniswapDAI).multipliedBy(((i * 0.02) + 1)))

        if (i === 20) {
            liquidityIssueDAI = true
        }
    }

    uniswapETH = liquidityIssueETH ? BN('Infinity') : BN(web3.utils.fromWei(uniswapETH.toFixed(0).toString()))
    uniswapDAI = liquidityIssueDAI ? BN('Infinity') : BN(web3.utils.fromWei(uniswapDAI.toFixed(0).toString()))

    return [uniswapETH, uniswapDAI]
}

export const validateBalanceForPurchase = async (price: BN, paymentCurrency: PaymentCurrency) => {
    const [ethBalance, dataBalance, daiBalance] = await getBalances()
    const [ethPrice, daiPrice] = await getUniswapEquivalents(price.toString())
    const requiredEth = ethPrice
    const requiredGas = fromAtto(gasLimits.BUY_PRODUCT)
    const requiredDai = daiPrice

    switch (paymentCurrency) {
        case paymentCurrencies.ETH:
            if (ethBalance.isLessThan(requiredEth) || ethBalance.isLessThan(ethPrice)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        case paymentCurrencies.DATA:
            if (ethBalance.isLessThan(requiredEth) || dataBalance.isLessThan(price)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        case paymentCurrencies.DAI:
            if (ethBalance.isLessThan(requiredEth) || daiBalance.isLessThan(daiPrice)) {
                throw new NoBalanceError(
                    I18n.t('error.noBalance'),
                    requiredGas,
                    requiredEth,
                    ethBalance,
                    price,
                    dataBalance,
                    daiBalance,
                    requiredDai,
                )
            }
            break
        default:
            break
    }
}
