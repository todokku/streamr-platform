// @flow

import React from 'react'
import { Translate } from 'streamr-layout/dist/bundle'

import Dialog from '../Dialog/index'
import links from '../../../../../../marketplace/src/links'
import withI18n from '../../../../../../marketplace/src/containers/WithI18n/index'

import style from './setAllowanceDialog.pcss'

export type Props = {
    gettingAllowance: boolean,
    settingAllowance: boolean,
    onCancel: () => void,
    onSet: () => void,
    translate: (key: string, options: any) => string,
}

const HelpText = () => (
    <p className={style.helpText}>
        <Translate value="modal.setAllowance.helpText" allowanceLink={links.allowanceInfo} dangerousHTML />
    </p>
)

const SetAllowanceDialog = ({
    gettingAllowance,
    settingAllowance,
    onCancel,
    onSet,
    translate,
}: Props) => {
    if (settingAllowance) {
        return (
            <Dialog
                onClose={onCancel}
                title={translate('modal.setAllowance.started.title')}
                actions={{
                    cancel: {
                        title: translate('modal.common.cancel'),
                        onClick: onCancel,
                    },
                    publish: {
                        title: translate('modal.common.waiting'),
                        color: 'primary',
                        disabled: true,
                        spinner: true,
                    },
                }}
            >
                <div>
                    <p><Translate value="modal.setAllowance.started.message" dangerousHTML /></p>
                </div>
            </Dialog>
        )
    }

    return (
        <Dialog
            onClose={onCancel}
            title={translate('modal.setAllowance.title')}
            waiting={gettingAllowance}
            helpText={<HelpText />}
            actions={{
                cancel: {
                    title: translate('modal.common.cancel'),
                    outline: true,
                    onClick: onCancel,
                },
                next: {
                    title: translate('modal.common.next'),
                    color: 'primary',
                    outline: true,
                    onClick: () => onSet(),
                },
            }}
        >
            <p><Translate value="modal.setAllowance.message" dangerousHTML /></p>
        </Dialog>
    )
}

SetAllowanceDialog.defaultProps = {
    gettingAllowance: false,
    settingAllowance: false,
}

export default withI18n(SetAllowanceDialog)
