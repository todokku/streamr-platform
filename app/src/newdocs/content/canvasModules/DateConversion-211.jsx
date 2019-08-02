/* eslint-disable max-len */
import moduleDescription from './DateConversion-211.md'

export default {
    id: 211,
    name: 'DateConversion',
    path: 'Time & Date',
    help: {
        params: {
            timezone: 'Timezone of the outputs',
            format: 'Format of the input and output string notations',
        },
        paramNames: [
            'timezone',
            'format',
        ],
        inputs: {
            date: 'Timestamp, string or Date',
        },
        inputNames: [
            'date',
        ],
        outputs: {
            date: 'String notation',
            ts: 'Timestamp(ms)',
            dayOfWeek: 'In shortened form, e.g. "Mon"',
        },
        outputNames: [
            'date',
            'ts',
            'dayOfWeek',
        ],
        helpText: moduleDescription,
    },
    inputs: [
        {
            id: 'ep_MHfdOtkJREy2Bv3WEcm_0g',
            name: 'date',
            longName: 'DateConversion.date',
            type: 'Date Double String',
            connected: false,
            canConnect: true,
            export: false,
            drivingInput: true,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'Date',
                'Double',
                'String',
            ],
            requiresConnection: true,
        },
    ],
    outputs: [
        {
            id: 'ep_ul6AG2hUQ-y44fHNSObemQ',
            name: 'date',
            longName: 'DateConversion.date',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_63YhB8vRQyy-8QFgROKgxQ',
            name: 'ts',
            longName: 'DateConversion.ts',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_iwGaDsgZThiDfsRYy3gaOw',
            name: 'dayOfWeek',
            longName: 'DateConversion.dayOfWeek',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_03onQ6p_S92bUN-LkwfqZg',
            name: 'years',
            longName: 'DateConversion.years',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_AApx7AJsTiSyt04WYzYqFw',
            name: 'months',
            longName: 'DateConversion.months',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_vXgx2IndSt-20NnhDozvBg',
            name: 'days',
            longName: 'DateConversion.days',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_loaKzyz_QtGZPpTSdpEC3w',
            name: 'hours',
            longName: 'DateConversion.hours',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_JnPxH7MQQL6t-ONaTSSWIg',
            name: 'minutes',
            longName: 'DateConversion.minutes',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_ye-iiBXYRXa0eXkLevQf4g',
            name: 'seconds',
            longName: 'DateConversion.seconds',
            type: 'Double',
            connected: false,
            canConnect: true,
            export: false,
            noRepeat: false,
            canBeNoRepeat: true,
        },
        {
            id: 'ep_7RERDIp7QlWvtnPoi-zMkQ',
            name: 'milliseconds',
            longName: 'DateConversion.milliseconds',
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
            id: 'ep_lIIfpkx7RkuRXMpQmN2xmA',
            name: 'timezone',
            longName: 'DateConversion.timezone',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'Europe/Helsinki',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: '',
            isTextArea: false,
        },
        {
            id: 'ep_ryB3TKVjTM6IHVe26-qL8g',
            name: 'format',
            longName: 'DateConversion.format',
            type: 'String',
            connected: false,
            canConnect: true,
            export: false,
            value: 'yyyy-MM-dd HH:mm:ss z',
            drivingInput: false,
            canToggleDrivingInput: true,
            acceptedTypes: [
                'String',
            ],
            requiresConnection: false,
            defaultValue: 'yyyy-MM-dd HH:mm:ss z',
            isTextArea: false,
        },
    ],
}
