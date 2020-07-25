import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class IamRoleCreateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const role = new iam.Role(this, "acidBackendProcessingLambdaRole", {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: "/DigitalBooks/",
    });

    const policy = new iam.Policy(this, "LambdaWriteCWLogs");
    policy.addStatements(new iam.PolicyStatement({
      resources: ['*'],
      actions: ['logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'xray:PutTraceSegments',
        'xray:PutTelemetryRecords'
      ],
      effect: iam.Effect.ALLOW,
      sid: 'AllowLogging',

    }));

    role.attachInlinePolicy(policy);
  }
}
