// @flow

import { type Node, useCallback, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { selectAccountId } from '$mp/modules/web3/selectors'
import { receiveAccount, changeAccount, accountError, updateEthereumNetworkId } from '$mp/modules/web3/actions'
import type { Hash, Receipt } from '$shared/flowtype/web3-types'
import type { ErrorInUi, NumberString } from '$shared/flowtype/common-types'
import { getUserData } from '$shared/modules/user/actions'
import { getDataPerUsd } from '$mp/modules/global/actions'
import { areAddressesEqual } from '$mp/utils/smartContract'
import {
    addTransaction,
    completeTransaction,
    transactionError,
} from '$mp/modules/transactions/actions'
import { fetchIntegrationKeys } from '$shared/modules/integrationKey/actions'
import { getTransactionsFromSessionStorage } from '$shared/utils/transactions'
import TransactionError from '$shared/errors/TransactionError'
import Web3Poller from '$shared/web3/web3Poller'
import { useBalances } from '$shared/hooks/useBalances'
import { selectUserData } from '$shared/modules/user/selectors'

type Props = {
    children?: Node,
}

const LOGIN_POLL_INTERVAL = 1000 * 60 * 5 // 5min
const ACCOUNT_BALANCE_POLL_INTERVAL = 1000 * 60 * 5 // 5min
const USD_RATE_POLL_INTERVAL = 1000 * 60 * 60 * 6 // 6h
const PENDING_TX_WAIT = 1000 // 1s

export const GlobalInfoWatcher = ({ children }: Props) => {
    const dispatch = useDispatch()
    const account = useSelector(selectAccountId)
    const accountRef = useRef(account)
    accountRef.current = account

    // Poll usd rate from contract
    const dataPerUsdRatePollTimeout = useRef()
    const dataPerUsdRatePoll = useCallback(() => {
        clearTimeout(dataPerUsdRatePollTimeout.current)
        dispatch(getDataPerUsd())

        dataPerUsdRatePollTimeout.current = setTimeout(dataPerUsdRatePoll, USD_RATE_POLL_INTERVAL)
    }, [dispatch])

    useEffect(() => {
        dataPerUsdRatePoll()

        return () => {
            clearTimeout(dataPerUsdRatePollTimeout.current)
        }
    }, [dataPerUsdRatePoll])

    // Poll login info
    const loginPollTimeout = useRef()
    const loginPoll = useCallback(() => {
        clearTimeout(loginPollTimeout.current)
        dispatch(getUserData())

        loginPollTimeout.current = setTimeout(loginPoll, LOGIN_POLL_INTERVAL)
    }, [dispatch])

    useEffect(() => {
        loginPoll()

        return () => {
            clearTimeout(loginPollTimeout.current)
        }
    }, [loginPoll])

    // Poll for web3 account
    const handleAccount = useCallback((nextAccount: string) => {
        const next = nextAccount
        const curr = accountRef.current

        const didChange = curr && next && !areAddressesEqual(curr, next)
        const didDefine = !curr && next
        if (didDefine) {
            dispatch(receiveAccount(next))
        } else if (didChange) {
            dispatch(changeAccount(next))
        }
    }, [accountRef, dispatch])
    const handleAccountError = useCallback((error: ErrorInUi) => {
        dispatch(accountError(error))
    }, [dispatch])

    useEffect(() => {
        Web3Poller.subscribe(Web3Poller.events.ACCOUNT_ERROR, handleAccountError)
        Web3Poller.subscribe(Web3Poller.events.ACCOUNT, handleAccount)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT_ERROR, handleAccountError)
            Web3Poller.unsubscribe(Web3Poller.events.ACCOUNT, handleAccount)
        }
    }, [handleAccount, handleAccountError])

    // Poll network
    const handleNetwork = useCallback((network: NumberString) => {
        dispatch(updateEthereumNetworkId(network))
    }, [dispatch])

    useEffect(() => {
        Web3Poller.subscribe(Web3Poller.events.NETWORK, handleNetwork)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.NETWORK, handleNetwork)
        }
    }, [handleNetwork])

    // Poll transactions
    useEffect(() => {
        const transactionsTimeout = setTimeout(() => {
            const pendingTransactions = getTransactionsFromSessionStorage()
            Object.keys(pendingTransactions)
                .forEach((txHash) => {
                    dispatch(addTransaction(txHash, pendingTransactions[txHash]))
                })
        }, PENDING_TX_WAIT)

        return () => {
            clearTimeout(transactionsTimeout)
        }
    }, [dispatch])

    const handleTransactionComplete = useCallback((id: Hash, receipt: Receipt) => {
        dispatch(completeTransaction(id, receipt))
    }, [dispatch])

    const handleTransactionError = useCallback((id: Hash, error: TransactionError) => {
        dispatch(transactionError(id, error))
    }, [dispatch])

    useEffect(() => {
        Web3Poller.subscribe(Web3Poller.events.TRANSACTION_COMPLETE, handleTransactionComplete)
        Web3Poller.subscribe(Web3Poller.events.TRANSACTION_ERROR, handleTransactionError)

        return () => {
            Web3Poller.unsubscribe(Web3Poller.events.TRANSACTION_COMPLETE, handleTransactionComplete)
            Web3Poller.unsubscribe(Web3Poller.events.TRANSACTION_ERROR, handleTransactionError)
        }
    }, [handleTransactionComplete, handleTransactionError])

    // Fetch integrations keys and poll balances
    const { update: updateBalances } = useBalances()
    const balanceTimeout = useRef()
    const balancePoll = useCallback(() => {
        clearTimeout(balanceTimeout.current)
        updateBalances()

        balanceTimeout.current = setTimeout(balancePoll, ACCOUNT_BALANCE_POLL_INTERVAL)
    }, [updateBalances])
    const user = useSelector(selectUserData)

    useEffect(() => {
        if (!user) { return () => {} }

        // fetch the integration keys first and then start polling for the balance
        dispatch(fetchIntegrationKeys())
            .then(() => {
                balancePoll()
            })

        return () => {
            clearTimeout(balanceTimeout.current)
        }
    }, [dispatch, balancePoll, user])

    return children || null
}

export default GlobalInfoWatcher
