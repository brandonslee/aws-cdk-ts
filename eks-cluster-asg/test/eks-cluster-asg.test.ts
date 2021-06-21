import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EksClusterAsg from '../lib/eks-cluster-asg-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new EksClusterAsg.EksClusterAsgStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
