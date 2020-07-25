import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as IamRoleCreate from '../lib/iam_role_create-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new IamRoleCreate.IamRoleCreateStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
