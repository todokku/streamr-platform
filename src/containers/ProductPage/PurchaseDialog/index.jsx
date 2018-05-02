// @flow

import React from 'react'
import BN from 'bignumber.js'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'

import { selectStep, selectProduct, selectPurchaseData } from '../../../modules/purchaseDialog/selectors'
import { setAccessPeriod, setAllowance, initPurchase, approvePurchase } from '../../../modules/purchaseDialog/actions'
import { purchaseFlowSteps } from '../../../utils/constants'
import { selectEnabled } from '../../../modules/web3/selectors'
import { getAllowance, setAllowanceFailure } from '../../../modules/allowance/actions'
import {
    selectAllowanceError,
    selectGettingAllowance,
    selectTransactionState as selectAllowanceTransactionState,
} from '../../../modules/allowance/selectors'
import { selectTransactionState as selectPurchaseTransactionState } from '../../../modules/purchase/selectors'
import { hideModal } from '../../../modules/modals/actions'
import { getProductFromContract } from '../../../modules/contractProduct/actions'
import { selectFetchingContractProduct, selectContractProduct, selectContractProductError } from '../../../modules/contractProduct/selectors'
import type { StoreState, PurchaseStep } from '../../../flowtype/store-state'
import type { Product, ProductId, SmartContractProduct } from '../../../flowtype/product-types'
import type { TimeUnit, Purchase, TransactionState, ErrorInUi, NumberString } from '../../../flowtype/common-types'
import ErrorDialog from '../../../components/Modal/ErrorDialog'
import UnlockWalletDialog from '../../../components/Modal/UnlockWalletDialog'
import ChooseAccessPeriodDialog from '../../../containers/ChooseAccessPeriodDialog'
import SetAllowanceDialog from '../../../components/Modal/SetAllowanceDialog'
import PurchaseSummaryDialog from '../../../components/Modal/PurchaseSummaryDialog'
import CompletePurchaseDialog from '../../../components/Modal/CompletePurchaseDialog'
import { formatPath } from '../../../utils/url'
import links from '../../../links'

type StateProps = {
    walletEnabled: boolean,
    step: ?PurchaseStep,
    product: ?Product,
    fetchingContractProduct: boolean,
    contractProduct: ?SmartContractProduct,
    contractProductError: ?ErrorInUi,
    purchase: ?Purchase,
    gettingAllowance: boolean,
    settingAllowanceState: ?TransactionState,
    purchaseState: ?TransactionState,
    allowanceError: ?ErrorInUi,
}

type DispatchProps = {
    getContractProduct: (ProductId) => void,
    getAllowance: () => void,
    initPurchase: (ProductId) => void,
    onCancel: () => void,
    onSetAccessPeriod: (time: BN, timeUnit: TimeUnit) => void,
    onSetAllowance: () => void,
    onApprovePurchase: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

class PurchaseDialog extends React.Component<Props> {
    componentDidMount() {
        const { id } = this.props.match.params

        this.props.initPurchase(id)
        this.props.getContractProduct(id)
        this.props.getAllowance()
    }

    render() {
        const {
            gettingAllowance,
            settingAllowanceState,
            walletEnabled,
            step,
            product,
            fetchingContractProduct,
            contractProduct,
            contractProductError,
            purchaseState,
            purchase,
            onSetAccessPeriod,
            onSetAllowance,
            onApprovePurchase,
            onCancel,
            allowanceError,
        } = this.props

        if (product) {
            if (!walletEnabled) {
                return <UnlockWalletDialog onCancel={onCancel} />
            }

            // Check that product exists in contract
            if (!contractProduct || (!fetchingContractProduct && contractProductError)) {
                return (
                    <ErrorDialog
                        title={product.name}
                        message={!!contractProductError && contractProductError.message}
                        waiting={fetchingContractProduct}
                        onDismiss={onCancel}
                    />)
            }

            if (step === purchaseFlowSteps.ACCESS_PERIOD) {
                return (<ChooseAccessPeriodDialog
                    product={product}
                    onCancel={onCancel}
                    onNext={(time: NumberString, timeUnit: TimeUnit) => (
                        onSetAccessPeriod(time, timeUnit)
                    )}
                />)
            }

            if (purchase) {
                if (step === purchaseFlowSteps.ALLOWANCE) {
                    if (allowanceError) {
                        return (<ErrorDialog
                            title="An error occurred"
                            message={allowanceError.message}
                            onDismiss={onCancel}
                        />)
                    }
                    return (
                        <SetAllowanceDialog
                            onCancel={onCancel}
                            onSet={() => onSetAllowance()}
                            gettingAllowance={gettingAllowance}
                            settingAllowanceState={settingAllowanceState}
                        />
                    )
                }

                if (step === purchaseFlowSteps.SUMMARY) {
                    return (
                        <PurchaseSummaryDialog
                            purchaseState={purchaseState}
                            product={product}
                            purchase={purchase}
                            onCancel={onCancel}
                            onPay={() => onApprovePurchase()}
                        />
                    )
                }

                if (step === purchaseFlowSteps.COMPLETE) {
                    return <CompletePurchaseDialog onCancel={onCancel} purchaseState={purchaseState} />
                }
            }
        }

        return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    walletEnabled: selectEnabled(state),
    step: selectStep(state),
    product: selectProduct(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
    contractProduct: selectContractProduct(state),
    contractProductError: selectContractProductError(state),
    purchase: selectPurchaseData(state),
    gettingAllowance: selectGettingAllowance(state),
    settingAllowanceState: selectAllowanceTransactionState(state),
    purchaseState: selectPurchaseTransactionState(state),
    allowanceError: selectAllowanceError(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    getContractProduct: (id: ProductId) => dispatch(getProductFromContract(id)),
    getAllowance: () => dispatch(getAllowance()),
    initPurchase: (id: ProductId) => dispatch(initPurchase(id)),
    onCancel: () => {
        dispatch(push(formatPath(links.products, ownProps.match.params.id)))
        dispatch(hideModal())
        dispatch(setAllowanceFailure(null))
    },
    onSetAccessPeriod: (time: NumberString, timeUnit: TimeUnit) => dispatch(setAccessPeriod(time, timeUnit)),
    onSetAllowance: () => dispatch(setAllowance()),
    onApprovePurchase: () => dispatch(approvePurchase()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDialog)
