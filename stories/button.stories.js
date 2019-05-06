import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import {Button} from 'reactstrap';

storiesOf('Button', module)
    .add('with text', () =>
        <div>
            <Button>I'm enabled</Button>
            <Button disabled>I'm disabled</Button>
        </div>
    );
