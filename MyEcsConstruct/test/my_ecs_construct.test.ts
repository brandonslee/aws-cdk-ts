import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as MyEcsConstruct from '../lib/my_ecs_construct-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new MyEcsConstruct.MyEcsConstructStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
