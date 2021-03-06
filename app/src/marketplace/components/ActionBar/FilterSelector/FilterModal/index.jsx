// @flow

import React, { type Node } from 'react'
import ReactModal2 from 'react-modal2'
import { Translate } from 'react-redux-i18n'

import Link from '$shared/components/Link'
import BodyClass, { NO_SCROLL } from '$shared/components/BodyClass'
import styles from './filterModal.pcss'

type Props = {
    title: Node,
    children: Node,
    onClear: () => void,
    onClose: () => void,
}

const FilterModal = ({ title, children, onClear, onClose }: Props) => (
    <ReactModal2
        onClose={onClose}
        modalClassName={styles.filterModal}
    >
        <BodyClass className={NO_SCROLL} />
        <div className={styles.modalContainer}>
            <div className={styles.header}>
                <Link href="#" className={styles.closeButton} onClick={onClose}>
                    <span className="icon-cross" />
                </Link>
                <span className={styles.title}>
                    {title}
                </span>
                <a
                    href="#"
                    className={styles.clearButton}
                    onClick={() => {
                        onClear()
                        onClose()
                    }}
                >
                    <Translate value="actionBar.clear" />
                </a>
            </div>
            <div className={styles.body}>
                {children}
            </div>
        </div>
    </ReactModal2>
)

export default FilterModal
