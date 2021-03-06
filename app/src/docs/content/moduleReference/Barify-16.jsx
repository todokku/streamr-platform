/* eslint-disable max-len */
import moduleDescription from './Barify-16.md'

export default {
    id: 16,
    name: 'Barify',
    path: 'Time Series: Utils',
    help: {
        outputNames: [
            'open',
            'high',
            'low',
            'close',
            'avg',
        ],
        inputs: {
            in: 'Input values',
        },
        helpText: moduleDescription,
        inputNames: [
            'in',
        ],
        params: {
            barLength: 'Length of the bar (time interval) in seconds',
        },
        outputs: {
            open: 'Value at start of period',
            high: 'Maximum value during period',
            avg: 'Simple average of values received during the period',
            low: 'Minimum value during period',
            close: 'Value at end of period (the most recent value)',
        },
        paramNames: [
            'barLength',
        ],
    },
    inputs: [
        {
            id: 'ep_z74NdQovQ36HOtPDPuy_iA',
            name: 'in',
            longName: 'Barify.in',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: true,
            canHaveInitialValue: true,
            initialValue: null,
        },
    ],
    outputs: [
        {
            id: 'ep_LlrzGW5FTp29EpeWawMlkA',
            name: 'open',
            longName: 'Barify.open',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_Ep_HIn23SsChrUHfvkfB5w',
            name: 'high',
            longName: 'Barify.high',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_t-ekTToOTbijzYpdGkoKGw',
            name: 'low',
            longName: 'Barify.low',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_MxwFzl7bQpyppDeYDBBeSw',
            name: 'close',
            longName: 'Barify.close',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_D1y-VWhJTKCbRN3Mz6K0Xw',
            name: 'avg',
            longName: 'Barify.avg',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_Aqy_PY93TLCICFOPY-k2Xg',
            name: 'sum',
            longName: 'Barify.sum',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
    ],
    params: [
        {
            id: 'ep_7EUAy1tkRAmrYXBkTTeflA',
            name: 'barLength',
            longName: 'Barify.barLength',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            value: 60,
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Double',
            ],
            requiresConnection: false,
            defaultValue: 60,
        },
    ],
}
