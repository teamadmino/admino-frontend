import { ScreenConfig } from './admino-screen.interfaces';

export const testscreen: ScreenConfig = {
    sections: [
        {
            label: 'Törzsadatok',
            elements: [
                { type: 'input', id: 'firstname', config: { prefix: 'Dr.' } },
                { type: 'input', id: 'lastname' },
                { type: 'button', id: 'btn', label: 'something' },
            ]
        }, {
            elements: [
                { type: 'input', id: 'firstname2', config: { prefix: 'Dr.' } },
                { type: 'input', id: 'lastname3' },
            ]
        }
    ]

};

