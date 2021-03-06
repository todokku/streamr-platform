// @flow

import React, { Component, type Node } from 'react'

import CoreLayout from '$shared/components/Layout/Core'
import BodyClass from '$shared/components/BodyClass'
import Header from '../Header'

import './layout.pcss'

type Props = {
    children: Node,
    headerAdditionalComponent?: Node,
    headerSearchComponent?: Node,
    headerFilterComponent?: Node,
    noHeader?: boolean,
    loading?: boolean,
}

type State = {}

class UserpagesLayout extends Component<Props, State> {
    static defaultProps = {
        noHeader: false,
        loading: false,
    }

    render() {
        const {
            headerAdditionalComponent,
            headerSearchComponent,
            headerFilterComponent,
            noHeader,
            ...props
        } = this.props
        return (
            <CoreLayout
                {...props}
                footer={false}
                navComponent={(
                    <React.Fragment>
                        <BodyClass className="core" />
                        <Header
                            additionalComponent={headerAdditionalComponent}
                            searchComponent={headerSearchComponent}
                            filterComponent={headerFilterComponent}
                            noHeader={noHeader}
                        />
                    </React.Fragment>
                )}
            />
        )
    }
}

export default UserpagesLayout
