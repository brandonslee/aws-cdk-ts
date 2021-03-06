import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export class IamRoleCreateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Level2 Construct
    const role = new iam.Role(this, "acidBackendProcessingLambdaRole", {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: "/DigitalBooks/",
    });

    let policy = new iam.Policy(this, "LambdaWriteCWLogs");
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

    policy = new iam.Policy(this, "ReadFromUserImagesS3Bucket");
    policy.addStatements(new iam.PolicyStatement({
      resources: ['arn:aws:s3:::*'],
      actions: ['s3:Get*',
        's3:List*',
      ],
      effect: iam.Effect.ALLOW,
    }));
    role.attachInlinePolicy(policy);

    policy = new iam.Policy(this, 'WriteToUserImagesS3Bucket');
    policy.addStatements(new iam.PolicyStatement({
    }));

    // Level1 Construct
    const role2 = new iam.CfnRole(this, "acidCloudWatchLogging", {
      assumeRolePolicyDocument: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": [
                        "appsync.amazonaws.com"
                    ]
                },
                "Action": [
                    "sts:AssumeRole"
                ]
            }
        ]
      }

    });

    
  }
}
