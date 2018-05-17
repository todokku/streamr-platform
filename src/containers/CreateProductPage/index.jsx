// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push, goBack } from 'react-router-redux'

import CreateProductPageComponent from '../../components/CreateProductPage'
import { selectAllCategories, selectFetchingCategories } from '../../modules/categories/selectors'
import { getCategories } from '../../modules/categories/actions'
import { selectFetchingStreams, selectStreams as selectAvailableStreams } from '../../modules/streams/selectors'
import { getStreams } from '../../modules/streams/actions'
import {
    updateProductField,
    initProduct,
    resetProduct,
    setImageToUpload,
    createProductAndRedirect,
} from '../../modules/createProduct/actions'
import { selectProduct, selectProductStreams, selectCategory, selectImageToUpload } from '../../modules/createProduct/selectors'
import { selectFetchingProduct } from '../../modules/product/selectors'
import { formatPath } from '../../utils/url'
import { showModal } from '../../modules/modals/actions'
import { SET_PRICE, CONFIRM_NO_COVER_IMAGE } from '../../utils/modals'
import { createProductValidator } from '../../validators'

import type { PriceDialogProps } from '../../components/Modal/SetPriceDialog'
import type { Address } from '../../flowtype/web3-types'
import type { CategoryList, Category } from '../../flowtype/category-types'
import type { StreamList } from '../../flowtype/stream-types'
import type { Product } from '../../flowtype/product-types'
import type { StoreState } from '../../flowtype/store-state'
import { selectAccountId } from '../../modules/web3/selectors'
import type { OnUploadError } from '../../components/ImageUpload'
import { notificationIcons } from '../../utils/constants'

import type { User } from '../../flowtype/user-types'
import { selectUserData } from '../../modules/user/selectors'
import { notifyErrors as notifyErrorsHelper } from '../../utils/validate'
import { showNotification as showNotificationAction } from '../../modules/notifications/actions'

import links from '../../links'

import { hasKnownHistory } from '../../utils/history'

export type OwnProps = {
    ownerAddress: ?Address,
}

type StateProps = {
    categories: CategoryList,
    category: ?Category,
    fetchingCategories: boolean,
    streams: StreamList,
    fetchingStreams: boolean,
    availableStreams: StreamList,
    product: ?Product,
    fetchingProduct: boolean,
    imageUpload: ?File,
    user: ?User,
}

type DispatchProps = {
    initProduct: () => void,
    getCategories: () => void,
    getStreams: () => void,
    onEditProp: (string, any) => void,
    onCancel: () => void,
    confirmNoCoverImage: (Function) => void,
    onPublish: () => void,
    setImageToUploadProp?: (File) => void,
    onSaveAndExit: () => void,
    onReset: () => void,
    onUploadError: OnUploadError,
    openPriceDialog: (PriceDialogProps) => void,
    notifyErrors: (errors: Object) => void,
}

type Props = OwnProps & StateProps & DispatchProps

class CreateProductPage extends Component<Props> {
    componentDidMount() {
        if (!this.props.product) {
            this.props.initProduct()
        }

        if (!this.props.fetchingCategories) {
            this.props.getCategories()
        }

        if ((!this.props.streams || this.props.streams.length === 0) && !this.props.fetchingStreams) {
            this.props.getStreams()
        }
    }

    componentWillUnmount() {
        this.props.onReset()
    }

    validateProductBeforeSaving = (nextAction: Function) => {
        const { product, notifyErrors } = this.props

        if (product) {
            createProductValidator(product)
                .then(() => {
                    this.confirmCoverImageBeforeSaving(nextAction)
                }, notifyErrors)
        }
    }
    confirmCoverImageBeforeSaving = (nextAction: Function) => {
        const { product, imageUpload, confirmNoCoverImage } = this.props

        if (product) {
            if (!product.imageUrl && !imageUpload) {
                confirmNoCoverImage(nextAction)
            } else {
                nextAction()
            }
        }
    }

    render() {
        const {
            product,
            categories,
            category,
            streams,
            availableStreams,
            fetchingStreams,
            fetchingProduct,
            onPublish,
            onSaveAndExit,
            openPriceDialog,
            setImageToUploadProp,
            onEditProp,
            ownerAddress,
            onCancel,
            user,
            onUploadError,
        } = this.props

        return !!product && !!categories && (
            <CreateProductPageComponent
                product={product}
                categories={categories}
                category={category}
                streams={streams}
                availableStreams={availableStreams}
                fetchingStreams={fetchingProduct || fetchingStreams}
                onUploadError={onUploadError}
                toolbarActions={{
                    saveAndExit: {
                        title: 'Save & Exit',
                        onClick: () => this.validateProductBeforeSaving(onSaveAndExit),
                    },
                    publish: {
                        title: 'Publish',
                        color: 'primary',
                        onClick: () => this.validateProductBeforeSaving(onPublish),
                        className: 'hidden-xs-down',
                    },
                }}
                setImageToUpload={setImageToUploadProp}
                openPriceDialog={openPriceDialog}
                onEdit={onEditProp}
                ownerAddress={ownerAddress}
                onCancel={onCancel}
                user={user}
            />
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    categories: selectAllCategories(state),
    category: selectCategory(state),
    fetchingCategories: selectFetchingCategories(state),
    streams: selectProductStreams(state),
    availableStreams: selectAvailableStreams(state),
    fetchingStreams: selectFetchingStreams(state),
    product: selectProduct(state),
    fetchingProduct: selectFetchingProduct(state),
    ownerAddress: selectAccountId(state),
    imageUpload: selectImageToUpload(state),
    user: selectUserData(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    initProduct: () => dispatch(initProduct()),
    getCategories: () => dispatch(getCategories(true)),
    getStreams: () => dispatch(getStreams()),
    onEditProp: (field: string, value: any) => dispatch(updateProductField(field, value)),
    setImageToUploadProp: (image: File) => dispatch(setImageToUpload(image)),
    onUploadError: (errorMessage: string) => dispatch(showNotificationAction(errorMessage, notificationIcons.ERROR)),
    confirmNoCoverImage: (onContinue: Function) => dispatch(showModal(CONFIRM_NO_COVER_IMAGE, {
        onContinue,
    })),
    onPublish: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id, 'publish'), 'PUBLISH'))
    },
    onSaveAndExit: () => {
        dispatch(createProductAndRedirect((id) => formatPath(links.products, id), 'SAVE'))
    },
    openPriceDialog: (props: PriceDialogProps) => dispatch(showModal(SET_PRICE, {
        ...props,
        requireWeb3: true,
    })),
    onReset: () => {
        dispatch(resetProduct())
    },
    onCancel: () => {
        dispatch(resetProduct())
        dispatch(hasKnownHistory() ? goBack() : push(links.myProducts))
    },
    notifyErrors: (errors: Object) => {
        notifyErrorsHelper(dispatch, errors)
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProductPage)
