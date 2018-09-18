// @flow

import React, { Fragment } from 'react'

import { Col } from 'reactstrap'
import { timeUnits } from '../../../../../../../marketplace/src/utils/constants'
import type { TimeUnit } from '../../../../../../../marketplace/src/flowtype/common-types'
import TimeUnitButton from '../TimeUnitButton/index'

import styles from './timeUnitSelector.pcss'

type Props = {
    selected: TimeUnit,
    onChange: (TimeUnit) => void,
}

export const TimeUnitSelector = ({ selected, onChange }: Props) => (
    <Fragment>
        {[timeUnits.hour, timeUnits.day, timeUnits.week, timeUnits.month].map((timeUnit) => (
            <Col xs={3} key={timeUnit}>
                <TimeUnitButton
                    active={timeUnit === selected}
                    value={timeUnit}
                    onClick={onChange}
                    className={styles.timeUnit}
                />
            </Col>
        ))}
    </Fragment>
)

export default TimeUnitSelector
