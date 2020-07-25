import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as s3 from '@aws-cdk/aws-s3';

export class MyTestStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const role = new iam.Role(this, "acidBackendProcessingLambdaRole", {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      path: "/DigitalBooks/",
    });

    const bucket = new s3.Bucket(this, "UserImagesS3Bucket", {
      cors: [
        {
          allowedMethods: [ s3.HttpMethods.GET,
            s3.HttpMethods.HEAD,
            s3.HttpMethods.POST,
            s3.HttpMethods.PUT,
            ],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          exposedHeaders: ['ETag'],
        },
      ]
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
  }
}
