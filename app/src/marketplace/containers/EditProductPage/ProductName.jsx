// @flow

import React, { useContext } from 'react'
import cx from 'classnames'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import usePending from '$shared/hooks/usePending'
import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import Text, { SpaciousTheme } from '$shared/components/Input/Text'
import FormControlErrors, { MarketplaceTheme } from '$shared/components/FormControlErrors'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useEditableProduct()
    const { isValid, message } = useValidation('name')
    const { updateName } = useEditableProductActions()
    const { isTouched } = useContext(ValidationContext)
    const { isPending } = usePending('product.SAVE')
    const invalid = isTouched('name') && !isValid

    return (
        <section id="product-name" className={cx(styles.root, styles.ProductName)}>
            <div>
                <h1>Name your product</h1>
                <Text
                    value={product.name}
                    onCommit={updateName}
                    placeholder="Product Name"
                    disabled={isPending}
                    selectAllOnFocus
                    smartCommit
                    invalid={invalid}
                    className={styles.input}
                    theme={SpaciousTheme}
                />
                {invalid && (
                    <FormControlErrors theme={MarketplaceTheme}>
                        {message}
                    </FormControlErrors>
                )}
            </div>
        </section>
    )
}

export default ProductName
